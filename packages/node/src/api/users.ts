// src/api/users.ts

import { CohostEndpoint } from '../endpoint';
import { ChannelProfile, Profile } from '@cohostvip/cohost-types';

/**
 * Provides methods to interact with the Cohost Users API.
 *
 * Usage:
 * ```ts
 * const client = new CohostClient({ token: 'your-token' });
 *
 * // Get current user's profile
 * const myProfile = await client.users.me();
 *
 * // Get a specific user's channel profile
 * const userProfile = await client.users.fetch('user123', { channelId: 'groov' });
 * ```
 */
export class UsersAPI extends CohostEndpoint {
  /**
   * Get the authenticated user's profile.
   *
   * Requires: Valid authentication token.
   *
   * @returns A Promise resolving to the current user's profile
   * @throws Will throw an error if not authenticated or the request fails
   *
   * @example
   * ```ts
   * const client = new CohostClient({ token: 'your-token' });
   * const profile = await client.users.me();
   * console.log(profile.email); // user@example.com
   * ```
   */
  async me(): Promise<Profile> {
    return this.request<Profile>('/me');
  }

  /**
   * Get a user's channel profile by ID.
   *
   * Requires: `channelId` in options to specify which channel profile to fetch.
   *
   * Authorization:
   * - Public profiles: Anyone can view
   * - Private profiles: Only the owner can view
   * - Unlisted profiles: Only the owner can view
   *
   * @param id - The unique identifier of the user
   * @param options - Request options including required channelId
   * @param options.channelId - The channel ID (e.g., "groov", "cohost")
   * @returns A Promise resolving to the user's channel profile
   * @throws Will throw an error if the profile is not found or unauthorized
   *
   * @example
   * ```ts
   * const client = new CohostClient({ token: 'your-token' });
   *
   * // Get a user's Groov profile
   * const profile = await client.users.fetch('user123', { channelId: 'groov' });
   * console.log(profile.username); // johndoe
   *
   * // Get a user's Cohost profile
   * const cohostProfile = await client.users.fetch('user123', { channelId: 'cohost' });
   * ```
   */
  async fetch(
    id: string,
    options: {
      channelId: string;
    }
  ): Promise<ChannelProfile> {
    if (!options.channelId) {
      throw new Error('channelId is required to fetch a user profile');
    }

    return this.request<ChannelProfile>(`/users/${id}`, {
      headers: {
        'x-cohost-channel-id': options.channelId,
      },
    });
  }

  /**
   * List public channel profiles for a specific channel.
   *
   * Returns only public profiles. Private and unlisted profiles are excluded.
   *
   * @param options - Request options
   * @param options.channelId - The channel ID to filter profiles
   * @param options.limit - Maximum number of results (default: 20, max: 100)
   * @param options.offset - Offset for pagination (default: 0)
   * @param options.verified - Filter by verified status (optional)
   * @returns A Promise resolving to an array of public channel profiles with pagination
   * @throws Will throw an error if the request fails
   *
   * @example
   * ```ts
   * const client = new CohostClient({ token: 'your-token' });
   *
   * // List all public Groov profiles
   * const result = await client.users.list({ channelId: 'groov', limit: 10 });
   * console.log(result.results); // Array of profiles
   * console.log(result.pagination); // { total, limit, offset, hasMore }
   *
   * // List only verified profiles
   * const verified = await client.users.list({
   *   channelId: 'groov',
   *   verified: true
   * });
   * ```
   */
  async list(options: {
    channelId: string;
    limit?: number;
    offset?: number;
    verified?: boolean;
  }): Promise<{
    results: ChannelProfile[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  }> {
    if (!options.channelId) {
      throw new Error('channelId is required to list user profiles');
    }

    const queryParams = new URLSearchParams();
    if (options.limit !== undefined) queryParams.append('limit', options.limit.toString());
    if (options.offset !== undefined) queryParams.append('offset', options.offset.toString());
    if (options.verified !== undefined) queryParams.append('verified', options.verified.toString());

    const queryString = queryParams.toString();
    const path = `/users${queryString ? `?${queryString}` : ''}`;

    return this.request<{
      results: ChannelProfile[];
      pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
      };
    }>(path, {
      headers: {
        'x-cohost-channel-id': options.channelId,
      },
    });
  }
}
