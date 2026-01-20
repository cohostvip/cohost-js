import { useContext } from 'react';
import type { AuthClient, AuthUser } from '@cohostvip/cohost-auth';
import { AuthContext, type AuthContextValue } from './AuthContext';

/**
 * Hook to access auth state and methods
 *
 * @throws Error if used outside of AuthProvider
 *
 * @example
 * ```tsx
 * function LoginButton() {
 *   const { state, requestOTP, verifyOTP, signOut } = useAuth();
 *
 *   if (state.isLoading) return <Loading />;
 *   if (state.isAuthenticated) {
 *     return <button onClick={signOut}>Sign Out</button>;
 *   }
 *   return <button onClick={() => requestOTP('user@example.com')}>Sign In</button>;
 * }
 * ```
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

/**
 * Hook to access the current user
 * Returns null if not authenticated
 *
 * @throws Error if used outside of AuthProvider
 *
 * @example
 * ```tsx
 * function Profile() {
 *   const user = useUser();
 *
 *   if (!user) return <div>Not logged in</div>;
 *   return <div>Welcome, {user.displayName || user.email}</div>;
 * }
 * ```
 */
export function useUser(): AuthUser | null {
  const { state } = useAuth();
  return state.user;
}

/**
 * Hook to access the raw AuthClient instance
 * Useful for advanced use cases or accessing methods not exposed by useAuth
 *
 * @throws Error if used outside of AuthProvider
 *
 * @example
 * ```tsx
 * function TokenDisplay() {
 *   const client = useAuthClient();
 *   const [token, setToken] = useState<string | null>(null);
 *
 *   useEffect(() => {
 *     client.getToken().then(setToken);
 *   }, [client]);
 *
 *   return <div>Token: {token}</div>;
 * }
 * ```
 */
export function useAuthClient(): AuthClient {
  const { client } = useAuth();
  return client;
}
