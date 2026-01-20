// Main exports
export { AuthClient } from './client';
export { AuthApi } from './api';

// Storage
export { createStorage, type TokenStorage } from './storage';

// Types
export {
  type AuthConfig,
  type AuthState,
  type AuthUser,
  type AuthResult,
  type TokenPair,
  type AuthStateListener,
  type Unsubscribe,
  type OTPRequestInput,
  type OTPVerifyInput,
  type TokenRefreshInput,
  type TokenValidateInput,
  type TokenValidateResult,
  type AuthErrorCode,
  AuthError,
} from './types';

// Errors
export { authErrors } from './errors';

import { AuthClient } from './client';
import { AuthConfig } from './types';

/**
 * Factory function for creating an AuthClient instance
 *
 * @example
 * ```ts
 * import { createAuthClient } from '@cohostvip/cohost-auth';
 *
 * const auth = createAuthClient({
 *   apiUrl: 'https://api.cohost.vip',
 *   channelId: 'my-channel',
 * });
 *
 * await auth.initialize();
 *
 * // Request OTP
 * await auth.requestOTP('user@example.com');
 *
 * // Verify OTP
 * const user = await auth.verifyOTP('user@example.com', '123456');
 *
 * // Check auth state
 * if (auth.isAuthenticated) {
 *   console.log('Logged in as:', auth.currentUser?.email);
 * }
 *
 * // Listen for auth changes
 * auth.onAuthStateChanged((state) => {
 *   console.log('Auth state changed:', state);
 * });
 *
 * // Sign out
 * await auth.signOut();
 * ```
 */
export function createAuthClient(config: AuthConfig): AuthClient {
  return new AuthClient(config);
}
