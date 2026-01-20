import * as React from 'react';
import { useAuth } from './hooks';

/**
 * Props for AuthGuard component
 */
export interface AuthGuardProps {
  /** Content to render when authenticated */
  children: React.ReactNode;
  /** Content to render while loading auth state (default: null) */
  loadingFallback?: React.ReactNode;
  /** Content to render when not authenticated (default: null) */
  unauthenticatedFallback?: React.ReactNode;
  /** Callback when user is not authenticated (e.g., for redirects) */
  onUnauthenticated?: () => void;
}

/**
 * Component that only renders children when authenticated
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AuthGuard>
 *   <ProtectedContent />
 * </AuthGuard>
 *
 * // With fallbacks
 * <AuthGuard
 *   loadingFallback={<Spinner />}
 *   unauthenticatedFallback={<LoginPrompt />}
 * >
 *   <Dashboard />
 * </AuthGuard>
 *
 * // With redirect callback
 * <AuthGuard
 *   onUnauthenticated={() => router.push('/login')}
 *   loadingFallback={<Spinner />}
 * >
 *   <AdminPanel />
 * </AuthGuard>
 * ```
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  loadingFallback = null,
  unauthenticatedFallback = null,
  onUnauthenticated,
}) => {
  const { state } = useAuth();

  // Show loading fallback while auth state is being determined
  if (state.isLoading) {
    return <>{loadingFallback}</>;
  }

  // Handle unauthenticated state
  if (!state.isAuthenticated) {
    // Call redirect callback if provided
    if (onUnauthenticated) {
      onUnauthenticated();
    }
    return <>{unauthenticatedFallback}</>;
  }

  // User is authenticated, render children
  return <>{children}</>;
};
