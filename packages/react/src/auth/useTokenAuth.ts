import { useEffect, useRef, useCallback } from 'react';
import type { TokenAuthResult } from '@cohostvip/cohost-auth';
import { useAuthClient } from './hooks';

/**
 * Options for useTokenAuth hook
 */
export interface UseTokenAuthOptions {
  /**
   * Callback when token authentication completes (success or failure).
   * Called before the page is refreshed.
   */
  onComplete?: (result: TokenAuthResult) => void;
}

/**
 * Hook that handles token-based authentication from URL query params.
 *
 * When the configured `tokenParam` is found in the URL:
 * 1. Validates the token via API
 * 2. If valid, sets authenticated state
 * 3. Removes the token from URL and refreshes (or replaces history)
 *
 * @example
 * ```tsx
 * // In your app's root component or layout
 * function App() {
 *   useTokenAuth({
 *     onComplete: (result) => {
 *       if (result.success) {
 *         console.log('Logged in as:', result.user?.email);
 *       } else {
 *         console.log('Token auth failed:', result.error);
 *       }
 *     }
 *   });
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useTokenAuth(options: UseTokenAuthOptions = {}): void {
  const client = useAuthClient();
  const { onComplete } = options;
  const processedRef = useRef(false);

  const processToken = useCallback(async () => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Only process once per mount
    if (processedRef.current) return;

    // Check if tokenParam is configured
    const tokenParam = client.tokenParamName;
    if (!tokenParam) return;

    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get(tokenParam);

    if (!token) return;

    // Mark as processed to prevent duplicate processing
    processedRef.current = true;

    // Authenticate with the token
    const result = await client.authenticateWithToken(token);

    // Call onComplete callback
    onComplete?.(result);

    // Remove token from URL
    urlParams.delete(tokenParam);
    const newSearch = urlParams.toString();
    const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;

    // Replace history state to remove token, then refresh to clean up
    window.history.replaceState({}, '', newUrl);

    // Refresh the page to ensure clean state
    window.location.reload();
  }, [client, onComplete]);

  useEffect(() => {
    processToken();
  }, [processToken]);
}
