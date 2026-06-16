'use client';

/**
 * `<CohostPaymentFrame>` — the partner-facing tag that embeds the cohost-HOSTED card field.
 *
 * Drop it anywhere inside a `<CohostCheckoutProvider>` and it renders an `<iframe>` to the
 * cohost element page (`${origin}/pay/elements?cart=…`). The card field lives on COHOST's own
 * DOM; tokenization and the charge run server-side on the cohost origin through the checkout
 * edge. Card data never touches the partner's DOM, and the order is placed by cohost — the
 * partner never sees a token, a place-order URL, or the cart id wiring.
 *
 * This is a thin React shell over the framework-agnostic `@cohostvip/payment-element` core
 * (origin resolution, theme auto-detection, `buildSrc`, and the `cohost-pay` postMessage
 * protocol all live there). The component owns only what's genuinely React: reading the cart
 * from context, and the render/effect lifecycle.
 *
 * Everything the tag needs comes from context or a sensible default — there are NO required
 * props:
 *   - `cartId`            ← read from the wrapping `<CohostCheckoutProvider>` (never a prop)
 *   - the iframe origin   ← derived from env/baseUrl, overridable with `baseUrl` for local/dev
 *   - place-order / token / form-action / communicator → all server-side inside the iframe
 *
 * The partner owns the surrounding context: render your OWN "Pay" button and call the
 * `submit()` handle, gating it on the `onChange` validity.
 *
 *   const ref = useRef<CohostPaymentFrameHandle>(null);
 *   <CohostPaymentFrame ref={ref} onChange={s => setReady(s.complete)} onSuccess={…} />
 *   <button disabled={!ready} onClick={() => ref.current?.submit()}>Pay</button>
 */
import * as React from 'react';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useCohostCheckout } from '../context/CohostCheckoutContext';
import {
  PAY_MESSAGE_TYPE,
  resolvePaymentOrigin,
  detectEnvelopingTheme,
  buildSrc,
  dispatchPayUpMessage,
  type CohostPaymentFrameTheme,
  type PaymentFieldState,
  type PaymentProvider,
  type PaymentSuccessResult,
} from '@cohostvip/payment-element';

export type { CohostPaymentFrameTheme };

export interface CohostPaymentFrameProps {
  /**
   * Override the cohost payment origin. Cascades: this prop → env
   * (`COHOST_PAYMENT_URL` / `NEXT_PUBLIC_COHOST_PAYMENT_URL`) → `https://cohost.vip`.
   * Pass `https://dev.cohost.vip` (or set the env var) for local development.
   */
  baseUrl?: string;
  /**
   * Explicit design overrides forwarded to the hosted field (accent/bg/text/font/radius).
   * Optional — with `autoStyle` on (the default), any key you omit is filled in from the
   * enveloping element. Keys you DO set here win over the auto-detected values.
   */
  theme?: CohostPaymentFrameTheme;
  /**
   * Read the ENVELOPING element's computed style (background, text color, font-family,
   * corner radius) and forward it to the hosted field so it blends into the partner's page.
   * Defaults to `true`. Set `false` to use the hosted field's own default (light) theme.
   * Explicit `theme` keys always override the detected ones.
   */
  autoStyle?: boolean;
  /** Navigate here when the payment completes. */
  redirectOnSuccess?: string;

  /** The field mounted and is ready for input. */
  onReady?: () => void;
  /** The field's validity changed — gate your Pay button on `state.complete`. */
  onChange?: (state: PaymentFieldState) => void;
  /** Submission started (after you called `submit()`). */
  onProcessing?: () => void;
  onSuccess?: (r: PaymentSuccessResult) => void;
  onError?: (e: { provider?: PaymentProvider; message: string; code?: string; raw?: unknown }) => void;
  /** The cart was missing/invalid — no field is shown. */
  onUnavailable?: (e: { code: string; message: string }) => void;
  /**
   * The cart requires NO payment — a free ticket ($0 total), or a coupon that zeroed the cart
   * (the cohost backend flips the intent to the free marker: `paymentIntentId: 'no-cost'`,
   * `meta.paymentIntent: null`). The frame renders NO card field in this state. Render your own
   * "free order" path and place the order directly. Fires once each time the cart enters the
   * free state (e.g. after applying a 100%-off coupon to a previously-payable cart).
   */
  onFree?: () => void;

