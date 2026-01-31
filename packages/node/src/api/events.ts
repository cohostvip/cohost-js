// src/api/EventsAPI.ts

import { CohostEndpoint } from '../endpoint';
import { Attendee, EventProfile, PaginatedRequest, PaginatedResponse, Ticket } from '@cohostvip/cohost-types';
import { paginatedOptions } from '../http/request';

/**
 * Provides methods to interact with the Cohost Events API.
 * 
 * Usage:
 * ```ts
 * const client = new CohostClient({ token: 'your-token' });
 * const list = await client.events.list();
 * const event = await client.events.fetch('event-id');
 * const tickets = await client.events.tickets('event-id');
 * ```
 */
export class EventsAPI extends CohostEndpoint {

  /**
   * Fetch a paginated list of events.
   *
   * @param filters - Optional pagination and filter parameters
   * @returns A Promise resolving to a paginated response with event profiles
   * @throws Will throw an error if the request fails
   */
  async list(filters?: PaginatedRequest<any>) {
    return this.request<PaginatedResponse<EventProfile>>('/events', paginatedOptions(filters));
  }


  /**
   * Fetch a single event by ID.
   * 
   * @param id - The unique identifier of the event
   * @returns A Promise resolving to the event object
   * @throws Will throw an error if the request fails or the event is not found
   */
  async fetch(id: string) {
    return this.request<EventProfile>(`/events/${id}`);
  }



  /**
   * List all tickets associated with a specific event.
   * 
   * @param id - The unique identifier of the event
   * @returns A Promise resolving to an array of ticket objects
   * @throws Will throw an error if the request fails or the event does not exist
   */
  async tickets(id: string) {
    return this.request<Ticket[]>(`/events/${id}/tickets`);
  }

  /**
   * List attendees in the event.
   *
   * Requires: valid authentication token. This endpoint is not public.
   * 
   * @param id - The ID of the event.
   * @returns List of tickets (attendees) for the event.
   */
  async attendees(id: string, filters?: PaginatedRequest<any>) {
    return this.request<PaginatedResponse<Attendee>>(`/events/${id}/attendees`, paginatedOptions(filters));
  }



  async search(filters?: PaginatedRequest<any>) {
    return this.request<PaginatedResponse<EventProfile>>('/events/search', paginatedOptions(filters));
  }

  /**
   * Create a new event.
   *
   * @param event - The event data to create (without id)
   * @param context - Optional context information for event creation
   * @returns A Promise resolving to an object with the created event ID
   * @throws Will throw an error if the request fails or authentication is missing
   *
   * @example
   * ```ts
   * const result = await client.events.create({
   *   name: 'Summer Concert',
   *   startDate: '2025-07-15T19:00:00Z',
   *   venue: { name: 'City Arena' }
   * });
   * console.log(result.id); // 'evt_abc123'
   * ```
   */
  async create(event: Omit<Partial<EventProfile>, 'id'>, context?: any) {
    return this.request<{ id: string }>('/events', {
      method: 'POST',
      data: { event, context }
    });
  }

  /**
   * Update an existing event.
   *
   * @param id - The unique identifier of the event to update
   * @param event - Partial event data to update
   * @param context - Optional context information for event update
   * @returns A Promise resolving to an object with the updated event ID
   * @throws Will throw an error if the request fails or event is not found
   *
   * @example
   * ```ts
   * const result = await client.events.update('evt_abc123', {
   *   name: 'Summer Concert - Updated',
   *   capacity: 5000
   * });
   * ```
   */
  async update(id: string, event: Partial<EventProfile>, context?: any) {
    return this.request<{ id: string }>(`/events/${id}`, {
      method: 'PATCH',
      data: { event, context }
    });
  }

  /**
   * Create one or more tickets for an event.
   *
   * @param eventId - The unique identifier of the event
   * @param tickets - Single ticket or array of tickets to create
   * @param context - Optional context information for ticket creation
   * @returns A Promise resolving to an object mapping reference IDs to created ticket IDs
   * @throws Will throw an error if the request fails or validation fails
   *
   * @example
   * ```ts
   * // Create single ticket
   * const result = await client.events.createTickets('evt_abc123', {
   *   name: 'General Admission',
   *   price: 50,
   *   currency: 'USD',
   *   quantity: 100
   * });
   *
   * // Create multiple tickets
   * const result = await client.events.createTickets('evt_abc123', [
   *   { name: 'VIP', price: 150, quantity: 20 },
   *   { name: 'Early Bird', price: 40, quantity: 50 }
   * ]);
   * ```
   */
  async createTickets(eventId: string, tickets: Partial<Ticket> | Partial<Ticket>[], context?: any) {
    const data = Array.isArray(tickets)
      ? { tickets, context }
      : { ticket: tickets, context };

    return this.request<{ ids: Record<string, string> }>(`/events/${eventId}/tickets`, {
      method: 'POST',
      data
    });
  }

  /**
   * Update an existing ticket.
   *
   * @param eventId - The unique identifier of the event
   * @param ticketId - The unique identifier of the ticket to update
   * @param ticket - Partial ticket data to update
   * @param context - Optional context information for ticket update
   * @returns A Promise resolving to the updated ticket
   * @throws Will throw an error if the request fails or ticket is not found
   *
   * @example
   * ```ts
   * const result = await client.events.updateTicket('evt_abc123', 'tkt_xyz789', {
   *   price: 55,
   *   quantity: 120
   * });
   * ```
   */
  async updateTicket(eventId: string, ticketId: string, ticket: Partial<Ticket>, context?: any) {
    return this.request<Ticket>(`/events/${eventId}/tickets/${ticketId}`, {
      method: 'PATCH',
      data: { ticket, context }
    });
  }

  /**
   * Delete a ticket from an event.
   *
   * @param eventId - The unique identifier of the event
   * @param ticketId - The unique identifier of the ticket to delete
   * @returns A Promise resolving when the ticket is deleted (no content)
   * @throws Will throw an error if the request fails or ticket is not found
   *
   * @example
   * ```ts
   * await client.events.deleteTicket('evt_abc123', 'tkt_xyz789');
   * ```
   */
  async deleteTicket(eventId: string, ticketId: string) {
    return this.request<void>(`/events/${eventId}/tickets/${ticketId}`, {
      method: 'DELETE'
    });
  }

}
