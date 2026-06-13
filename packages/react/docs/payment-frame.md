# Embedding the Cohost Payment Frame (`<CohostPaymentFrame>`)

A guide for `@cohostvip/cohost-react` users: drop in **one component** that embeds the cohost-hosted card
field as an `<iframe>`, render **your own Pay button**, and Cohost handles the rest.

The card field renders on **Cohost's own DOM inside the iframe** — card data never touches your page.
Tokenization, the charge, and order placement all happen **server-side on the Cohost origin**. You never
see a token, a place-order URL, or secret keys, and your PCI surface stays minimal.

> **Three ways to take payment in cohost-react:**
> 1. **Payment Frame** (this guide) — embed `<CohostPaymentFrame>`. Lowest effort, smallest PCI scope; you
>    don't render any card fields. **Recommended for most integrations.**
> 2. **[Payment Element](./payment-element.md)** — render the card fields in *your* UI and call `tokenizeCard()`.
>    Use when you need full control of the field markup.
> 3. **Accept Hosted iframe (low-level)** — wire Authorize.Net's `AuthorizeNetIFrame` global yourself
>    (see the [README](../README.md#authnet-accept-hosted-iframe)). `<CohostPaymentFrame>` supersedes this.
>
> **Provider is automatic.** Stripe vs Authorize.Net is decided server-side by the cart's payment connection —
> you don't choose it in code, and the same component handles both.

---

## 1. Prerequisites

- A **cart-session id** held by a `CohostCheckoutProvider` (create one with `CohostStartCheckoutProvider`
  / `client.cart.start(...)`). The cart carries the amount, items, and the merchant's payment connection.
- The buyer's **customer + billing** info set on the cart (`setCustomer` / `setBillingAddress`) before paying —
  Authorize.Net uses the billing address for AVS.

## 2. Setup

`<CohostPaymentFrame>` reads the cart from context, so it must live inside a `CohostCheckoutProvider`
(itself inside a `CohostProvider`). It takes **no `cartId` prop** — that comes from the provider.

```tsx
'use client';
import { useRef, useState } from 'react';
import {
  CohostProvider,
  CohostCheckoutProvider,
  CohostPaymentFrame,
  type CohostPaymentFrameHandle,
  type PaymentFieldState,
} from '@cohostvip/cohost-react';

export function Checkout({ cartSessionId }: { cartSessionId: string }) {
  return (
    <CohostProvider token={process.env.NEXT_PUBLIC_COHOST_TOKEN!}>
      <CohostCheckoutProvider cartSessionId={cartSessionId}>
        <PayBox />
      </CohostCheckoutProvider>
    </CohostProvider>
  );
}

function PayBox() {
  const ref = useRef<CohostPaymentFrameHandle>(null);
  const [field, setField] = useState<PaymentFieldState | null>(null);
  const [processing, setProcessing] = useState(false);

  return (
    <div>
      <CohostPaymentFrame
        ref={ref}
        onChange={setField}                       // gate your button on field.complete
        onProcessing={() => setProcessing(true)}
        onSuccess={(r) => { /* paid — r.reference is the txn ref */ }}
        onError={(e) => { setProcessing(false); /* show e.message */ }}
      />

      {/* YOUR button drives submission */}
      <button
        onClick={() => ref.current?.submit()}
        disabled={!field?.complete || processing}
      >
        {processing ? 'Processing…' : 'Pay'}
      </button>
    </div>
  );
}
```

That's the whole integration: **embed → gate your button on `onChange` → call `submit()`**.

## 3. How it works

```
your page  ──<iframe>──▶  cohost element page (cohost.vip/pay/elements)
   │  ref.submit()  ───────────────▶  tokenize + charge + place order  (server-side, Cohost origin)
   │  ◀───────────  onReady / onChange / onProcessing / onSuccess / onError / onUnavailable
```

The component and the element talk over a small `postMessage` protocol. The element reports its state **up**
(ready, validity, resize, success…) and the component drives submission **down** via the `submit()` handle.
The order is placed by Cohost inside the iframe; your `onSuccess` is a notification, not a step you have to
complete.

## 4. Props

All props are optional — the cart and place-order method come from context.

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `theme` | `CohostPaymentFrameTheme` | — | Explicit look/feel: `{ accent?, bg?, text?, font?, radius? }`. Keys you set override auto-detected ones. |
| `autoStyle` | `boolean` | `true` | Read the **enveloping element's** computed style (bg / text color / font-family / radius) and theme the field to match. Set `false` to use the field's default (light) theme. |
| `baseUrl` | `string` | env / `cohost.vip` | Override the cohost payment origin (see [§6](#6-configuring-the-origin)). |
| `redirectOnSuccess` | `string` | — | Navigate here when the payment completes. |
| `onReady` | `() => void` | — | The field mounted and is ready for input. |
| `onChange` | `(s: PaymentFieldState) => void` | — | Validity changed — gate your Pay button on `s.complete`. |
| `onProcessing` | `() => void` | — | Submission started (after you called `submit()`). |
| `onSuccess` | `(r: { provider, reference, raw? }) => void` | — | Payment completed + order placed. |
| `onError` | `(e: { provider?, message, code?, raw? }) => void` | — | Tokenization/charge failed. |
| `onUnavailable` | `(e: { code, message }) => void` | — | Cart missing / not payable / **session not found** — no field is shown. |
| `height` | `number` | `72` | Fallback height before the field reports its own (it auto-resizes after `ready`). |
| `className` / `style` | — | — | Applied to the `<iframe>`. |

**Imperative handle** (via `ref`):

```ts
interface CohostPaymentFrameHandle {
  submit: () => void; // tokenize + charge the entered card
}
```

**Reported field state** (`onChange`):

```ts
interface PaymentFieldState {
  complete: boolean;   // all fields valid → safe to enable your Pay button
  valid: boolean;
  empty: boolean;
  brand: string | null; // 'visa' | 'mastercard' | 'amex' | 'discover' | …
}
```

## 5. Styling

`theme` is **optional**. With `autoStyle` on (the default), the component reads the element that **envelopes**
`<CohostPaymentFrame>` and forwards its style to the field, so it blends into your page automatically:

| Detected from the enveloping element | Forwarded as |
|--------------------------------------|--------------|
| first non-transparent `background-color` (walks up) | `bg` |
| `color` | `text` |
| `font-family` | `font` |
| `border-radius` | `radius` |

Explicit `theme` keys always **win** over the detected ones — so you can let it inherit the background and font
but force, say, the accent:

```tsx
// inherits bg/text/font/radius from the wrapper, but pins the accent
<CohostPaymentFrame theme={{ accent: '#f97316' }} />

// fully explicit — opt out of detection
<CohostPaymentFrame autoStyle={false} theme={{ bg: '#fff', text: '#111', radius: 8 }} />
```

> `accent` is **never** auto-detected — a plain container has none — so it stays the field default unless you
> set `theme.accent`. Spacing/padding isn't a field knob and isn't read.

## 6. Configuring the origin

The component resolves the cohost payment origin with this cascade:

```
baseUrl prop  →  env COHOST_PAYMENT_URL / NEXT_PUBLIC_COHOST_PAYMENT_URL  →  https://cohost.vip
```

- **Production:** nothing to set — it defaults to `https://cohost.vip`.
- **Local / staging:** set the env var (browser apps need the `NEXT_PUBLIC_` prefix), or pass `baseUrl`:

  ```bash
  # .env.local
  NEXT_PUBLIC_COHOST_PAYMENT_URL=https://dev.cohost.vip
  ```
  ```tsx
  <CohostPaymentFrame baseUrl="https://dev.cohost.vip" />
  ```

## 7. Session gating

`<CohostPaymentFrame>` renders **nothing** until the cart session has actually loaded
(`useCohostCheckout().status === 'ready'`). If the session is missing or 404s, it fires
`onUnavailable({ code: 'session_not_found' })` and embeds no field — you never show a payable form for an
invalid cart.

## 8. Notes & gotchas

- **No `cartId`, `token`, `placeOrderUrl`, or `formActionUrl` props.** The cart comes from the provider; the
  origin is configured; everything else is resolved server-side inside the iframe.
- **Your button, your context.** The component renders only the field — render your own Pay button (and summary,
  layout, etc.) around it and gate the button on `onChange().complete`.
- **Card data never touches your DOM.** It lives in the cross-origin cohost iframe; you can't read it and neither
  can your scripts.
- **`onSuccess` is a notification.** The order is already placed server-side when it fires — don't call
  `placeOrder()` yourself.
- **Set customer + billing first** (`setCustomer` / `setBillingAddress` from `useCohostCheckout`) before the
  buyer submits.

---

### Related
- [Payment Element guide](./payment-element.md) — render your own card fields and `tokenizeCard()`.
- [README → Checkout](../README.md#-checkout--cohostcheckoutprovider) — `CohostCheckoutProvider`, `placeOrder`.
- `useCohostCheckout()` — `cartSession`, `status`, coupons, customer, `placeOrder`.
