import { CohostEndpoint } from '../endpoint';

/**
 * Provides methods to interact with the Cohost Orders API.
 * 
 * Usage:
 * ```ts
 * const client = new CohostClient({ token: 'your-token' });
 * const order = await client.orders.fetch('order-id', 'user-id');
 * const list = await client.orders.list({ status: 'completed' });
 * ```
 */
export class OrdersAPI extends CohostEndpoint {

  /**
   * Fetch a single order by ID.
   * 
   * @param id - The unique identifier of the order
   * @param uid - The unique user ID associated with the order (currently unused but reserved for future auth context)
   * @returns A Promise resolving to the order object
   * @throws Will throw an error if the request fails or the order is not found
   */
  async fetch(id: string, uid: string) {
    // uid is reserved for future scoped access/auth features
    return this.request(`/orders/${id}?uid=${uid}`);
  }

  /**
   * Fetch a single order by ID.
   * 
   * @param id - The unique identifier of the order
   * @param uid - The unique user ID associated with the order (currently unused but reserved for future auth context)
   * @returns A Promise resolving to the order object
   * @throws Will throw an error if the request fails or the order is not found
   */
  async attendees(id: string, uid: string) {
    // uid is reserved for future scoped access/auth features
    return this.request(`/orders/${id}/attendees?uid=${uid}`);
  }

  /**
   * List orders with optional filters.
   * 
   * @param filters - Optional filters to apply when retrieving orders
   * @returns A Promise resolving to an array of order summaries
   * @throws Will throw an error if the request fails
   */
  async list(filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }) {
    const query = new URLSearchParams(filters as Record<string, string>).toString();
    return this.request(`/orders${query ? `?${query}` : ''}`);
  }

  /**
   * Send order confirmation email to customer.
   *
   * @param id - The unique identifier of the order
   * @returns A Promise resolving to the confirmation response
   * @throws Will throw an error if the request fails or order is not found
   *
   * @example
   * ```ts
   * const result = await client.orders.sendConfirmation('ord_abc123');
   * console.log(result.response); // Confirmation sent status
   * ```
   */
  async sendConfirmation(id: string) {
    return this.request<{ response: any }>(`/orders/${id}/send-confirmation`, {
      method: 'POST'
    });
  }
}
