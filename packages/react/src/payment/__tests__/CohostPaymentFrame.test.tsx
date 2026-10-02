import { act, render } from '@testing-library/react';
import * as React from 'react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import * as CheckoutContext from '../../context/CohostCheckoutContext';
import { CohostPaymentFrame, type CohostPaymentFrameHandle } from '../CohostPaymentFrame';

const BASE_URL = 'https://test.cohost.vip';

const mockCheckoutContext = (overrides: Partial<CheckoutContext.CohostCheckoutContextType> = {}) =>
  vi.spyOn(CheckoutContext, 'useCohostCheckout').mockReturnValue({
    cartSessionId: 'cart-123',
    cartSession: { costs: { total: 'USD,1000' }, meta: { paymentIntent: { provider: 'authnet' } } } as any,
    status: 'ready',
    error: null,
    joinGroup: vi.fn(),
    updateItem: vi.fn(),
    incrementItem: vi.fn(),
    decrementItem: vi.fn(),
    updateCartSession: vi.fn(),
    placeOrder: vi.fn(),
    submitAuthnetIframeTransaction: vi.fn(),
    processPayment: vi.fn(),
    applyCoupon: vi.fn(),
    removeCoupon: vi.fn(),
    setCustomer: vi.fn(),
    setBillingAddress: vi.fn(),
    ...overrides,
  } as CheckoutContext.CohostCheckoutContextType);

describe('CohostPaymentFrame — double-submit guard', () => {
  it('ignores a second submit() call while the first is still in flight', () => {
    mockCheckoutContext();
    const ref = createRef<CohostPaymentFrameHandle>();
    const { container } = render(<CohostPaymentFrame ref={ref} baseUrl={BASE_URL} autoStyle={false} />);

    const iframe = container.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe).toBeTruthy();
    const postMessage = vi.fn();
    Object.defineProperty(iframe, 'contentWindow', { value: { postMessage }, configurable: true });

    act(() => {
      ref.current?.submit();
      ref.current?.submit();
      ref.current?.submit();
    });

    expect(postMessage).toHaveBeenCalledTimes(1);
  });

  it('allows a new submit() after an error response releases the guard', () => {
    mockCheckoutContext();
    const ref = createRef<CohostPaymentFrameHandle>();
    const onError = vi.fn();
    const { container } = render(
      <CohostPaymentFrame ref={ref} baseUrl={BASE_URL} autoStyle={false} onError={onError} />
    );

    const iframe = container.querySelector('iframe') as HTMLIFrameElement;
    const postMessage = vi.fn();
    Object.defineProperty(iframe, 'contentWindow', { value: { postMessage }, configurable: true });

    act(() => {
      ref.current?.submit();
    });
    expect(postMessage).toHaveBeenCalledTimes(1);

    // The hosted element reports the gateway rejected it — this must release the guard.
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'cohost-pay', event: 'error', message: 'This transaction has been declined.' },
          origin: BASE_URL,
        })
      );
    });
    expect(onError).toHaveBeenCalledTimes(1);

    act(() => {
      ref.current?.submit();
    });
    expect(postMessage).toHaveBeenCalledTimes(2);
  });

  it('allows a new submit() after a success response releases the guard', () => {
    mockCheckoutContext();
    const ref = createRef<CohostPaymentFrameHandle>();
    const onSuccess = vi.fn();
    const { container } = render(
      <CohostPaymentFrame ref={ref} baseUrl={BASE_URL} autoStyle={false} onSuccess={onSuccess} />
    );

    const iframe = container.querySelector('iframe') as HTMLIFrameElement;
    const postMessage = vi.fn();
    Object.defineProperty(iframe, 'contentWindow', { value: { postMessage }, configurable: true });

    act(() => {
      ref.current?.submit();
    });
    expect(postMessage).toHaveBeenCalledTimes(1);

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'cohost-pay', event: 'success', provider: 'authnet', reference: 'txn_1' },
          origin: BASE_URL,
        })
      );
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);

    act(() => {
      ref.current?.submit();
    });
    expect(postMessage).toHaveBeenCalledTimes(2);
  });
});
