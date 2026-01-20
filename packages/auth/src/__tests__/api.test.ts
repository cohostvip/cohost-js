import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthApi } from '../api';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AuthApi', () => {
  let api: AuthApi;

  beforeEach(() => {
    mockFetch.mockReset();
    api = new AuthApi('https://api.example.com');
  });

  const mockOkResponse = (data: unknown) => ({
    ok: true,
    status: 200,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => ({ status: 'ok', data }),
  });

  const mockErrorResponse = (status: number, error: string) => ({
    ok: false,
    status,
    statusText: 'Error',
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => ({ error }),
  });

  describe('requestOTP', () => {
    it('should call correct endpoint with email', async () => {
      mockFetch.mockResolvedValue(mockOkResponse({ sent: true }));

      const result = await api.requestOTP({ email: 'test@example.com' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/v1/auth/otp/request',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ email: 'test@example.com' }),
        })
      );
      expect(result).toEqual({ sent: true });
    });

    it('should include channelId when provided', async () => {
      mockFetch.mockResolvedValue(mockOkResponse({ sent: true }));

      await api.requestOTP({ email: 'test@example.com', channelId: 'channel-1' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ email: 'test@example.com', channelId: 'channel-1' }),
        })
      );
    });
  });

  describe('verifyOTP', () => {
    it('should call correct endpoint and return auth result', async () => {
      const authResult = {
        user: { uid: '123', email: 'test@example.com', emailVerified: true, provider: 'otp', providerId: 'cohost' },
        customToken: 'jwt-token',
        isNewUser: false,
      };
      mockFetch.mockResolvedValue(mockOkResponse(authResult));

      const result = await api.verifyOTP({
        email: 'test@example.com',
        code: '123456',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/v1/auth/otp/verify',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', code: '123456' }),
        })
      );
      expect(result).toEqual(authResult);
    });
  });

  describe('refreshToken', () => {
    it('should call correct endpoint with refresh token', async () => {
      const tokenPair = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 604800,
      };
      mockFetch.mockResolvedValue(mockOkResponse(tokenPair));

      const result = await api.refreshToken({ refreshToken: 'old-refresh-token' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/v1/auth/token/refresh',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ refreshToken: 'old-refresh-token' }),
        })
      );
      expect(result).toEqual(tokenPair);
    });
  });

  describe('validateToken', () => {
    it('should call correct endpoint with access token', async () => {
      const validateResult = { valid: true, uid: '123', exp: 12345, iat: 12340 };
      mockFetch.mockResolvedValue(mockOkResponse(validateResult));

      const result = await api.validateToken({ accessToken: 'test-token' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/v1/auth/token/validate',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ accessToken: 'test-token' }),
        })
      );
      expect(result).toEqual(validateResult);
    });
  });

  describe('revokeToken', () => {
    it('should call correct endpoint with bearer token', async () => {
      mockFetch.mockResolvedValue(mockOkResponse({ revoked: true }));

      const result = await api.revokeToken('token-to-revoke');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/v1/auth/token/revoke',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer token-to-revoke',
          }),
        })
      );
      expect(result).toEqual({ revoked: true });
    });
  });

  describe('getCurrentUser', () => {
    it('should call correct endpoint with bearer token', async () => {
      const userResult = {
        user: { uid: '123', email: 'test@example.com', emailVerified: true, provider: 'otp', providerId: 'cohost' },
        channelId: 'channel-1',
      };
      mockFetch.mockResolvedValue(mockOkResponse(userResult));

      const result = await api.getCurrentUser('access-token');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/v1/auth/me',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer access-token',
          }),
        })
      );
      expect(result).toEqual(userResult);
    });
  });

  describe('error handling', () => {
    it('should throw AuthError on API error', async () => {
      mockFetch.mockResolvedValue(mockErrorResponse(401, 'Invalid token'));

      await expect(api.validateToken({ accessToken: 'invalid' })).rejects.toThrow('Invalid token');
    });

    it('should throw network error on fetch failure', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(api.requestOTP({ email: 'test@example.com' })).rejects.toThrow('Network error');
    });
  });
});
