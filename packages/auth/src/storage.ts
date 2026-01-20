import { AuthError } from './types';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'cohost_auth_access_token',
  REFRESH_TOKEN: 'cohost_auth_refresh_token',
  TOKEN_EXPIRY: 'cohost_auth_token_expiry',
  USER: 'cohost_auth_user',
} as const;

/**
 * Storage abstraction interface for token persistence
 */
export interface TokenStorage {
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  getRefreshToken(): string | null;
  setRefreshToken(token: string): void;
  getTokenExpiry(): number | null;
  setTokenExpiry(expiry: number): void;
  getUser<T>(): T | null;
  setUser<T>(user: T): void;
  clear(): void;
}

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Web storage implementation (localStorage/sessionStorage)
 */
class WebStorage implements TokenStorage {
  private storage: Storage;

  constructor(type: 'localStorage' | 'sessionStorage') {
    if (!isBrowser()) {
      throw new AuthError(
        'Web storage is not available in this environment',
        'STORAGE_ERROR'
      );
    }
    this.storage = type === 'localStorage' ? window.localStorage : window.sessionStorage;
  }

  getAccessToken(): string | null {
    try {
      return this.storage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    } catch {
      return null;
    }
  }

  setAccessToken(token: string): void {
    try {
      this.storage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
    } catch (error) {
      throw new AuthError('Failed to save access token', 'STORAGE_ERROR');
    }
  }

  getRefreshToken(): string | null {
    try {
      return this.storage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    } catch {
      return null;
    }
  }

  setRefreshToken(token: string): void {
    try {
      this.storage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      throw new AuthError('Failed to save refresh token', 'STORAGE_ERROR');
    }
  }

  getTokenExpiry(): number | null {
    try {
      const expiry = this.storage.getItem(TOKEN_KEYS.TOKEN_EXPIRY);
      return expiry ? parseInt(expiry, 10) : null;
    } catch {
      return null;
    }
  }

  setTokenExpiry(expiry: number): void {
    try {
      this.storage.setItem(TOKEN_KEYS.TOKEN_EXPIRY, expiry.toString());
    } catch (error) {
      throw new AuthError('Failed to save token expiry', 'STORAGE_ERROR');
    }
  }

  getUser<T>(): T | null {
    try {
      const user = this.storage.getItem(TOKEN_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  setUser<T>(user: T): void {
    try {
      this.storage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      throw new AuthError('Failed to save user', 'STORAGE_ERROR');
    }
  }

  clear(): void {
    try {
      this.storage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
      this.storage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
      this.storage.removeItem(TOKEN_KEYS.TOKEN_EXPIRY);
      this.storage.removeItem(TOKEN_KEYS.USER);
    } catch {
      // Silently fail on clear errors
    }
  }
}

/**
 * In-memory storage implementation (for SSR or non-browser environments)
 */
class MemoryStorage implements TokenStorage {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private user: unknown = null;

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  setRefreshToken(token: string): void {
    this.refreshToken = token;
  }

  getTokenExpiry(): number | null {
    return this.tokenExpiry;
  }

  setTokenExpiry(expiry: number): void {
    this.tokenExpiry = expiry;
  }

  getUser<T>(): T | null {
    return this.user as T | null;
  }

  setUser<T>(user: T): void {
    this.user = user;
  }

  clear(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    this.user = null;
  }
}

/**
 * Create a storage instance based on type
 */
export function createStorage(type: 'localStorage' | 'sessionStorage' | 'memory'): TokenStorage {
  if (type === 'memory' || !isBrowser()) {
    return new MemoryStorage();
  }
  return new WebStorage(type);
}

export { MemoryStorage, WebStorage };
