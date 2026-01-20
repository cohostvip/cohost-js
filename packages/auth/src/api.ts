import {
  AuthResult,
  AuthUser,
  TokenPair,
  TokenValidateResult,
  OTPRequestInput,
  OTPVerifyInput,
  TokenRefreshInput,
  TokenValidateInput,
} from './types';
import { parseApiError, authErrors } from './errors';

/**
 * API response wrapper
 */
interface ApiResponse<T> {
  status: 'ok' | 'error';
  data: T;
}

/**
 * Options for API requests
 */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
}

/**
 * Auth API client for making requests to auth endpoints
 */
export class AuthApi {
  private baseUrl: string;
  private debug: boolean;

  constructor(baseUrl: string, debug = false) {
    // Remove trailing slash if present
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.debug = debug;
  }

  /**
   * Make an authenticated or unauthenticated request
   */
  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, token } = options;

    const url = `${this.baseUrl}${path}`;

    const reqHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (token) {
      reqHeaders['Authorization'] = `Bearer ${token}`;
    }

    if (this.debug) {
      console.log(`[AuthClient] ${method} ${url}`);
      if (body) {
        console.log('[AuthClient] Body:', JSON.stringify(body));
      }
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers: reqHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      throw authErrors.networkError(
        error instanceof Error ? error.message : 'Network request failed'
      );
    }

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const responseBody = isJson ? await response.json() : await response.text();

    if (this.debug) {
      console.log(`[AuthClient] Response (${response.status}):`, responseBody);
    }

    if (!response.ok) {
      throw parseApiError(response, responseBody);
    }

    // Unwrap API response format { status: 'ok', data: ... }
    if (
      typeof responseBody === 'object' &&
      responseBody !== null &&
      (responseBody as ApiResponse<T>).status === 'ok' &&
      'data' in responseBody
    ) {
      return (responseBody as ApiResponse<T>).data;
    }

    return responseBody as T;
  }

  // === OTP Methods ===

  /**
   * Request OTP code to be sent to email
   */
  async requestOTP(input: OTPRequestInput): Promise<{ sent: boolean }> {
    return this.request('/v1/auth/otp/request', {
      method: 'POST',
      body: input,
    });
  }

  /**
   * Verify OTP code and get auth result
   */
  async verifyOTP(input: OTPVerifyInput): Promise<AuthResult> {
    return this.request('/v1/auth/otp/verify', {
      method: 'POST',
      body: input,
    });
  }

  // === Token Methods ===

  /**
   * Refresh token pair using refresh token
   */
  async refreshToken(input: TokenRefreshInput): Promise<TokenPair> {
    return this.request('/v1/auth/token/refresh', {
      method: 'POST',
      body: input,
    });
  }

  /**
   * Validate access token
   */
  async validateToken(input: TokenValidateInput): Promise<TokenValidateResult> {
    return this.request('/v1/auth/token/validate', {
      method: 'POST',
      body: input,
    });
  }

  /**
   * Revoke token (sign out)
   */
  async revokeToken(token: string): Promise<{ revoked: boolean }> {
    return this.request('/v1/auth/token/revoke', {
      method: 'POST',
      token,
    });
  }

  // === User Methods ===

  /**
   * Get current authenticated user
   */
  async getCurrentUser(token: string): Promise<{ user: AuthUser; channelId?: string }> {
    return this.request('/v1/auth/me', {
      method: 'GET',
      token,
    });
  }
}
