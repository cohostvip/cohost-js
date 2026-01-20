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
  type OTPType,
  type OTPRequestInput,
  type OTPVerifyInput,
  type SetAuthenticatedInput,
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
 * // apiUrl should include the auth path prefix
 * const auth = createAuthClient({
 *   apiUrl: 'https://api.cohost.vip/v1/auth', // or '/auth' for relative paths
 *   channelId: 'my-channel',
 * });
 *
 * await auth.initialize();
 *
 * // Request OTP (email or phone)
 * await auth.requestOTP('user@example.com', 'email');
 * await auth.requestOTP('+1234567890', 'phone');
 *
 * // Verify OTP
 * const user = await auth.verifyOTP('user@example.com', '123456');
 *
 * // For custom auth flows (e.g., passkey), use setAuthenticated
 * auth.setAuthenticated({
 *   accessToken: 'token-from-custom-flow',
 *   user: { uid: '123', email: 'user@example.com', ... },
 * });
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
