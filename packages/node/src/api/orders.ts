import { CohostEndpoint } from '../endpoint';
import { Attendee, Order, PaginatedRequest, PaginatedResponse } from '../../types/index';
import { paginatedOptions } from '../http/request';

/**
 * Order list filters
 */
export interface OrderListFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
}

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
  async fetch(id: string, uid?: string) {
    const query = uid ? `?uid=${uid}` : '';
    return this.request<Order>(`/orders/${id}${query}`);
  }

  /**
   * List attendees for an order.
   *
   * @param id - The unique identifier of the order
   * @param uid - The unique user ID associated with the order (currently unused but reserved for future auth context)
   * @returns A Promise resolving to the list of attendees
   * @throws Will throw an error if the request fails or the order is not found
   */
  async attendees(id: string, uid?: string) {
    const query = uid ? `?uid=${uid}` : '';
    return this.request<Attendee[]>(`/orders/${id}/attendees${query}`);
  }

  /**
   * List orders with optional filters.
   *
   * @param filters - Optional pagination and filter parameters
   * @returns A Promise resolving to a paginated response with order summaries
   * @throws Will throw an error if the request fails
   */
  async list(filters?: PaginatedRequest<OrderListFilters>) {
    return this.request<PaginatedResponse<Partial<Order>>>('/orders', paginatedOptions(filters));
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
