/**
 * Theme + origin helpers for the hosted payment element. All framework-agnostic DOM/string work,
 * shared by the vanilla `mountPaymentElement` and the React `<CohostPaymentFrame>`.
 */

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

/** Prod default origin for the cohost element page when neither option nor env is set. */
export const DEFAULT_PAYMENT_ORIGIN = 'https://cohost.vip';

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
 *   1. the `baseUrl` argument
 *   2. env — `COHOST_PAYMENT_URL` / `NEXT_PUBLIC_COHOST_PAYMENT_URL`
 *   3. `https://cohost.vip` (prod default)
 */
export function resolvePaymentOrigin(override?: string): string {
  const picked = override || envPaymentOrigin();
  return (picked || DEFAULT_PAYMENT_ORIGIN).replace(/\/+$/, '');
}

const TRANSPARENT = new Set(['rgba(0, 0, 0, 0)', 'transparent', '']);

/** Walk up from `el` until we find an element with a non-transparent background. */
export function resolveBackground(el: HTMLElement | null): string | undefined {
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
export function detectInputStyle(
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
export function detectEnvelopingTheme(el: HTMLElement | null): CohostPaymentFrameTheme {
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

/** Build the element-page URL: `${origin}/pay/elements?cart=…&<theme keys>`. Empty values dropped. */
export function buildSrc(origin: string, cartId: string, theme?: CohostPaymentFrameTheme): string {
  const u = new URL('/pay/elements', origin);
  u.searchParams.set('cart', cartId);
  for (const [k, v] of Object.entries(theme ?? {})) {
    if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, String(v));
  }
  return u.toString();
}
