# @cohostvip/payment-element

[![npm version](https://img.shields.io/npm/v/@cohostvip/payment-element.svg)](https://www.npmjs.com/package/@cohostvip/payment-element)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Framework-agnostic embedder for the **Cohost hosted payment element**. It drops an `<iframe>` to
`https://cohost.vip/pay/elements?cart=…` into your page, wires the `cohost-pay` postMessage
protocol, auto-resizes to the field, and hands you a `submit()` you call from your own Pay button.

The card field lives on **cohost's** origin — tokenization and the charge happen server-side there.
**Card data never touches your DOM**, and cohost places the order. You never see a token or a
place-order URL.

This is the zero-dependency core shared by the React [`<CohostPaymentFrame>`](../react). Use this
package directly for **plain HTML, Webflow, or any non-React site**; use `@cohostvip/cohost-react`
if you're in React.

Two entry points:

- **`mountPaymentElement`** — just the **card field**, to embed inside your *own* cart UI.
- **`mountCheckout`** — the **whole hosted cart** (tickets + coupon + customer + payment) in one
  iframe. Simplest possible integration: nothing but the iframe touches your page — no API token,
  no cart API. Ideal for WordPress / Webflow.

## Install

```sh
npm i @cohostvip/payment-element
```

```ts
import { mountPaymentElement } from '@cohostvip/payment-element';

const pay = mountPaymentElement('#card', {
  cartId: 'cart_123',                       // from the cohost commerce API / SDK
  onChange: (s) => { payBtn.disabled = !s.complete; },
  onSuccess: ({ reference }) => { location.href = `/thanks?ref=${reference}`; },
  onError: ({ message }) => showError(message),
});

payBtn.addEventListener('click', () => pay.submit());
// later: pay.destroy();
```

## Embed the whole cart — `mountCheckout`

Drop the entire cohost-hosted checkout (tickets → coupon → customer → payment → confirmation) into
your page. Pass an event's `checkoutUrl` directly, or build it from a `cartId`. The frame
auto-resizes and reports `order-complete` so you can confirm or redirect.

```ts
import { mountCheckout } from '@cohostvip/payment-element';

const checkout = mountCheckout('#checkout', {
  url: event.checkoutUrl,                      // e.g. https://cohost.vip/checkout/cart_123
  // or: cartId: 'cart_123'  (→ https://cohost.vip/checkout/cart_123)
  onComplete: ({ reference }) => { location.href = `/thanks?ref=${reference}`; },
});
// later: checkout.destroy();
```

> Requires the cohost-hosted checkout page to be frame-allowed for your domain and to emit the
> `cohost-checkout` messages (`ready` / `resize` / `order-complete` / `error` / `close`). The host
> side here is ready; the hosted page emitting them is a cohost-side requirement.

## Plain HTML / Webflow (no bundler)

Load the IIFE build from a CDN; it exposes the global `CohostPaymentElement`:

```html
<div id="card"></div>
<button id="pay" disabled>Pay</button>

<script src="https://unpkg.com/@cohostvip/payment-element"></script>
<script>
  const payBtn = document.getElementById('pay');
  const pay = CohostPaymentElement.mountPaymentElement('#card', {
    cartId: 'cart_123',
    onChange: (s) => { payBtn.disabled = !s.complete; },
    onSuccess: ({ reference }) => { location.href = '/thanks?ref=' + reference; },
  });
  payBtn.addEventListener('click', () => pay.submit());
</script>
```

## Options

| Option | Default | Notes |
|---|---|---|
| `cartId` | — | **Required.** The cohost cart-session id to pay for. |
| `baseUrl` | `https://cohost.vip` | Payment origin. Use `https://dev.cohost.vip` for local dev (or set `COHOST_PAYMENT_URL`). |
| `autoStyle` | `true` | Read the enveloping element + a sample form input and theme the field to match. |
| `theme` | — | Explicit overrides (`accent`, `bg`, `text`, `font`, `radius`, …). Wins over auto-detected keys. |
| `detectFrom` | `target` | Element to sample styling from under `autoStyle`. |
| `height` | `72` | Fallback px height before the field reports its own. |
| `free` | `false` | Pass `true` when the cart total is `0`. No field is rendered; `onFree` fires — place the order directly. |
| `redirectOnSuccess` | — | Navigate here after a successful charge. |

### Callbacks

`onReady`, `onChange(state)`, `onProcessing`, `onSuccess({ provider, reference, raw })`,
`onError({ message, code, … })`, `onUnavailable({ code, message })`, `onFree()`.

## Handle

```ts
interface PaymentElementHandle {
  submit(): void;   // tokenize + charge the entered card
  destroy(): void;  // remove the iframe + detach the listener
  readonly iframe: HTMLIFrameElement | null;
}
```

## License

MIT
