/**
 * Shared dispatcher for the element → host (`PaymentUpMessage`) protocol. Both the vanilla
 * `mountPaymentElement` and the React `<CohostPaymentFrame>` route a verified-origin message
 * through here so the event→callback mapping lives in exactly one place.
 *
 * The CALLER is responsible for the origin check (`e.origin === origin`) before calling this —
 * we only validate the message shape.
 */
import { isPayUpMessage, type PaymentFieldState, type PaymentProvider } from './protocol';

export interface PayMessageHandlers {
  onReady?: () => void;
  onChange?: (state: PaymentFieldState) => void;
  /** Element reported its content height (px) — host decides how to apply it. */
  onResize?: (height: number) => void;
  onProcessing?: () => void;
  onSuccess?: (r: { provider: PaymentProvider; reference: string; raw?: unknown }) => void;
  onError?: (e: { provider?: PaymentProvider; message: string; code?: string; raw?: unknown }) => void;
  onUnavailable?: (e: { code: string; message: string }) => void;
}

/** Map a verified up-message to the matching handler. No-op for anything that isn't a valid up-message. */
export function dispatchPayUpMessage(data: unknown, handlers: PayMessageHandlers): void {
  if (!isPayUpMessage(data)) return;
  const m = data;
  switch (m.event) {
    case 'ready':
      handlers.onReady?.();
      break;
    case 'change':
      handlers.onChange?.({ complete: m.complete, valid: m.valid, empty: m.empty, brand: m.brand });
      break;
    case 'resize':
      if (m.height > 0) handlers.onResize?.(m.height);
      break;
    case 'processing':
      handlers.onProcessing?.();
      break;
    case 'success':
      handlers.onSuccess?.({ provider: m.provider, reference: m.reference, raw: m.raw });
      break;
    case 'error':
      handlers.onError?.({ provider: m.provider, message: m.message, code: m.code, raw: m.raw });
      break;
    case 'unavailable':
      handlers.onUnavailable?.({ code: m.code, message: m.message });
      break;
  }
}
