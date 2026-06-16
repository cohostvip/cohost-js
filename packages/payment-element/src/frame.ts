/**
 * Shared, protocol-agnostic core for embedding a cohost-hosted iframe: it creates the `<iframe>`,
 * attaches an origin-filtered `message` listener, and exposes controls to resize / post down /
 * tear down. Both `mountPaymentElement` (the card field) and `mountCheckout` (the full cart) are
 * thin wrappers over this — they only differ in the URL they point at and the message protocol
 * they interpret.
 *
 * Cross-origin iframes can't be measured from the outside, so auto-resize is always driven by the
 * hosted page posting its own height UP; the host (`setHeight`) applies it. See each protocol's
 * `resize` event.
 */

/** Sandbox for a cohost-hosted frame: it runs its own scripts + charges through the edge; the
 *  partner can't reach into it (different origin). */
export const DEFAULT_COHOST_SANDBOX = 'allow-scripts allow-forms allow-same-origin allow-popups';

export interface CohostFrameControls {
  /** Set the iframe height (px). Wired to each protocol's `resize` event by default. */
  setHeight: (height: number) => void;
  /** Post a message DOWN to the hosted page (targeted at its origin). */
  post: (message: unknown) => void;
}

export interface CohostFrameHandle {
  /** Post a message DOWN to the hosted page. No-op after `destroy()`. */
  post: (message: unknown) => void;
  /** Remove the iframe and detach the listener. Safe to call more than once. */
  destroy: () => void;
  /** The live iframe element, or `null` after `destroy()`. */
  readonly iframe: HTMLIFrameElement | null;
}

export interface CreateCohostFrameOptions {
  /** Full iframe URL (already built, including query params). */
  src: string;
  /** Expected message origin — messages from any other origin are ignored. */
  origin: string;
  /** Fallback height (px) before the page reports its own. */
  height?: number;
  className?: string;
  title?: string;
  sandbox?: string;
  /** Called for every same-origin message; interpret the protocol here and use `controls`. */
  onMessage?: (data: unknown, controls: CohostFrameControls) => void;
}

/** Resolve an element or selector to an element, or throw with a clear message. */
export function resolveTarget(target: HTMLElement | string): HTMLElement {
  if (typeof target === 'string') {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) throw new Error(`cohost frame: no element matches selector "${target}"`);
    return el;
  }
  if (!target) throw new Error('cohost frame: a target element or selector is required');
  return target;
}

export function createCohostFrame(
  target: HTMLElement | string,
  options: CreateCohostFrameOptions
): CohostFrameHandle {
  const host = resolveTarget(target);

  const iframe = document.createElement('iframe');
  iframe.src = options.src;
  iframe.title = options.title ?? 'Cohost';
  iframe.setAttribute('sandbox', options.sandbox ?? DEFAULT_COHOST_SANDBOX);
  if (options.className) iframe.className = options.className;
  Object.assign(iframe.style, {
    width: '100%',
    height: `${options.height ?? 72}px`,
    border: '0',
    display: 'block',
    background: 'transparent',
    colorScheme: 'normal',
  } satisfies Partial<CSSStyleDeclaration>);

  const controls: CohostFrameControls = {
    setHeight: (h) => {
      iframe.style.height = `${Math.ceil(h)}px`;
    },
    post: (m) => {
      iframe.contentWindow?.postMessage(m, options.origin);
    },
  };

  const onMessage = (e: MessageEvent) => {
    if (e.origin !== options.origin) return; // only trust the cohost origin
    options.onMessage?.(e.data, controls);
  };

  window.addEventListener('message', onMessage);
  host.appendChild(iframe);

  let destroyed = false;
  return {
    post: (m) => {
      if (!destroyed) controls.post(m);
    },
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      window.removeEventListener('message', onMessage);
      iframe.remove();
    },
    get iframe() {
      return destroyed ? null : iframe;
    },
  };
}
