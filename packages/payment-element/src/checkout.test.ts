import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mountCheckout, CHECKOUT_MESSAGE_TYPE, isCheckoutUpMessage } from './index';

describe('isCheckoutUpMessage', () => {
  it('matches checkout event messages only', () => {
    expect(isCheckoutUpMessage({ type: CHECKOUT_MESSAGE_TYPE, event: 'ready' })).toBe(true);
    expect(isCheckoutUpMessage({ type: CHECKOUT_MESSAGE_TYPE, command: 'refresh' })).toBe(false);
    expect(isCheckoutUpMessage({ type: 'cohost-pay', event: 'ready' })).toBe(false);
    expect(isCheckoutUpMessage(null)).toBe(false);
  });
});

describe('mountCheckout', () => {
  let host: HTMLElement;

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
  });
  afterEach(() => {
    host.remove();
  });

  it('throws without any cart/event/url', () => {
    expect(() => mountCheckout(host, {})).toThrow(/url.*cartId.*eventId|provide one of/);
  });

  it('embeds an explicit url verbatim and derives its origin', () => {
    const url = 'https://cohost.vip/checkout/cart_abc';
    const onReady = vi.fn();
    const handle = mountCheckout(host, { url, onReady });
    const iframe = host.querySelector('iframe')!;
    expect(iframe.src).toBe(url);

    // message from the url's origin is accepted
    window.dispatchEvent(new MessageEvent('message', { origin: 'https://cohost.vip', data: { type: CHECKOUT_MESSAGE_TYPE, event: 'ready' } }));
    expect(onReady).toHaveBeenCalledTimes(1);
    handle.destroy();
  });

  it('builds /checkout/{cartId} (path param) from a cartId + baseUrl', () => {
    const handle = mountCheckout(host, { cartId: 'cart_1', baseUrl: 'https://dev.cohost.vip' });
    const u = new URL(host.querySelector('iframe')!.src);
    expect(u.origin).toBe('https://dev.cohost.vip');
    expect(u.pathname).toBe('/checkout/cart_1');
    handle.destroy();
  });

  it('builds /checkout?event= from an eventId', () => {
    const handle = mountCheckout(host, { eventId: 'evt_9', baseUrl: 'https://cohost.vip' });
    const u = new URL(host.querySelector('iframe')!.src);
    expect(u.searchParams.get('event')).toBe('evt_9');
    handle.destroy();
  });

  it('auto-resizes and reports order-complete', () => {
    const onComplete = vi.fn();
    const handle = mountCheckout(host, { url: 'https://cohost.vip/checkout/cart_1', onComplete });

    window.dispatchEvent(new MessageEvent('message', { origin: 'https://cohost.vip', data: { type: CHECKOUT_MESSAGE_TYPE, event: 'resize', height: 540 } }));
    expect(handle.iframe!.style.height).toBe('540px');

    window.dispatchEvent(new MessageEvent('message', { origin: 'https://cohost.vip', data: { type: CHECKOUT_MESSAGE_TYPE, event: 'order-complete', orderId: 'ord_1', reference: 'CONF-1' } }));
    expect(onComplete).toHaveBeenCalledWith({ orderId: 'ord_1', reference: 'CONF-1', raw: undefined });

    handle.destroy();
  });

  it('lets onResize override the default auto-height', () => {
    const onResize = vi.fn();
    const handle = mountCheckout(host, { url: 'https://cohost.vip/checkout/cart_1', onResize });
    window.dispatchEvent(new MessageEvent('message', { origin: 'https://cohost.vip', data: { type: CHECKOUT_MESSAGE_TYPE, event: 'resize', height: 600 } }));
    expect(onResize).toHaveBeenCalledWith(600);
    expect(handle.iframe!.style.height).toBe('320px'); // unchanged default; consumer owns sizing
    handle.destroy();
  });

  it('ignores messages from a foreign origin', () => {
    const onReady = vi.fn();
    const handle = mountCheckout(host, { url: 'https://cohost.vip/checkout/cart_1', onReady });
    window.dispatchEvent(new MessageEvent('message', { origin: 'https://evil.example', data: { type: CHECKOUT_MESSAGE_TYPE, event: 'ready' } }));
    expect(onReady).not.toHaveBeenCalled();
    handle.destroy();
  });

  it('destroy() removes the iframe and detaches the listener', () => {
    const onReady = vi.fn();
    const handle = mountCheckout(host, { url: 'https://cohost.vip/checkout/cart_1', onReady });
    handle.destroy();
    expect(host.querySelector('iframe')).toBeNull();
    expect(handle.iframe).toBeNull();
    window.dispatchEvent(new MessageEvent('message', { origin: 'https://cohost.vip', data: { type: CHECKOUT_MESSAGE_TYPE, event: 'ready' } }));
    expect(onReady).not.toHaveBeenCalled();
  });
});
