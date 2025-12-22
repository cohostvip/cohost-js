import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrdersAPI } from '../src/api/orders';
import { RequestFn } from '../src/http/request';

describe('OrdersAPI', () => {
  const mockRequest: RequestFn = vi.fn();
  const settings = { debug: false };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls /orders/:id for fetch()', async () => {
    const mockOrder = { id: 'order-1', total: 50 };
    (mockRequest as any).mockResolvedValue(mockOrder);

    const api = new OrdersAPI(mockRequest, settings);
    const result = await api.fetch('order-1', 'user-xyz');

    expect(mockRequest).toHaveBeenCalledWith('/orders/order-1');
    expect(result).toEqual(mockOrder);
  });
});