  /** Fallback height before the iframe reports its own (auto-resizes after `ready`). */
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface CohostPaymentFrameHandle {
  /** Ask the cohost element to tokenize + charge the entered card. */
  submit: () => void;
}

export const CohostPaymentFrame = forwardRef<CohostPaymentFrameHandle, CohostPaymentFrameProps>(
  function CohostPaymentFrame(props, ref) {
    const { baseUrl, theme, autoStyle = true, redirectOnSuccess, onReady, onChange, onProcessing, onSuccess, onError, onUnavailable, onFree, height = 72, className, style } = props;

    // The cart id, load status, and resolved session come from context — never from the partner.
    // We only embed the element once the cart session has actually loaded.
    const { cartSessionId, status, cartSession } = useCohostCheckout();

    const origin = resolvePaymentOrigin(baseUrl);

    // The cart needs NO payment when its total is zero, or the backend has flipped the intent to
    // the free marker (a coupon that zeroed the cart → paymentIntentId 'no-cost', meta.paymentIntent
    // cleared). In that case we render no field and report `onFree` so the partner shows its own
    // free-order path — never load a card iframe for a $0 cart.
    const total = (cartSession as { costs?: { total?: string } } | null)?.costs?.total;
    const intent = (cartSession as { meta?: { paymentIntent?: unknown } } | null)?.meta?.paymentIntent;
    const intentId = (cartSession as { paymentIntentId?: string } | null)?.paymentIntentId;
    const isFree = status === 'ready' && ((!!total && total.endsWith(',0')) || (!intent && intentId === 'no-cost'));

    const wrapRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [measured, setMeasured] = useState<number | null>(null);
    const [detected, setDetected] = useState<CohostPaymentFrameTheme | null>(null);
    // With autoStyle on we wait for one measurement pass so the iframe loads ALREADY themed
    // (no flash of the default field, no double load).
    const [measuredStyle, setMeasuredStyle] = useState(false);

    // Auto-detect the enveloping element's style once the wrapper is in the DOM.
    useEffect(() => {
      if (!autoStyle) return;
      setDetected(detectEnvelopingTheme(wrapRef.current?.parentElement ?? null));
      setMeasuredStyle(true);
    }, [autoStyle, status]);

    // Detected style is the base; explicit `theme` keys win. buildSrc drops empty values.
    const mergedTheme: CohostPaymentFrameTheme | undefined =
      autoStyle ? { ...detected, ...theme } : theme;
    const styleReady = !autoStyle || measuredStyle;
    // No card iframe for a free cart.
    const src = status === 'ready' && cartSessionId && styleReady && !isFree ? buildSrc(origin, cartSessionId, mergedTheme) : null;

    // Keep latest callbacks without re-binding the message listener.
    const cb = useRef({ onReady, onChange, onProcessing, onSuccess, onError, onUnavailable, onFree, redirectOnSuccess });
    cb.current = { onReady, onChange, onProcessing, onSuccess, onError, onUnavailable, onFree, redirectOnSuccess };

    useImperativeHandle(
      ref,
      () => ({
        submit: () => {
          iframeRef.current?.contentWindow?.postMessage({ type: PAY_MESSAGE_TYPE, command: 'submit' }, origin);
        },
      }),
      [origin]
    );

    useEffect(() => {
      const onMessage = (e: MessageEvent) => {
        if (e.origin !== origin) return; // only trust the cohost element origin
        dispatchPayUpMessage(e.data, {
          onReady: () => cb.current.onReady?.(),
          onChange: (s) => cb.current.onChange?.(s),
          onProcessing: () => cb.current.onProcessing?.(),
          onUnavailable: (x) => cb.current.onUnavailable?.(x),
          onError: (x) => cb.current.onError?.(x),
          onResize: (h) => setMeasured(Math.ceil(h)),
          onSuccess: (r) => {
            cb.current.onSuccess?.(r);
            if (cb.current.redirectOnSuccess) window.location.assign(cb.current.redirectOnSuccess);
          },
        });
      };
      window.addEventListener('message', onMessage);
      return () => window.removeEventListener('message', onMessage);
    }, [origin]);

    // The cart session was not found / failed to load → tell the partner and embed nothing.
    useEffect(() => {
      if (status === 'error') {
        cb.current.onUnavailable?.({ code: 'session_not_found', message: 'Cart session not found' });
      }
    }, [status]);

    // Free cart → report it once per transition into the free state; the field renders nothing.
    const freeFiredRef = useRef(false);
    useEffect(() => {
      if (isFree && !freeFiredRef.current) {
        freeFiredRef.current = true;
        cb.current.onFree?.();
      } else if (!isFree) {
        freeFiredRef.current = false;
      }
    }, [isFree]);

    // Session not found / failed to load → render nothing at all.
    if (status === 'error') return null;

    // `display: contents` keeps wrapRef.parentElement === the partner's enveloping element
    // (so auto-detect reads the right node) without adding a box to the layout. The wrapper
    // mounts before the cart resolves so the style can be measured; the iframe only appears
    // once the session is loaded AND the (themed) src is built.
    return (
      <div ref={wrapRef} style={{ display: 'contents' }}>
        {src ? (
          <iframe
            ref={iframeRef}
            src={src}
            title="Cohost payment"
            // allow-same-origin so the cohost page can run its scripts + charge through the edge;
            // the partner can't reach into it (different origin).
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            className={className}
            style={{ width: '100%', height: measured ?? height, border: 0, display: 'block', background: 'transparent', colorScheme: 'normal', ...style }}
          />
        ) : null}
      </div>
    );
  }
);
