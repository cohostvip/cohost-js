/**
 * `mountCheckout(target, options)` — embed the FULL cohost-hosted checkout (the whole cart:
 * tickets + coupon + customer + payment) as an iframe, auto-resizing to its content and reporting
 * `order-complete` up so the partner can confirm / redirect.
 *
 * This is the simplest possible partner integration: the entire cart lives on cohost's origin, so
 * NO API token, cart API, or payment wiring touches the partner page — they just drop the frame.
 * It's the right fit for WordPress / Webflow / static sites where the cart need not feel native.
 * For a card field embedded inside the partner's OWN cart UI, use {@link ./mount.mountPaymentElement}.
 *
 *   const checkout = mountCheckout('#checkout', {
 *     url: event.checkoutUrl,                 // or { cartId } / { eventId, baseUrl }
 *     onComplete: ({ reference }) => location.href = '/thanks?ref=' + reference,
 *   });
 *   // later: checkout.destroy();
 */
import {
  CHECKOUT_MESSAGE_TYPE,
  isCheckoutUpMessage,
  type CheckoutDownMessage,
  type CheckoutOrderResult,
} from './checkout-protocol';
import { resolvePaymentOrigin } from './theme';
import { createCohostFrame } from './frame';

export interface CheckoutOptions {
  /**
   * Embed this exact URL (e.g. an event's `checkoutUrl`). When set, `cartId` / `eventId` / `path`
   * are ignored and the message origin is derived from the URL. This is the most common path —
   * the backend already hands partners a `checkoutUrl`.
   */
  url?: string;
  /** Resume an existing cohost cart-session by id → `${origin}/checkout/${cartId}` (the real route). */
  cartId?: string;
  /**
   * Start checkout for this event → `${origin}/checkout?event=${eventId}`. Provisional: the
   * confirmed hosted route is cart-based (`/checkout/{cartId}`); prefer `url` or `cartId`.
   */
  eventId?: string;
  /**
   * Origin of the hosted checkout. Cascades like the payment origin: this → env
   * (`COHOST_PAYMENT_URL` / `NEXT_PUBLIC_COHOST_PAYMENT_URL`) → `https://cohost.vip`.
   * Ignored when `url` is given.
   */
  baseUrl?: string;
  /** Base route on the hosted origin. Defaults to `/checkout`. Ignored when `url` is given. */
  path?: string;
  /** Fallback height (px) before the page reports its own. Defaults to 320. */
  height?: number;
  className?: string;
  /** Navigate here once the order completes. */
  redirectOnComplete?: string;

  /** The checkout mounted and is ready. */
  onReady?: () => void;
  /**
   * The hosted page reported its content height (px). Optional — by default the frame auto-resizes
   * itself; provide this only to override or observe that behaviour.
   */
  onResize?: (height: number) => void;
  /** The order was placed inside the iframe. */
  onComplete?: (result: CheckoutOrderResult) => void;
  onError?: (e: { message: string; code?: string; raw?: unknown }) => void;
  /** The hosted page asked to be dismissed (e.g. a close button in a modal embed). */
  onClose?: () => void;
}

export interface CheckoutHandle {
  /** Ask the hosted checkout to refresh its cart state. */
  refresh: () => void;
  /** Remove the iframe and detach the listener. Safe to call more than once. */
  destroy: () => void;
  /** The live iframe element, or `null` after `destroy()`. */
  readonly iframe: HTMLIFrameElement | null;
}

function buildCheckoutSrc(options: CheckoutOptions): { src: string; origin: string } {
  if (options.url) {
    return { src: options.url, origin: new URL(options.url).origin };
  }
  const origin = resolvePaymentOrigin(options.baseUrl);
  const base = (options.path ?? '/checkout').replace(/\/+$/, '');
  // Confirmed hosted route is cart-based with a PATH param: `${origin}/checkout/{cartId}`.
  if (options.cartId) return { src: new URL(`${base}/${options.cartId}`, origin).toString(), origin };
  const u = new URL(base, origin);
  u.searchParams.set('event', options.eventId!);
  return { src: u.toString(), origin };
}

export function mountCheckout(target: HTMLElement | string, options: CheckoutOptions): CheckoutHandle {
  if (!options.url && !options.cartId && !options.eventId) {
    throw new Error('mountCheckout: provide one of `url`, `cartId`, or `eventId`');
  }

  const { src, origin } = buildCheckoutSrc(options);

  const frame = createCohostFrame(target, {
    src,
    origin,
    height: options.height ?? 320,
    className: options.className,
    title: 'Cohost checkout',
    onMessage: (data, controls) => {
      if (!isCheckoutUpMessage(data)) return;
      switch (data.event) {
        case 'ready':
          options.onReady?.();
          break;
        case 'resize':
          if (data.height > 0) {
            if (options.onResize) options.onResize(data.height);
            else controls.setHeight(data.height);
          }
          break;
        case 'order-complete':
          options.onComplete?.({ orderId: data.orderId, reference: data.reference, raw: data.raw });
          if (options.redirectOnComplete) window.location.assign(options.redirectOnComplete);
          break;
        case 'error':
          options.onError?.({ message: data.message, code: data.code, raw: data.raw });
          break;
        case 'close':
          options.onClose?.();
          break;
      }
    },
  });

  return {
    refresh: () => frame.post({ type: CHECKOUT_MESSAGE_TYPE, command: 'refresh' } satisfies CheckoutDownMessage),
    destroy: () => frame.destroy(),
    get iframe() {
      return frame.iframe;
    },
  };
}
