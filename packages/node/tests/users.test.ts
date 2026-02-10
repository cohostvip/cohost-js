import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersAPI } from '../src/api/users';
import { CohostClientSettings } from '../src/settings';
import { RequestFn } from '../src/http/request';

describe('UsersAPI', () => {
  let mockRequest: RequestFn;
  let settings: CohostClientSettings;
  let usersAPI: UsersAPI;

  beforeEach(() => {
    mockRequest = vi.fn();
    settings = {};
    usersAPI = new UsersAPI(mockRequest, settings);
  });

  describe('me()', () => {
    it('should fetch the current user profile and unwrap the response', async () => {
      const mockProfile = {
        uid: 'user123',
        email: 'user@example.com',
        first: 'John',
        last: 'Doe',
        displayName: 'John Doe',
      };

      // Mock returns unwrapped data (request function handles unwrapping in real scenario)
      (mockRequest as any).mockResolvedValue(mockProfile);

      const result = await usersAPI.me();

      expect(mockRequest).toHaveBeenCalledWith('/me');
      // Result should be unwrapped Profile, not { data: Profile }
      expect(result).toEqual(mockProfile);
      expect(result.email).toBe('user@example.com');
    });
  });

  describe('fetch()', () => {
    it('should fetch a user channel profile by ID and unwrap the response', async () => {
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

      // Mock returns unwrapped data (request function handles unwrapping in real scenario)
      (mockRequest as any).mockResolvedValue(mockChannelProfile);

      const result = await usersAPI.fetch('user123', { channelId: 'groov' });

      expect(mockRequest).toHaveBeenCalledWith('/users/user123', {
        headers: {
          'x-cohost-channel-id': 'groov',
        },
      });
      // Result should be unwrapped ChannelProfile, not { data: ChannelProfile }
      expect(result).toEqual(mockChannelProfile);
      expect(result.uid).toBe('user123');
      expect(result.username).toBe('johndoe');
    });

    it('should throw error if channelId is not provided', async () => {
      await expect(
        usersAPI.fetch('user123', {} as any)
      ).rejects.toThrow('channelId is required');
    });

    it('should work with different channel IDs', async () => {
      const mockChannelProfile = {
        uid: 'user123',
        channelId: 'cohost',
        id: 'cohost',
        username: 'john_cohost',
        displayName: 'John (Cohost)',
        visibility: 'public' as const,
        verified: false,
        created: '2024-01-01T00:00:00Z',
        changed: '2024-01-01T00:00:00Z',
      };

      (mockRequest as any).mockResolvedValue(mockChannelProfile);

      const result = await usersAPI.fetch('user123', { channelId: 'cohost' });

      expect(mockRequest).toHaveBeenCalledWith('/users/user123', {
        headers: {
          'x-cohost-channel-id': 'cohost',
        },
      });
      expect(result).toEqual(mockChannelProfile);
    });
  });

  describe('list()', () => {
    it('should list public channel profiles', async () => {
      const mockResponse = {
        results: [
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
        ],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          hasMore: false,
        },
      };

      (mockRequest as any).mockResolvedValue(mockResponse);

      const result = await usersAPI.list({ channelId: 'groov' });

      expect(mockRequest).toHaveBeenCalledWith('/users', {
        headers: {
          'x-cohost-channel-id': 'groov',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should support pagination parameters', async () => {
      const mockResponse = {
        results: [],
        pagination: {
          total: 100,
          limit: 10,
          offset: 20,
          hasMore: true,
        },
      };

      (mockRequest as any).mockResolvedValue(mockResponse);

      await usersAPI.list({ channelId: 'groov', limit: 10, offset: 20 });

      expect(mockRequest).toHaveBeenCalledWith('/users?limit=10&offset=20', {
        headers: {
          'x-cohost-channel-id': 'groov',
        },
      });
    });

    it('should support verified filter', async () => {
      const mockResponse = {
        results: [],
        pagination: {
          total: 5,
          limit: 20,
          offset: 0,
          hasMore: false,
        },
      };

      (mockRequest as any).mockResolvedValue(mockResponse);

      await usersAPI.list({ channelId: 'groov', verified: true });

      expect(mockRequest).toHaveBeenCalledWith('/users?verified=true', {
        headers: {
          'x-cohost-channel-id': 'groov',
        },
      });
    });

    it('should throw error if channelId is not provided', async () => {
      await expect(usersAPI.list({} as any)).rejects.toThrow('channelId is required');
    });
  });
});
