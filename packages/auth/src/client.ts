import {
  AuthConfig,
  AuthState,
  AuthUser,
  AuthStateListener,
  Unsubscribe,
  AuthError,
  OTPRequestInput,
  OTPVerifyInput,
  OTPType,
  SetAuthenticatedInput,
  TokenAuthResult,
} from './types';
import { authErrors } from './errors';
import { createStorage, TokenStorage } from './storage';
import { AuthApi } from './api';

const DEFAULT_REFRESH_THRESHOLD = 300; // 5 minutes in seconds

/**
 * Main auth client class for managing authentication state
 */
export class AuthClient {
  private config: Required<Omit<AuthConfig, 'channelId' | 'tokenParam'>> & { channelId?: string; tokenParam?: string };
  private storage: TokenStorage;
  private api: AuthApi;
  private state: AuthState;
  private listeners: Set<AuthStateListener> = new Set();
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private initialized = false;

  constructor(config: AuthConfig) {
    this.config = {
      apiUrl: config.apiUrl,
      channelId: config.channelId,
      tokenParam: config.tokenParam,
      storage: config.storage ?? 'localStorage',
      debug: config.debug ?? false,
      autoRefresh: config.autoRefresh ?? true,
      refreshThreshold: config.refreshThreshold ?? DEFAULT_REFRESH_THRESHOLD,
    };

    this.storage = createStorage(this.config.storage);
    this.api = new AuthApi(this.config.apiUrl, this.config.debug);

    // Initialize state
    this.state = {
      isAuthenticated: false,
      isLoading: true,
      user: null,
      accessToken: null,
      error: null,
    };
  }

  /**
   * Initialize the auth client by loading saved state
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.debug('Initializing auth client');

    try {
      const accessToken = this.storage.getAccessToken();
      const user = this.storage.getUser<AuthUser>();
      const expiry = this.storage.getTokenExpiry();

      if (accessToken && user && expiry) {
        // Check if token is expired
        const now = Math.floor(Date.now() / 1000);
        if (expiry > now) {
          // Token is valid, restore state
          this.updateState({
            isAuthenticated: true,
            isLoading: false,
            user,
            accessToken,
            error: null,
          });

          // Set up auto-refresh if enabled
          if (this.config.autoRefresh) {
            this.scheduleRefresh(expiry - now);
          }

          this.initialized = true;
          return;
        }

        // Token expired, try to refresh
        const refreshToken = this.storage.getRefreshToken();
        if (refreshToken) {
          await this.performRefresh(refreshToken);
          this.initialized = true;
          return;
        }
      }

      // No valid session, clear and set as not authenticated
      this.storage.clear();
      this.updateState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        accessToken: null,
        error: null,
      });
    } catch (error) {
      this.debug('Initialization error:', error);
      this.storage.clear();
      this.updateState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        accessToken: null,
        error: AuthError.fromError(error as Error),
      });
    }

    this.initialized = true;
  }

  // === Public API ===

  /**
   * Get current auth state
   */
  getState(): AuthState {
    return { ...this.state };
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChanged(listener: AuthStateListener): Unsubscribe {
    this.listeners.add(listener);
    // Immediately call with current state
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Check if user is authenticated
   */
  get isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  /**
   * Get current user
   */
  get currentUser(): AuthUser | null {
    return this.state.user;
  }

  /**
   * Get current access token
   */
  get accessToken(): string | null {
    return this.state.accessToken;
  }

  // === OTP Authentication ===

  /**
   * Request OTP code to be sent to contact (email or phone)
   * @param contact - Email address or phone number
   * @param type - Type of contact ('email' or 'phone')
   */
  async requestOTP(contact: string, type: OTPType = 'email'): Promise<boolean> {
    this.debug('Requesting OTP for:', contact, type);

    const input: OTPRequestInput = {
      contact,
      type,
      channelId: this.config.channelId,
    };

    const result = await this.api.requestOTP(input);
    return result.sent;
  }

  /**
   * Verify OTP code and sign in
   * @param contact - Email address or phone number that received the OTP
   * @param code - OTP code to verify
   */
  async verifyOTP(contact: string, code: string): Promise<AuthUser> {
    this.debug('Verifying OTP for:', contact);

    const input: OTPVerifyInput = {
      contact,
      code,
      channelId: this.config.channelId,
    };

    const result = await this.api.verifyOTP(input);

    // The customToken from verifyOTP is a JWT that we use as our access token
    // We need to also get a refresh token by calling refresh endpoint
    // For now, we'll store the customToken as access token
    // TODO: Backend should return both access and refresh tokens

    // Store tokens and user
    this.storage.setAccessToken(result.customToken);
    this.storage.setUser(result.user);

    // Set expiry (assume 7 days if not provided)
    const expiry = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    this.storage.setTokenExpiry(expiry);

    this.updateState({
      isAuthenticated: true,
      isLoading: false,
      user: result.user,
      accessToken: result.customToken,
      error: null,
    });

    if (this.config.autoRefresh) {
      this.scheduleRefresh(7 * 24 * 60 * 60);
    }

    return result.user;
  }

  // === Custom Auth Flow ===

  /**
   * Manually set authenticated state after a custom auth flow (e.g., passkey)
   * Use this when you handle authentication outside the standard OTP flow
   */
  setAuthenticated(input: SetAuthenticatedInput): void {
    this.debug('Setting authenticated state for:', input.user.uid);

    const { accessToken, user, refreshToken, expiresIn = 7 * 24 * 60 * 60 } = input;

    // Store tokens and user
    this.storage.setAccessToken(accessToken);
    this.storage.setUser(user);

    if (refreshToken) {
      this.storage.setRefreshToken(refreshToken);
    }

    const expiry = Math.floor(Date.now() / 1000) + expiresIn;
    this.storage.setTokenExpiry(expiry);

    this.updateState({
      isAuthenticated: true,
      isLoading: false,
      user,
      accessToken,
      error: null,
    });

    if (this.config.autoRefresh && refreshToken) {
      this.scheduleRefresh(expiresIn);
    }
  }

  /**
   * Get the configured token param name (if any)
   * Returns undefined if token param detection is disabled
   */
  get tokenParamName(): string | undefined {
    return this.config.tokenParam;
  }

  /**
   * Authenticate using a token (e.g., from URL query param).
   * Validates the token via API and sets auth state if valid.
   * @param token - The token to authenticate with
   * @returns Result indicating success/failure
   */
  async authenticateWithToken(token: string): Promise<TokenAuthResult> {
    this.debug('Authenticating with token');

    // Set loading state while authenticating
    this.updateState({
      ...this.state,
      isLoading: true,
      error: null,
    });

    try {
      // Validate the token via API
      const validateResult = await this.api.validateToken({ accessToken: token });

      if (!validateResult.valid || !validateResult.uid) {
        this.debug('Token validation failed: invalid token');
        this.updateState({
          ...this.state,
          isLoading: false,
        });
        return { success: false, error: 'Invalid token' };
      }

      // Get user info from the token
      const userResult = await this.api.getCurrentUser(token);

      // Calculate expiry from token
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = validateResult.exp ? validateResult.exp - now : 7 * 24 * 60 * 60;

      // Set authenticated state (this also sets isLoading: false)
      this.setAuthenticated({
        accessToken: token,
        user: userResult.user,
        expiresIn,
      });

      this.debug('Token authentication successful for:', userResult.user.uid);

      return { success: true, user: userResult.user };
    } catch (error) {
      this.debug('Token authentication failed:', error);
      this.updateState({
        ...this.state,
        isLoading: false,
        error: AuthError.fromError(error as Error, 'INVALID_TOKEN'),
      });
      const message = error instanceof Error ? error.message : 'Token authentication failed';
      return { success: false, error: message };
    }
  }

  // === Token Management ===

  /**
   * Get current access token, refreshing if needed
   */
  async getToken(): Promise<string | null> {
    if (!this.state.accessToken) {
      return null;
    }

    // Check if token needs refresh
    const expiry = this.storage.getTokenExpiry();
    const now = Math.floor(Date.now() / 1000);

    if (expiry && expiry - now < this.config.refreshThreshold) {
      const refreshToken = this.storage.getRefreshToken();
      if (refreshToken) {
        await this.performRefresh(refreshToken);
      }
    }

    return this.state.accessToken;
  }

  /**
   * Manually refresh the token
   */
  async refreshToken(): Promise<void> {
    const refreshToken = this.storage.getRefreshToken();
    if (!refreshToken) {
      throw authErrors.notAuthenticated();
    }
    await this.performRefresh(refreshToken);
  }

  /**
   * Sign out and clear all tokens
   */
  async signOut(): Promise<void> {
    this.debug('Signing out');

    // Cancel any pending refresh
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    // Try to revoke token on server (best effort)
    if (this.state.accessToken) {
      try {
        await this.api.revokeToken(this.state.accessToken);
      } catch (error) {
        this.debug('Revoke token error (ignored):', error);
      }
    }

    // Clear storage
    this.storage.clear();

    // Update state
    this.updateState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      accessToken: null,
      error: null,
    });
  }

