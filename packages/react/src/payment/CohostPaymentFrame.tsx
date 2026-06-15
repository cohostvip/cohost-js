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
 * Everything the tag needs comes from context or a sensible default — there are NO required
 * props:
 *   - `cartId`            ← read from the wrapping `<CohostCheckoutProvider>` (never a prop)
 *   - the iframe origin   ← derived from the configured client (`api.cohost.vip` →
 *                           `cohost.vip`), overridable with `baseUrl` for local/dev
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
import { PAY_MESSAGE_TYPE, isPayUpMessage, type PaymentFieldState, type PaymentProvider } from './protocol';

/** Prod default origin for the cohost element page when neither prop nor env is set. */
const DEFAULT_PAYMENT_ORIGIN = 'https://cohost.vip';

/** Look/feel knobs forwarded to the element page as query params (it themes the field). */
export interface CohostPaymentFrameTheme {
  accent?: string;
  bg?: string;
  text?: string;
  font?: string;
  radius?: number;
  /** Idle border color of the field — `autoStyle` reads it from the partner's own inputs. */
  borderColor?: string;
  /** Border width (px) of the field — read from the partner's inputs under `autoStyle`. */
  borderWidth?: number;
  /** Idle box-shadow ("shading") of the field — read from the partner's inputs under `autoStyle`. */
  boxShadow?: string;
}

export interface CohostPaymentFrameProps {
  /**
   * Override the cohost payment origin. Defaults to the client's origin with the `api.`
   * subdomain stripped (`https://api.cohost.vip` → `https://cohost.vip`), falling back to
   * `https://cohost.vip`. Pass `https://dev.cohost.vip` for local development.
   */
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
  onSuccess?: (r: { provider: PaymentProvider; reference: string; raw?: unknown }) => void;
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

/** Read the payment origin from env. Next inlines NEXT_PUBLIC_*; guarded for non-bundler envs. */
function envPaymentOrigin(): string | undefined {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.COHOST_PAYMENT_URL || process.env.NEXT_PUBLIC_COHOST_PAYMENT_URL || undefined;
    }
  } catch {
    /* no `process` global (some browser bundlers) */
  }
  return undefined;
}

/**
 * Resolve the cohost payment origin, cascading:
 *   1. the `baseUrl` prop
 *   2. env — `COHOST_PAYMENT_URL` / `NEXT_PUBLIC_COHOST_PAYMENT_URL`
 *   3. `https://cohost.vip` (prod default)
 */
function resolvePaymentOrigin(override?: string): string {
  const picked = override || envPaymentOrigin();
  return (picked || DEFAULT_PAYMENT_ORIGIN).replace(/\/+$/, '');
}

const TRANSPARENT = new Set(['rgba(0, 0, 0, 0)', 'transparent', '']);

/** Walk up from `el` until we find an element with a non-transparent background. */
function resolveBackground(el: HTMLElement | null): string | undefined {
  let node: HTMLElement | null = el;
  while (node) {
    const bg = getComputedStyle(node).backgroundColor;
    if (!TRANSPARENT.has(bg)) return bg;
    node = node.parentElement;
  }
  return undefined;
}

/** Text-like fields we can sample the partner's input styling from. */
const SAMPLEABLE_INPUT =
  'input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=submit]):not([type=button]):not([type=file]), textarea, select';

/**
 * Find a representative form field on the PARTNER's page and read its border + shading so the
 * hosted card field can match it (radius / border color+width / box-shadow). Prefers a field
 * in the same `<form>` as the frame, else the first visible one. Returns only what it can read
 * with confidence — a borderless input contributes no border keys.
 */
function detectInputStyle(
  el: HTMLElement | null
): Pick<CohostPaymentFrameTheme, 'borderColor' | 'borderWidth' | 'radius' | 'boxShadow'> {
  if (!el || typeof document === 'undefined') return {};
  const scope: ParentNode = el.closest('form') ?? document;
  const input = Array.from(scope.querySelectorAll<HTMLElement>(SAMPLEABLE_INPUT)).find((n) => {
    if (el.contains(n)) return false; // skip anything inside our own wrapper
    const r = n.getBoundingClientRect();
    return r.width > 0 && r.height > 0; // visible only
  });
  if (!input) return {};
  const cs = getComputedStyle(input);
  const out: Pick<CohostPaymentFrameTheme, 'borderColor' | 'borderWidth' | 'radius' | 'boxShadow'> = {};
  const bw = parseFloat(cs.borderTopWidth);
  if (cs.borderTopStyle !== 'none' && Number.isFinite(bw) && bw > 0) {
    out.borderWidth = Math.round(bw);
    if (!TRANSPARENT.has(cs.borderTopColor)) out.borderColor = cs.borderTopColor;
  }
  const radius = parseInt(cs.borderRadius, 10);
  if (Number.isFinite(radius)) out.radius = radius;
  if (cs.boxShadow && cs.boxShadow !== 'none') out.boxShadow = cs.boxShadow;
  return out;
}

/**
 * Derive a theme from the ENVELOPING element's computed style: background (walking up for the
 * first non-transparent one), text color, font-family, and corner radius. We deliberately do
 * NOT invent an `accent` — a plain container has none; it stays the field default unless the
 * partner sets `theme.accent`. (Spacing/padding isn't a hosted-field knob, so it's not read.)
 *
 * We also sample a representative partner INPUT (via {@link detectInputStyle}) so the card box
 * inherits the same border + shading as the surrounding form fields — its radius wins over the
 * wrapper's so the corners line up. Any of these is overridden by an explicit `theme` key.
 */
function detectEnvelopingTheme(el: HTMLElement | null): CohostPaymentFrameTheme {
  if (!el) return {};
  const cs = getComputedStyle(el);
  const radius = parseInt(cs.borderRadius, 10);
  return {
    bg: resolveBackground(el),
    text: cs.color || undefined,
    font: cs.fontFamily || undefined,
    radius: Number.isFinite(radius) ? radius : undefined,
    ...detectInputStyle(el),
  };
}

function buildSrc(origin: string, cartId: string, theme?: CohostPaymentFrameTheme): string {
  const u = new URL('/pay/elements', origin);
  u.searchParams.set('cart', cartId);
  for (const [k, v] of Object.entries(theme ?? {})) {
    if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, String(v));
  }
  return u.toString();
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
        if (!isPayUpMessage(e.data)) return;
        const m = e.data;
        switch (m.event) {
          case 'ready':
            cb.current.onReady?.();
            break;
          case 'change':
            cb.current.onChange?.({ complete: m.complete, valid: m.valid, empty: m.empty, brand: m.brand });
            break;
          case 'resize':
            if (m.height > 0) setMeasured(Math.ceil(m.height));
            break;
          case 'processing':
            cb.current.onProcessing?.();
            break;
          case 'success':
            cb.current.onSuccess?.({ provider: m.provider, reference: m.reference, raw: m.raw });
            if (cb.current.redirectOnSuccess) window.location.assign(cb.current.redirectOnSuccess);
            break;
          case 'error':
            cb.current.onError?.({ provider: m.provider, message: m.message, code: m.code, raw: m.raw });
            break;
          case 'unavailable':
            cb.current.onUnavailable?.({ code: m.code, message: m.message });
            break;
        }
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
