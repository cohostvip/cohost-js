import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { AuthClient } from '../client';
import { AuthState } from '../types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AuthClient', () => {
  let client: AuthClient;

  beforeEach(() => {
    mockFetch.mockReset();
    vi.useFakeTimers();
    client = new AuthClient({
      apiUrl: 'https://api.example.com',
      storage: 'memory',
      autoRefresh: false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockOkResponse = (data: unknown) => ({
    ok: true,
    status: 200,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => ({ status: 'ok', data }),
  });

  describe('initialization', () => {
    it('should start with loading state', () => {
      const state = client.getState();
      expect(state.isLoading).toBe(true);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    it('should set not authenticated after initialize with no stored tokens', async () => {
      await client.initialize();
      const state = client.getState();
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
    });

    it('should only initialize once', async () => {
      await client.initialize();
      const state1 = client.getState();

      await client.initialize();
      const state2 = client.getState();

      expect(state1).toEqual(state2);
    });
  });

  describe('requestOTP', () => {
    it('should call API and return success', async () => {
      mockFetch.mockResolvedValue(mockOkResponse({ sent: true }));

      const result = await client.requestOTP('test@example.com', 'email');

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/otp/request',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('test@example.com'),
        })
      );
    });
  });

  describe('verifyOTP', () => {
    it('should authenticate user on successful verification', async () => {
      const authResult = {
        user: {
          uid: '123',
          email: 'test@example.com',
          emailVerified: true,
          provider: 'otp',
          providerId: 'cohost',
        },
        customToken: 'jwt-token-123',
        isNewUser: false,
      };
      mockFetch.mockResolvedValue(mockOkResponse(authResult));

      const user = await client.verifyOTP('test@example.com', '123456');

      expect(user.uid).toBe('123');
      expect(user.email).toBe('test@example.com');
      expect(client.isAuthenticated).toBe(true);
      expect(client.currentUser?.email).toBe('test@example.com');
      expect(client.accessToken).toBe('jwt-token-123');
    });
  });

  describe('signOut', () => {
    it('should clear auth state', async () => {
      // First sign in
      const authResult = {
        user: { uid: '123', email: 'test@example.com', emailVerified: true, provider: 'otp', providerId: 'cohost' },
        customToken: 'jwt-token',
        isNewUser: false,
      };
      mockFetch.mockResolvedValue(mockOkResponse(authResult));
      await client.verifyOTP('test@example.com', '123456');

      expect(client.isAuthenticated).toBe(true);

      // Mock revoke call
      mockFetch.mockResolvedValue(mockOkResponse({ revoked: true }));

      // Sign out
      await client.signOut();

      expect(client.isAuthenticated).toBe(false);
      expect(client.currentUser).toBeNull();
      expect(client.accessToken).toBeNull();
    });
  });

  describe('onAuthStateChanged', () => {
    it('should call listener immediately with current state', () => {
      const listener = vi.fn();

      client.onAuthStateChanged(listener);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          isAuthenticated: false,
          isLoading: true,
        })
      );
    });

    it('should call listener when auth state changes', async () => {
      const states: AuthState[] = [];
      const listener = (state: AuthState) => states.push({ ...state });

      client.onAuthStateChanged(listener);

      // Initial call
      expect(states.length).toBe(1);

      // Sign in
      const authResult = {
        user: { uid: '123', email: 'test@example.com', emailVerified: true, provider: 'otp', providerId: 'cohost' },
        customToken: 'jwt-token',
        isNewUser: false,
      };
      mockFetch.mockResolvedValue(mockOkResponse(authResult));
      await client.verifyOTP('test@example.com', '123456');

      // Should have been called again
      expect(states.length).toBe(2);
      expect(states[1].isAuthenticated).toBe(true);
    });

    it('should return unsubscribe function', async () => {
      const listener = vi.fn();

      const unsubscribe = client.onAuthStateChanged(listener);

      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();

      // Sign in - should not call listener
      const authResult = {
        user: { uid: '123', email: 'test@example.com', emailVerified: true, provider: 'otp', providerId: 'cohost' },
        customToken: 'jwt-token',
        isNewUser: false,
      };
      mockFetch.mockResolvedValue(mockOkResponse(authResult));
      await client.verifyOTP('test@example.com', '123456');

      // Still only 1 call (the initial one)
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when not authenticated', async () => {
      const user = await client.getCurrentUser();
      expect(user).toBeNull();
    });

    it('should fetch and update user when authenticated', async () => {
      // Sign in first
      const authResult = {
        user: { uid: '123', email: 'test@example.com', emailVerified: true, provider: 'otp', providerId: 'cohost' },
        customToken: 'jwt-token',
        isNewUser: false,
      };
      mockFetch.mockResolvedValue(mockOkResponse(authResult));
      await client.verifyOTP('test@example.com', '123456');

      // Mock getCurrentUser response with updated user
      const updatedUser = {
        user: {
          uid: '123',
          email: 'test@example.com',
          emailVerified: true,
          displayName: 'Test User',
          provider: 'otp',
          providerId: 'cohost',
        },
        channelId: 'channel-1',
      };
      mockFetch.mockResolvedValue(mockOkResponse(updatedUser));

      const user = await client.getCurrentUser();

      expect(user?.displayName).toBe('Test User');
      expect(client.currentUser?.displayName).toBe('Test User');
    });
  });

  describe('getToken', () => {
    it('should return null when not authenticated', async () => {
      const token = await client.getToken();
      expect(token).toBeNull();
    });

    it('should return token when authenticated', async () => {
      const authResult = {
        user: { uid: '123', email: 'test@example.com', emailVerified: true, provider: 'otp', providerId: 'cohost' },
        customToken: 'jwt-token-abc',
        isNewUser: false,
      };
      mockFetch.mockResolvedValue(mockOkResponse(authResult));
      await client.verifyOTP('test@example.com', '123456');

      const token = await client.getToken();
      expect(token).toBe('jwt-token-abc');
    });
  });
});
