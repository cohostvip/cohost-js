import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CohostClient } from '../src/client';

global.fetch = vi.fn();

describe('CohostClient', () => {
  const token = 'test-token';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes submodules correctly', () => {
    const client = new CohostClient({ token });
    expect(client.events).toBeDefined();
    expect(client.orders).toBeDefined();
  });

  it('client.events.fetch delegates to correct endpoint', async () => {
    const mockEvent = { status: 'ok', data: { id: 'event-123' } };
    (fetch as any).mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => mockEvent,
    });

    const client = new CohostClient({ token });
    const result = await client.events.fetch('event-123');
    expect(result).toEqual(mockEvent.data);
  });

  it('requestWithOverrides returns a client that injects headers', async () => {
    const mockResponse = { status: 'ok', data: { message: 'with Prefer header' } };

    (fetch as any).mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => mockResponse,
    });

    const client = new CohostClient({ token });

    const overriddenClient = client.requestWithOverrides({
      headers: {
        Prefer: 'code=200, example=mocked',
      },
    });

    const result = await overriddenClient.events.fetch('mocked-id');

    expect(result).toEqual(mockResponse.data);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/events/mocked-id'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Prefer: 'code=200, example=mocked',
          'Content-Type': 'application/json',
        }),
      })
    );
  });
});
