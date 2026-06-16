/**
 * postMessage contract between the cohost-hosted payment ELEMENT (rendered in an iframe on
 * cohost's own DOM, e.g. https://cohost.vip/pay/elements) and the partner-side host
 * (`mountPaymentElement` / the React `<CohostPaymentFrame>`) embedded in the partner's page.
 *
 * The element is headless: it renders only the card field, tokenizes + charges through the
 * checkout edge on cohost's own origin, and reports its state up. The partner host decides
 * the surrounding context (its own pay button, when to show it) and drives submission down.
 * Card data never leaves the cohost iframe.
 *
 *   element → host : { type: 'cohost-pay', event: ... }   (status/lifecycle)
 *   host → element : { type: 'cohost-pay', command: ... } (control)
 *
 * This is the public partner contract, so it lives in this public, dependency-free lib — the
 * partner host never imports anything from cohost's internal packages.
 */
export const PAY_MESSAGE_TYPE = 'cohost-pay';

export type PaymentProvider = 'stripe' | 'authnet';

/** Validity snapshot emitted as the buyer edits the field. */
export interface PaymentFieldState {
  /** All fields present and individually valid → ready to submit. */
  complete: boolean;
  /** Same as complete today; kept distinct for providers that separate "valid" from "complete". */
  valid: boolean;
  /** No input entered yet. */
  empty: boolean;
  /** Detected card brand (visa/mastercard/amex/discover), or null. */
  brand: string | null;
}

/** element → host */
export type PaymentUpMessage =
  | { type: typeof PAY_MESSAGE_TYPE; event: 'ready'; provider: PaymentProvider }
  | ({ type: typeof PAY_MESSAGE_TYPE; event: 'change'; provider: PaymentProvider } & PaymentFieldState)
  | { type: typeof PAY_MESSAGE_TYPE; event: 'resize'; height: number }
  | { type: typeof PAY_MESSAGE_TYPE; event: 'processing'; provider: PaymentProvider }
  | { type: typeof PAY_MESSAGE_TYPE; event: 'success'; provider: PaymentProvider; reference: string; raw?: unknown }
  | { type: typeof PAY_MESSAGE_TYPE; event: 'error'; provider?: PaymentProvider; message: string; code?: string; raw?: unknown }
  | { type: typeof PAY_MESSAGE_TYPE; event: 'unavailable'; code: string; message: string };

/** host → element */
export type PaymentDownMessage = { type: typeof PAY_MESSAGE_TYPE; command: 'submit' };

export function isPayUpMessage(d: unknown): d is PaymentUpMessage {
  return !!d && typeof d === 'object' && (d as { type?: unknown }).type === PAY_MESSAGE_TYPE && 'event' in (d as object);
}
export function isPayDownMessage(d: unknown): d is PaymentDownMessage {
  return !!d && typeof d === 'object' && (d as { type?: unknown }).type === PAY_MESSAGE_TYPE && 'command' in (d as object);
}
