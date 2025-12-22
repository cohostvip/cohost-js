import { CohostEndpoint } from '../endpoint';

/**
 * Coupon interface for the Cohost API
 */
export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses?: number;
  usedCount?: number;
  expiresAt?: string;
  companyId: string;
  eventId?: string;
  status?: 'active' | 'inactive' | 'expired';
  created?: string;
  updated?: string;
}

/**
 * Provides methods to interact with the Cohost Coupons API.
 *
 * Usage:
 * ```ts
 * const client = new CohostClient({ token: 'your-token' });
 * const coupons = await client.coupons.list();
 * const coupon = await client.coupons.create({ code: 'SUMMER2025', discountType: 'percentage', discountValue: 20 });
 * ```
 */
export class CouponsAPI extends CohostEndpoint {

  /**
   * List all coupons for the authenticated company.
   *
   * @param filters - Optional filters to apply when retrieving coupons
   * @returns A Promise resolving to an array of coupon objects
   * @throws Will throw an error if the request fails
   *
   * @example
   * ```ts
   * // List all coupons
   * const allCoupons = await client.coupons.list();
   *
   * // List coupons for specific event
   * const eventCoupons = await client.coupons.list({ eventId: 'evt_abc123' });
   * ```
   */
  async list(filters?: { eventId?: string }) {
    const query = filters?.eventId ? `?eventId=${filters.eventId}` : '';
    return this.request<Coupon[]>(`/coupons${query}`);
  }

  /**
   * Create a new coupon.
   *
   * @param coupon - The coupon data to create
   * @returns A Promise resolving to the created coupon object
   * @throws Will throw an error if the request fails or validation fails
   *
   * @example
   * ```ts
   * const coupon = await client.coupons.create({
   *   code: 'SUMMER2025',
   *   discountType: 'percentage',
   *   discountValue: 20,
   *   maxUses: 100,
   *   expiresAt: '2025-08-31T23:59:59Z'
   * });
   * ```
   */
  async create(coupon: Omit<Partial<Coupon>, 'id' | 'companyId' | 'created' | 'updated'>) {
    return this.request<Coupon>('/coupons', {
      method: 'POST',
      data: coupon
    });
  }

  /**
   * Update an existing coupon.
   *
   * @param id - The unique identifier of the coupon to update
   * @param coupon - Partial coupon data to update
   * @returns A Promise resolving to the updated coupon object
   * @throws Will throw an error if the request fails or coupon is not found
   *
   * @example
   * ```ts
   * const updated = await client.coupons.update('cpn_xyz789', {
   *   discountValue: 25,
   *   maxUses: 150
   * });
   * ```
   */
  async update(id: string, coupon: Omit<Partial<Coupon>, 'id' | 'companyId' | 'created' | 'updated'>) {
    return this.request<Coupon>(`/coupons/${id}`, {
      method: 'PATCH',
      data: coupon
    });
  }

  /**
   * Delete a coupon.
   *
   * @param id - The unique identifier of the coupon to delete
   * @returns A Promise resolving when the coupon is deleted
   * @throws Will throw an error if the request fails or coupon is not found
   *
   * @example
   * ```ts
   * await client.coupons.delete('cpn_xyz789');
   * ```
   */
  async delete(id: string) {
    return this.request<void>(`/coupons/${id}`, {
      method: 'DELETE'
    });
  }
}