  // === User ===

  /**
   * Get current user from server
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    if (!this.state.accessToken) {
      return null;
    }

    const result = await this.api.getCurrentUser(this.state.accessToken);

    // Update stored user
    this.storage.setUser(result.user);
    this.updateState({
      ...this.state,
      user: result.user,
    });

    return result.user;
  }

  // === Private Methods ===

  private updateState(newState: AuthState): void {
    this.state = newState;
    // Notify all listeners
    for (const listener of this.listeners) {
      try {
        listener(this.getState());
      } catch (error) {
        this.debug('Listener error:', error);
      }
    }
  }

  private async performRefresh(refreshToken: string): Promise<void> {
    this.debug('Refreshing token');

    try {
      const result = await this.api.refreshToken({
        refreshToken,
        channelId: this.config.channelId,
      });

      // Store new tokens
      this.storage.setAccessToken(result.accessToken);
      this.storage.setRefreshToken(result.refreshToken);

      const expiry = Math.floor(Date.now() / 1000) + result.expiresIn;
      this.storage.setTokenExpiry(expiry);

      // Update state with new token
      this.updateState({
        ...this.state,
        accessToken: result.accessToken,
        error: null,
      });

      // Schedule next refresh
      if (this.config.autoRefresh) {
        this.scheduleRefresh(result.expiresIn);
      }
    } catch (error) {
      this.debug('Refresh failed:', error);
      // On refresh failure, sign out
      this.storage.clear();
      this.updateState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        accessToken: null,
        error: AuthError.fromError(error as Error, 'TOKEN_EXPIRED'),
      });
    }
  }

  private scheduleRefresh(expiresIn: number): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Refresh when threshold is reached
    const refreshIn = Math.max(0, expiresIn - this.config.refreshThreshold) * 1000;

    this.debug(`Scheduling refresh in ${refreshIn / 1000}s`);

    this.refreshTimer = setTimeout(() => {
      const refreshToken = this.storage.getRefreshToken();
      if (refreshToken) {
        this.performRefresh(refreshToken);
      }
    }, refreshIn);
  }

  private debug(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[AuthClient]', ...args);
    }
  }
}
