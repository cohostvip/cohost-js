import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventsAPI } from '../src/api/events';
import { RequestFn } from '../src/http/request';

describe('EventsAPI', () => {
  const mockRequest: RequestFn = vi.fn();
  const settings = { debug: false };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls /events/:id for fetch()', async () => {
    const mockEvent = { id: 'event-1', name: 'Test Event' };
    (mockRequest as any).mockResolvedValue(mockEvent);

    const api = new EventsAPI(mockRequest, settings);
    const result = await api.fetch('event-1');

    expect(mockRequest).toHaveBeenCalledWith('/events/event-1');
    expect(result).toEqual(mockEvent);
  });

  it('calls /events/:id/tickets for tickets()', async () => {
    const mockTickets = [{ id: 't1' }, { id: 't2' }];
    (mockRequest as any).mockResolvedValue(mockTickets);

    const api = new EventsAPI(mockRequest, settings);
    const result = await api.tickets('event-2');

    expect(mockRequest).toHaveBeenCalledWith('/events/event-2/tickets');
    expect(result).toEqual(mockTickets);
  });
});
