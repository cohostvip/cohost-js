import { AuthError, AuthErrorCode } from './types';

/**
 * Factory functions for creating typed auth errors
 */
export const authErrors = {
  invalidEmail: () => new AuthError('Invalid email address', 'INVALID_EMAIL', 400),

  invalidOTP: () => new AuthError('Invalid or incorrect OTP code', 'INVALID_OTP', 400),

  otpExpired: () => new AuthError('OTP code has expired', 'OTP_EXPIRED', 400),

  invalidToken: () => new AuthError('Invalid token', 'INVALID_TOKEN', 401),

  tokenExpired: () => new AuthError('Token has expired', 'TOKEN_EXPIRED', 401),

  networkError: (message = 'Network request failed') =>
    new AuthError(message, 'NETWORK_ERROR'),

  serverError: (message = 'Server error', statusCode = 500) =>
    new AuthError(message, 'SERVER_ERROR', statusCode),

  unauthorized: () => new AuthError('Unauthorized', 'UNAUTHORIZED', 401),

  notAuthenticated: () => new AuthError('User is not authenticated', 'NOT_AUTHENTICATED'),

  storageError: (message = 'Storage operation failed') =>
    new AuthError(message, 'STORAGE_ERROR'),

  unknown: (message = 'An unknown error occurred') =>
    new AuthError(message, 'UNKNOWN_ERROR'),
};

/**
 * Parse error response from API
 */
export function parseApiError(response: Response, body: unknown): AuthError {
  const statusCode = response.status;

  // Try to extract error message from response body
  let message = response.statusText || 'Request failed';
  if (typeof body === 'object' && body !== null) {
    const errorBody = body as { error?: string; message?: string };
    message = errorBody.error || errorBody.message || message;
  } else if (typeof body === 'string') {
    message = body;
  }

  // Map status codes to error codes
  let code: AuthErrorCode;
  switch (statusCode) {
    case 400:
      // Could be invalid email, invalid OTP, etc. - use generic for now
      code = 'INVALID_TOKEN';
      break;
    case 401:
      code = 'UNAUTHORIZED';
      break;
    case 403:
      code = 'UNAUTHORIZED';
      break;
    case 404:
      code = 'SERVER_ERROR';
      break;
    default:
      code = statusCode >= 500 ? 'SERVER_ERROR' : 'UNKNOWN_ERROR';
  }

  return new AuthError(message, code, statusCode);
}
