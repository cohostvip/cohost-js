/**
 * Configuration options for initializing AuthClient
 */
export interface AuthConfig {
  /** Base URL for the auth API (e.g., 'https://api.cohost.vip' or '/api') */
  apiUrl: string;
  /** Optional channel ID for multi-tenant scenarios */
  channelId?: string;
  /** Storage type for tokens (default: 'localStorage') */
  storage?: 'localStorage' | 'sessionStorage' | 'memory';
  /** Enable debug logging */
  debug?: boolean;
  /** Auto-refresh tokens before expiry (default: true) */
  autoRefresh?: boolean;
  /** Refresh tokens this many seconds before expiry (default: 300 = 5 minutes) */
  refreshThreshold?: number;
  /**
   * Query string parameter name for token-based authentication (e.g., 'token' or 't').
   * If set, the client will check for this param and attempt to authenticate with it.
   * If not set, token param detection is disabled.
   */
  tokenParam?: string;
}

/**
 * User object returned from auth endpoints
 */
export interface AuthUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  provider: string;
  providerId: string;
}

/**
 * Token pair returned from authentication
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Result from authentication operations (sign-in, verify OTP, etc.)
 */
export interface AuthResult {
  user: AuthUser;
  customToken: string;
  isNewUser: boolean;
}

/**
 * Current authentication state
 */
export interface AuthState {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether auth state is being loaded/verified */
  isLoading: boolean;
  /** Current user if authenticated */
  user: AuthUser | null;
  /** Access token if authenticated */
  accessToken: string | null;
  /** Error if last operation failed */
  error: AuthError | null;
}

/**
 * Callback type for auth state changes
 */
export type AuthStateListener = (state: AuthState) => void;

/**
 * Unsubscribe function returned from onAuthStateChanged
 */
export type Unsubscribe = () => void;

/**
 * OTP contact type
 */
export type OTPType = 'email' | 'phone';

/**
 * OTP request input
 */
export interface OTPRequestInput {
  /** Contact (email or phone) to send OTP to */
  contact: string;
  /** Type of contact */
  type: OTPType;
  /** Optional channel ID */
  channelId?: string;
}

/**
 * OTP verify input
 */
export interface OTPVerifyInput {
  /** Contact (email or phone) that received the OTP */
  contact: string;
  /** OTP code to verify */
  code: string;
  /** Optional channel ID */
  channelId?: string;
}

/**
 * Input for manually setting authenticated state (for custom auth flows)
 */
export interface SetAuthenticatedInput {
  /** Access token */
  accessToken: string;
  /** User object */
  user: AuthUser;
  /** Refresh token (optional) */
  refreshToken?: string;
  /** Token expiry in seconds (default: 7 days) */
  expiresIn?: number;
}

/**
 * Token refresh input
 */
export interface TokenRefreshInput {
  /** Refresh token to exchange for new tokens */
  refreshToken: string;
  /** Optional channel ID */
  channelId?: string;
}

/**
 * Token validate input
 */
export interface TokenValidateInput {
  /** Access token to validate */
  accessToken: string;
}

/**
 * Token validate response
 */
export interface TokenValidateResult {
  valid: boolean;
  uid?: string;
  channelId?: string;
  exp?: number;
  iat?: number;
}

/**
 * Result from authenticating with a token
 */
export interface TokenAuthResult {
  /** Whether authentication succeeded */
  success: boolean;
  /** User if authentication succeeded */
  user?: AuthUser;
  /** Error message if authentication failed */
  error?: string;
}

/**
 * Error codes for auth operations
 */
export type AuthErrorCode =
  | 'INVALID_EMAIL'
  | 'INVALID_PHONE'
  | 'INVALID_CONTACT'
  | 'INVALID_OTP'
  | 'OTP_EXPIRED'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'UNAUTHORIZED'
  | 'NOT_AUTHENTICATED'
  | 'STORAGE_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Auth error with typed error codes
 */
export class AuthError extends Error {
  code: AuthErrorCode;
  statusCode?: number;
  originalError?: Error;

  constructor(message: string, code: AuthErrorCode, statusCode?: number, originalError?: Error) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.statusCode = statusCode;
    this.originalError = originalError;
  }

  static fromError(error: Error, code: AuthErrorCode = 'UNKNOWN_ERROR'): AuthError {
    if (error instanceof AuthError) {
      return error;
    }
    return new AuthError(error.message, code, undefined, error);
  }
}
