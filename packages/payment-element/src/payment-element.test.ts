import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildSrc,
  resolvePaymentOrigin,
  DEFAULT_PAYMENT_ORIGIN,
  isPayUpMessage,
  isPayDownMessage,
  dispatchPayUpMessage,
  mountPaymentElement,
  PAY_MESSAGE_TYPE,
} from './index';

const ORIGIN = 'https://pay.example.com';

describe('buildSrc', () => {
  it('points at /pay/elements with the cart id', () => {
    const u = new URL(buildSrc(ORIGIN, 'cart_123'));
    expect(u.origin).toBe(ORIGIN);
    expect(u.pathname).toBe('/pay/elements');
    expect(u.searchParams.get('cart')).toBe('cart_123');
  });

  it('forwards theme keys and drops empty values', () => {
    const u = new URL(buildSrc(ORIGIN, 'cart_1', { accent: '#f97316', radius: 8, bg: '', text: undefined }));
    expect(u.searchParams.get('accent')).toBe('#f97316');
    expect(u.searchParams.get('radius')).toBe('8');
    expect(u.searchParams.has('bg')).toBe(false);
    expect(u.searchParams.has('text')).toBe(false);
  });
});

describe('resolvePaymentOrigin', () => {
  it('defaults to the prod origin', () => {
    expect(resolvePaymentOrigin()).toBe(DEFAULT_PAYMENT_ORIGIN);
  });
  it('honors an override and strips a trailing slash', () => {
    expect(resolvePaymentOrigin('https://dev.cohost.vip/')).toBe('https://dev.cohost.vip');
  });
});

describe('protocol guards', () => {
  it('isPayUpMessage matches event messages only', () => {
    expect(isPayUpMessage({ type: PAY_MESSAGE_TYPE, event: 'ready', provider: 'stripe' })).toBe(true);
    expect(isPayUpMessage({ type: PAY_MESSAGE_TYPE, command: 'submit' })).toBe(false);
    expect(isPayUpMessage({ type: 'other', event: 'ready' })).toBe(false);
    expect(isPayUpMessage(null)).toBe(false);
  });
  it('isPayDownMessage matches command messages only', () => {
    expect(isPayDownMessage({ type: PAY_MESSAGE_TYPE, command: 'submit' })).toBe(true);
    expect(isPayDownMessage({ type: PAY_MESSAGE_TYPE, event: 'ready' })).toBe(false);
  });
});

describe('dispatchPayUpMessage', () => {
  it('routes a change message to onChange with the field state', () => {
    const onChange = vi.fn();
    dispatchPayUpMessage(
      { type: PAY_MESSAGE_TYPE, event: 'change', provider: 'stripe', complete: true, valid: true, empty: false, brand: 'visa' },
      { onChange }
    );
    expect(onChange).toHaveBeenCalledWith({ complete: true, valid: true, empty: false, brand: 'visa' });
  });

  it('only fires onResize for a positive height', () => {
    const onResize = vi.fn();
    dispatchPayUpMessage({ type: PAY_MESSAGE_TYPE, event: 'resize', height: 0 }, { onResize });
    dispatchPayUpMessage({ type: PAY_MESSAGE_TYPE, event: 'resize', height: 240 }, { onResize });
    expect(onResize).toHaveBeenCalledTimes(1);
    expect(onResize).toHaveBeenCalledWith(240);
  });

  it('ignores non-up-messages', () => {
    const onReady = vi.fn();
    dispatchPayUpMessage({ type: PAY_MESSAGE_TYPE, command: 'submit' }, { onReady });
    expect(onReady).not.toHaveBeenCalled();
  });
});

describe('mountPaymentElement', () => {
  let host: HTMLElement;

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
  });
  afterEach(() => {
    host.remove();
  });

  it('throws without a cart id', () => {
    expect(() => mountPaymentElement(host, { cartId: '' })).toThrow(/cartId/);
  });

  it('throws when a selector matches nothing', () => {
    expect(() => mountPaymentElement('#nope', { cartId: 'cart_1' })).toThrow(/selector/);
  });

  it('renders an iframe to the element page with the right src + sandbox', () => {
    const handle = mountPaymentElement(host, { cartId: 'cart_123', baseUrl: ORIGIN, autoStyle: false });
    const iframe = host.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(handle.iframe).toBe(iframe);
    expect(iframe!.src).toContain(`${ORIGIN}/pay/elements?cart=cart_123`);
    expect(iframe!.getAttribute('sandbox')).toBe('allow-scripts allow-forms allow-same-origin allow-popups');
    handle.destroy();
  });

  it('forwards verified-origin events to callbacks and auto-resizes', () => {
    const onReady = vi.fn();
    const handle = mountPaymentElement(host, { cartId: 'cart_1', baseUrl: ORIGIN, autoStyle: false, onReady });

    window.dispatchEvent(new MessageEvent('message', { origin: ORIGIN, data: { type: PAY_MESSAGE_TYPE, event: 'ready', provider: 'stripe' } }));
    expect(onReady).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new MessageEvent('message', { origin: ORIGIN, data: { type: PAY_MESSAGE_TYPE, event: 'resize', height: 310 } }));
    expect(handle.iframe!.style.height).toBe('310px');

    handle.destroy();
  });

  it('ignores messages from a foreign origin', () => {
    const onReady = vi.fn();
    const handle = mountPaymentElement(host, { cartId: 'cart_1', baseUrl: ORIGIN, autoStyle: false, onReady });
    window.dispatchEvent(new MessageEvent('message', { origin: 'https://evil.example', data: { type: PAY_MESSAGE_TYPE, event: 'ready', provider: 'stripe' } }));
    expect(onReady).not.toHaveBeenCalled();
    handle.destroy();
  });

  it('destroy() removes the iframe and detaches the listener', () => {
    const onReady = vi.fn();
    const handle = mountPaymentElement(host, { cartId: 'cart_1', baseUrl: ORIGIN, autoStyle: false, onReady });
    handle.destroy();
    expect(host.querySelector('iframe')).toBeNull();
    expect(handle.iframe).toBeNull();
    window.dispatchEvent(new MessageEvent('message', { origin: ORIGIN, data: { type: PAY_MESSAGE_TYPE, event: 'ready', provider: 'stripe' } }));
    expect(onReady).not.toHaveBeenCalled();
  });

  it('free cart renders no iframe and reports onFree', async () => {
    const onFree = vi.fn();
    const handle = mountPaymentElement(host, { cartId: 'cart_1', baseUrl: ORIGIN, free: true, onFree });
    expect(host.querySelector('iframe')).toBeNull();
    expect(handle.iframe).toBeNull();
    await Promise.resolve();
    expect(onFree).toHaveBeenCalledTimes(1);
  });
});
