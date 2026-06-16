/**
 * postMessage contract for embedding the FULL cohost-hosted checkout (the whole cart: ticket
 * selection + coupon + customer + payment) in a partner iframe — the counterpart to the
 * payment-field-only `cohost-pay` protocol in {@link ./protocol}.
 *
 *   checkout page → host : { type: 'cohost-checkout', event: ... }
 *   host → checkout page : { type: 'cohost-checkout', command: ... }
 *
 * NOTE: this is the contract the cohost-hosted checkout page must implement to be embeddable
 * (it must emit at least `resize` for seamless auto-height, and `order-complete` so the partner
 * can show its own confirmation / redirect). The vanilla host side ({@link ./checkout}) is ready;
 * the hosted page emitting these is a cohost-side requirement.
 */
export const CHECKOUT_MESSAGE_TYPE = 'cohost-checkout';

export interface CheckoutOrderResult {
  /** The created order id, when the hosted page exposes it. */
  orderId?: string;
  /** A human/reference code for the order, when available. */
  reference?: string;
  /** The verbatim payload from the hosted page. */
  raw?: unknown;
}

/** checkout page → host */
export type CheckoutUpMessage =
  | { type: typeof CHECKOUT_MESSAGE_TYPE; event: 'ready' }
  | { type: typeof CHECKOUT_MESSAGE_TYPE; event: 'resize'; height: number }
  | ({ type: typeof CHECKOUT_MESSAGE_TYPE; event: 'order-complete' } & CheckoutOrderResult)
  | { type: typeof CHECKOUT_MESSAGE_TYPE; event: 'error'; message: string; code?: string; raw?: unknown }
  | { type: typeof CHECKOUT_MESSAGE_TYPE; event: 'close' };

/** host → checkout page */
export type CheckoutDownMessage = { type: typeof CHECKOUT_MESSAGE_TYPE; command: 'refresh' };

export function isCheckoutUpMessage(d: unknown): d is CheckoutUpMessage {
  return (
    !!d &&
    typeof d === 'object' &&
    (d as { type?: unknown }).type === CHECKOUT_MESSAGE_TYPE &&
    'event' in (d as object)
  );
}
