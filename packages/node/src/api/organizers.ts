import { CohostEndpoint } from '../endpoint';
import { MultipartText, Photo } from '@cohostvip/cohost-types';

/**
 * A social/website link on an organizer profile.
 */
export interface OrganizerLink {
  /** Social media platform/category (e.g. facebook, instagram) or a custom string. */
  category: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'website' | string;
  /** URL to the social media profile or page. */
  url: string;
  /** Priority for ordering links (lower sorts first). */
  priority: number;
  /** Whether this is the primary link. */
  isPrimary: boolean;
}

/**
 * An event organizer / organization profile that belongs to a company.
 */
export interface Organizer {
  /** Unique identifier for the organizer. */
  id: string;
  /** URL-friendly slug for the organizer profile. */
  slug?: string;
  /** ID of the company this organizer belongs to. */
  companyId: string;
  /** Short biography or description of the organizer. */
  bio?: string;
  /** Detailed description in multiple formats. */
  description?: MultipartText;
  /** Brief summary in multiple formats. */
  summary?: MultipartText;
  /** Number of followers. */
  followers: number;
  /** Headline or tagline for the organizer. */
  headline?: string;
  /** Logo photo with multiple resolutions. */
  logo?: Photo;
  /** Display name of the organizer. */
  name: string;
  /** Social media and website links. */
  links: OrganizerLink[];
  /** Custom appearance configuration for branding. */
  appearance?: Record<string, any> | null;
  /** Additional configuration data. */
  config?: any;
  /** Organizer-specific settings. */
  settings?: {
    /** Asset ID used for order confirmation emails/pages. */
    confirmationAssetId?: string;
  };
}

/**
 * Fields accepted when creating or updating an organizer.
 *
 * `id` is taken from the path on update, and `companyId` is always forced from
 * the authenticated token's context, so neither is accepted in the body.
 */
export type OrganizerInput = Omit<Partial<Organizer>, 'id' | 'companyId'> & { name: string };

/**
 * Provides methods to interact with the Cohost Organizers API.
 *
 * Usage:
 * ```ts
 * const client = new CohostClient({ token: 'your-token' });
 * const organizers = await client.organizers.list();
 * const organizer = await client.organizers.create({ name: 'Acme Events' });
 * ```
 */
export class OrganizersAPI extends CohostEndpoint {

  /**
   * List all organizers for the authenticated company.
   *
   * @returns A Promise resolving to an array of organizer objects (empty if the token has no company).
   * @throws Will throw an error if the request fails.
   *
   * @example
   * ```ts
   * const organizers = await client.organizers.list();
   * ```
   */
  async list(): Promise<Organizer[]> {
    const { organizers } = await this.request<{ organizers: Organizer[] }>('/organizers');
    return organizers;
  }

  /**
   * Fetch a single organizer by ID.
   *
   * @param id - The unique identifier of the organizer.
   * @returns A Promise resolving to the organizer object.
   * @throws Will throw an error if the request fails.
   *
   * @example
   * ```ts
   * const organizer = await client.organizers.fetch('org_abc123');
   * ```
   */
  async fetch(id: string): Promise<Organizer> {
    const { organizer } = await this.request<{ organizer: Organizer }>(`/organizers/${id}`);
    return organizer;
  }

  /**
   * Create a new organizer for the authenticated company.
   *
   * @param organizer - The organizer data to create (`companyId` is forced from the token).
   * @returns A Promise resolving to the created organizer object.
   * @throws Will throw an error if the request fails or validation fails.
   *
   * @example
   * ```ts
   * const organizer = await client.organizers.create({
   *   name: 'Acme Events',
   *   headline: 'Your favourite event producers',
   * });
   * ```
   */
  async create(organizer: OrganizerInput): Promise<Organizer> {
    const { organizer: created } = await this.request<{ organizer: Organizer }>('/organizers', {
      method: 'POST',
      data: { organizer },
    });
    return created;
  }

  /**
   * Update an existing organizer.
   *
   * @param id - The unique identifier of the organizer to update.
   * @param organizer - Partial organizer data to update.
   * @returns A Promise resolving to the updated organizer object.
   * @throws Will throw an error if the request fails or the organizer is not found.
   *
   * @example
   * ```ts
   * const updated = await client.organizers.update('org_abc123', {
   *   name: 'Acme Events',
   *   bio: 'We produce world-class live events.',
   * });
   * ```
   */
  async update(id: string, organizer: OrganizerInput): Promise<Organizer> {
    const { organizer: updated } = await this.request<{ organizer: Organizer }>(`/organizers/${id}`, {
      method: 'PATCH',
      data: { organizer },
    });
    return updated;
  }

  /**
   * Delete an organizer by ID.
   *
   * @param id - The unique identifier of the organizer to delete.
   * @returns A Promise resolving when the organizer is deleted.
   * @throws Will throw an error if the request fails.
   *
   * @example
   * ```ts
   * await client.organizers.delete('org_abc123');
   * ```
   */
  async delete(id: string): Promise<void> {
    await this.request<null>(`/organizers/${id}`, {
      method: 'DELETE',
    });
  }
}
