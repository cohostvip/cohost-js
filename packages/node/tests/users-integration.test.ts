import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersAPI } from '../src/api/users';
import { request } from '../src/http/request';

global.fetch = vi.fn();

describe('UsersAPI Integration - Response Unwrapping', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should unwrap API response for users.fetch()', async () => {
    const mockChannelProfile = {
      uid: 'user123',
      channelId: 'groov',
      id: 'groov',
      username: 'johndoe',
      displayName: 'John Doe',
      visibility: 'public' as const,
      verified: true,
      created: '2024-01-01T00:00:00Z',
      changed: '2024-01-01T00:00:00Z',
    };

    // Mock the actual API response format with status and data envelope
    const apiResponse = {
      status: 'ok',
      data: mockChannelProfile,
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => apiResponse,
      headers: {
        get: () => 'application/json',
      },
    });

    const req = request({ token: 'test-token', baseUrl: 'http://localhost:3999/api/v1' });
    const usersAPI = new UsersAPI(req, {});

    const result = await usersAPI.fetch('user123', { channelId: 'groov' });

    // Verify the response is unwrapped - should be ChannelProfile, not { data: ChannelProfile }
    expect(result).toEqual(mockChannelProfile);
    expect(result).not.toHaveProperty('status');
    expect(result).not.toHaveProperty('data');
    expect(result.uid).toBe('user123');
    expect(result.username).toBe('johndoe');
  });

  it('should unwrap API response for users.me()', async () => {
    const mockProfile = {
      uid: 'user123',
      email: 'user@example.com',
      first: 'John',
      last: 'Doe',
      displayName: 'John Doe',
    };

    // Mock the actual API response format
    const apiResponse = {
      status: 'ok',
      data: mockProfile,
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => apiResponse,
      headers: {
        get: () => 'application/json',
      },
    });

    const req = request({ token: 'test-token', baseUrl: 'http://localhost:3999/api/v1' });
    const usersAPI = new UsersAPI(req, {});

    const result = await usersAPI.me();

    // Verify the response is unwrapped
    expect(result).toEqual(mockProfile);
    expect(result).not.toHaveProperty('status');
    expect(result).not.toHaveProperty('data');
    expect(result.email).toBe('user@example.com');
  });

  it('should handle paginated responses correctly', async () => {
    const mockProfiles = [
      {
        uid: 'user123',
        channelId: 'groov',
        id: 'groov',
        username: 'johndoe',
        displayName: 'John Doe',
        visibility: 'public' as const,
        verified: true,
        created: '2024-01-01T00:00:00Z',
        changed: '2024-01-01T00:00:00Z',
      },
    ];

    // Mock paginated API response
    const apiResponse = {
      status: 'ok',
      data: mockProfiles,
      pagination: {
        total: 1,
        limit: 20,
        offset: 0,
        hasMore: false,
      },
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => apiResponse,
      headers: {
        get: () => 'application/json',
      },
    });

    const req = request({ token: 'test-token', baseUrl: 'http://localhost:3999/api/v1' });
    const usersAPI = new UsersAPI(req, {});

    const result = await usersAPI.list({ channelId: 'groov' });

    // Verify paginated response is transformed to { results, pagination }
    expect(result).toHaveProperty('results');
    expect(result).toHaveProperty('pagination');
    expect(result.results).toEqual(mockProfiles);
    expect(result.pagination).toEqual(apiResponse.pagination);
  });
});
