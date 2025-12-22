import { describe, it, expect, vi, beforeEach } from 'vitest';
import { request } from '../src/http/request';
import { setSdkOverrides } from '../src/settings';

global.fetch = vi.fn();

describe('request', () => {
  const token = 'test-token';

  beforeEach(() => {
    vi.resetAllMocks();
    setSdkOverrides({});
  });

  it('constructs a proper GET request', async () => {
    const mockResponse = { status: 'ok', data: { message: 'hello' } };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockResponse,
      headers: {
        get: () => 'application/json',
      },
    });

    const req = request({ token });
    const result = await req('/test', { query: { a: 1, b: 'x' } });

    expect(result).toEqual(mockResponse.data);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test?a=1&b=x'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('uses runtimeOverrides for baseUrl and headers', async () => {
    const mockResponse = { status: 'ok', data: { from: 'mock' } };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockResponse,
      headers: {
        get: () => 'application/json',
      },
    });

    setSdkOverrides({
      baseUrl: 'http://localhost:9999',
      headers: {
        Prefer: 'code=200, example=test-case',
      },
    });

    const req = request({ token: null });

    await req('/mocked-endpoint');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:9999/mocked-endpoint',
      expect.objectContaining({
        headers: expect.objectContaining({
          Prefer: 'code=200, example=test-case',
          'Content-Type': 'application/json',
        }),
      })
    );
  });
});
