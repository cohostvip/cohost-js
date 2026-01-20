import * as React from 'react';
import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  AuthClient,
  createAuthClient,
  type AuthConfig,
  type AuthState,
  type AuthUser,
  type OTPType,
  type SetAuthenticatedInput,
} from '@cohostvip/cohost-auth';

/**
 * Value provided by AuthContext
 */
export interface AuthContextValue {
  /** Current auth state */
  state: AuthState;
  /** The underlying AuthClient instance */
  client: AuthClient;
  /** Request OTP to be sent to contact (email or phone) */
  requestOTP: (contact: string, type?: OTPType) => Promise<boolean>;
  /** Verify OTP and sign in */
  verifyOTP: (contact: string, code: string) => Promise<AuthUser>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
  /** Get current access token (refreshing if needed) */
  getToken: () => Promise<string | null>;
  /** Manually set authenticated state (for custom auth flows like passkey) */
  setAuthenticated: (input: SetAuthenticatedInput) => void;
}

/**
 * Props for AuthProvider
 */
export type AuthProviderProps = {
  /** Children to render */
  children: React.ReactNode;
} & (
  | {
      /** Auth configuration (creates a new client) */
      config: AuthConfig;
      /** Pre-existing client (mutually exclusive with config) */
      client?: never;
    }
  | {
      /** Auth configuration */
      config?: never;
      /** Pre-existing AuthClient instance */
      client: AuthClient;
    }
);

export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Provider component that wraps your app and provides auth context
 *
 * @example
 * ```tsx
 * import { AuthProvider } from '@cohostvip/cohost-react';
 *
 * function App() {
 *   return (
 *     <AuthProvider config={{ apiUrl: '/api' }}>
 *       <MyApp />
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  config,
  client: providedClient,
}) => {
  // Create or use provided client (stable reference)
  const clientRef = useRef<AuthClient | null>(null);
  if (!clientRef.current) {
    clientRef.current = providedClient ?? createAuthClient(config!);
  }
  const client = clientRef.current;

  // Track auth state
  const [state, setState] = useState<AuthState>(() => client.getState());

  // Initialize client and subscribe to state changes
  useEffect(() => {
    // Initialize on mount
    client.initialize();

    // Subscribe to state changes
    const unsubscribe = client.onAuthStateChanged((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
    };
  }, [client]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<AuthContextValue>(
    () => ({
      state,
      client,
      requestOTP: (contact: string, type?: OTPType) => client.requestOTP(contact, type),
      verifyOTP: (contact: string, code: string) => client.verifyOTP(contact, code),
      signOut: () => client.signOut(),
      getToken: () => client.getToken(),
      setAuthenticated: (input: SetAuthenticatedInput) => client.setAuthenticated(input),
    }),
    [state, client]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
