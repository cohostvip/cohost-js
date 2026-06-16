/**
 * `mountPaymentElement(target, options)` — framework-agnostic embedder for the cohost-HOSTED
 * card field only (`${origin}/pay/elements?cart=…`). It wires the `cohost-pay` postMessage
 * protocol (ready / change / resize / success / error / unavailable), auto-resizes, and returns
 * a handle to drive submission from your own Pay button.
 *
 * The card field lives on COHOST's own DOM; tokenization and the charge run server-side on the
 * cohost origin. Card data never touches the partner's DOM, and the order is placed by cohost.
 *
 * For embedding the WHOLE cart (tickets + coupon + customer + payment) rather than just the card
 * field, use {@link mountCheckout}.
 *
 *   const pay = mountPaymentElement('#card', {
 *     cartId: 'cart_123',
 *     onChange: (s) => { payBtn.disabled = !s.complete; },
 *     onSuccess: ({ reference }) => { location.href = '/thanks?ref=' + reference; },
 *   });
 *   payBtn.addEventListener('click', () => pay.submit());
 */
import { PAY_MESSAGE_TYPE, type PaymentFieldState, type PaymentProvider } from './protocol';
import {
  type CohostPaymentFrameTheme,
  resolvePaymentOrigin,
  detectEnvelopingTheme,
  buildSrc,
} from './theme';
import { dispatchPayUpMessage } from './messages';
import { createCohostFrame, resolveTarget } from './frame';

export interface PaymentElementOptions {
  /** The cohost cart-session id to pay for. Required — created via the commerce API / SDK. */
  cartId: string;
  /**
   * Override the cohost payment origin. Cascades: this option → env
   * (`COHOST_PAYMENT_URL` / `NEXT_PUBLIC_COHOST_PAYMENT_URL`) → `https://cohost.vip`.
   * Pass `https://dev.cohost.vip` for local development.
   */
  baseUrl?: string;
  /** Explicit design overrides forwarded to the hosted field. Keys you set win over auto-detected ones. */
  theme?: CohostPaymentFrameTheme;
  /**
   * Read the enveloping element's computed style (and a representative form input) and forward it
   * so the hosted field blends into the page. Defaults to `true`. Explicit `theme` keys always win.
   */
  autoStyle?: boolean;
  /**
   * Element to sample styling from under `autoStyle`. Defaults to `target`. (The React wrapper
   * passes its enveloping parent here.)
   */
  detectFrom?: HTMLElement;
  /** Fallback height (px) before the element reports its own. Defaults to 72. */
  height?: number;
  /**
   * The cart requires NO payment (a $0/free order, or a coupon that zeroed it). No card field is
   * rendered; `onFree` fires instead. Place the order directly in that path. The vanilla lib can't
   * see the cart total, so the caller decides this; pass `true` when the cart total is zero.
   */
  free?: boolean;
  /** Navigate here when the payment completes. */
  redirectOnSuccess?: string;
  /** Extra class applied to the `<iframe>`. */
  className?: string;

  /** The field mounted and is ready for input. */
  onReady?: () => void;
  /** The field's validity changed — gate your Pay button on `state.complete`. */
  onChange?: (state: PaymentFieldState) => void;
  /** Submission started (after you called `submit()`). */
  onProcessing?: () => void;
  onSuccess?: (r: { provider: PaymentProvider; reference: string; raw?: unknown }) => void;
  onError?: (e: { provider?: PaymentProvider; message: string; code?: string; raw?: unknown }) => void;
  /** The cart was missing/invalid — no field is shown. */
  onUnavailable?: (e: { code: string; message: string }) => void;
  /** The cart requires no payment (see `free`). */
  onFree?: () => void;
}

export interface PaymentElementHandle {
  /** Ask the cohost element to tokenize + charge the entered card. No-op for a free cart. */
  submit: () => void;
  /** Remove the iframe and detach the message listener. Safe to call more than once. */
  destroy: () => void;
  /** The live iframe element, or `null` for a free cart / after `destroy()`. */
  readonly iframe: HTMLIFrameElement | null;
}

export function mountPaymentElement(
  target: HTMLElement | string,
  options: PaymentElementOptions
): PaymentElementHandle {
  const host = resolveTarget(target);
  const { cartId } = options;
  if (!cartId) throw new Error('mountPaymentElement: `cartId` is required');

  const origin = resolvePaymentOrigin(options.baseUrl);
  const autoStyle = options.autoStyle ?? true;

  // Free cart → render no field, report it on the next tick (so the handle is returned first),
  // and hand back a no-op handle.
  if (options.free) {
    let freed = false;
    queueMicrotask(() => {
      if (!freed) options.onFree?.();
    });
    return {
      submit: () => {},
      destroy: () => {
        freed = true;
      },
      get iframe() {
        return null;
      },
    };
  }

  const detectEl = options.detectFrom ?? host;
  const detected = autoStyle ? detectEnvelopingTheme(detectEl) : {};
  // Detected style is the base; explicit `theme` keys win. buildSrc drops empty values.
  const mergedTheme: CohostPaymentFrameTheme = autoStyle
    ? { ...detected, ...options.theme }
    : { ...options.theme };

  const frame = createCohostFrame(host, {
    src: buildSrc(origin, cartId, mergedTheme),
    origin,
    height: options.height ?? 72,
    className: options.className,
    title: 'Cohost payment',
    onMessage: (data, controls) =>
      dispatchPayUpMessage(data, {
        onReady: options.onReady,
        onChange: options.onChange,
        onProcessing: options.onProcessing,
        onUnavailable: options.onUnavailable,
        onError: options.onError,
        onResize: controls.setHeight,
        onSuccess: (r) => {
          options.onSuccess?.(r);
          if (options.redirectOnSuccess) window.location.assign(options.redirectOnSuccess);
        },
      }),
  });

  return {
    submit: () => frame.post({ type: PAY_MESSAGE_TYPE, command: 'submit' }),
    destroy: () => frame.destroy(),
    get iframe() {
      return frame.iframe;
    },
  };
}
