# Implementing payment with the Cohost Payment Element

A guide for `@cohostvip/cohost-react` users: collect card details in **your own UI** and take a payment
through Cohost, using `PaymentElementProvider` + `usePaymentElement`.

You render the card inputs; the element **tokenizes the card client-side** (so raw card data goes straight to
the payment processor, not to your server) and Cohost **charges server-side** using the merchant's own payment
connection. Your app never handles secret keys.

> **Three ways to take payment in cohost-react:**
> 1. **Payment Frame** (see the [Payment Frame guide](./payment-frame.md)) — embed `<CohostPaymentFrame>`; the card
>    field is hosted by Cohost in an iframe. Lowest effort + PCI surface; **recommended** unless you need your own field markup.
> 2. **Payment Element** (this guide) — you render the card fields and call `tokenizeCard()`. Best when you want
>    your own checkout UI.
> 3. **Accept Hosted iframe** (see the [README](../README.md#authnet-accept-hosted-iframe)) — embed Authorize.Net's
>    hosted iframe and hand its callback to `submitAuthnetIframeTransaction()`.
>
> **Provider support:** the Payment Element currently tokenizes **Authorize.Net** (Accept.js). Stripe via the
> Payment Element is on the roadmap. Which provider runs is decided server-side by the cart's payment
> connection — you don't choose it in code.

---

## 1. Prerequisites

- A **cart-session id**. Create one with `CohostStartCheckoutProvider` (`getCartSessionId()`) or from your own
  call to `client.cart.start(...)`. The cart carries the amount, items, and the merchant's payment connection.
- The buyer's **customer + billing** info set on the cart (`setCustomer` / `setBillingAddress`) before paying.

## 2. Provider setup

Nest the providers: `CohostProvider` → `CohostCheckoutProvider` → `PaymentElementProvider`.

```tsx
import {
  CohostProvider,
  CohostCheckoutProvider,
  PaymentElementProvider,
} from '@cohostvip/cohost-react';

export function Checkout({ cartSessionId }: { cartSessionId: string }) {
  return (
    <CohostProvider token={process.env.NEXT_PUBLIC_COHOST_TOKEN!}>
      <CohostCheckoutProvider cartSessionId={cartSessionId}>
        <PaymentElementProvider>
          <PaymentForm />
        </PaymentElementProvider>
      </CohostCheckoutProvider>
    </CohostProvider>
  );
}
```

`PaymentElementProvider` automatically loads the cart's **payment intent** (provider + the public keys the
tokenizer needs) and registers the provider's client script (e.g. Accept.js). Nothing to wire up yourself.

## 3. The hook

```ts
import { usePaymentElement, useCohostCheckout } from '@cohostvip/cohost-react';

const { paymentIntent, isLoading, tokenizeCard } = usePaymentElement();
const { processPayment, placeOrder } = useCohostCheckout();
```

| From `usePaymentElement()` | Type | Purpose |
|----------------------------|------|---------|
| `tokenizeCard(card)` | `(card: CreditCardInformation) => Promise<any>` | Tokenize the entered card (client-side). Resolves with the processor token; **throws** on a tokenization error. |
| `paymentIntent` | `object \| null` | The cart's resolved intent (provider + public keys). Usually you don't read it directly. |
| `isLoading` | `boolean` | True while the intent is being fetched. |

The card you pass in:

```ts
interface CreditCardInformation {
  cardNumber: string; // digits, spaces ok
  month: number;      // 1–12
  year: number;       // 2- or 4-digit (e.g. 27 or 2027)
  cardCode: string;   // CVV / CVC
  nameOnCard: string;
}
```

## 4. Take the payment

Render your own card inputs, then on submit run **tokenize → process → place order**:

```ts
async function pay(card: CreditCardInformation) {
  // 1) Tokenize the card client-side (Accept.js). Throws if the card is rejected.
  const token = await tokenizeCard(card);

  // 2) Charge it server-side via the merchant's connection.
  const tx = await processPayment({ opaqueData: token.opaqueData });

  // 3) Verify + create the order.
  const order = await placeOrder({
    transaction: { provider: 'authnet', transId: tx.transId },
  });

  return order; // { result, redirUri, id, uid, accessToken? }
}
```

> The server independently re-verifies the transaction with the processor (status, amount, currency) before
> creating the order — the client result is never trusted as the source of truth.

## 5. Full example

```tsx
'use client';
import { useState } from 'react';
import {
  usePaymentElement,
  useCohostCheckout,
  formatCurrency,
  type CreditCardInformation,
} from '@cohostvip/cohost-react';

export function PaymentForm() {
  const { tokenizeCard, isLoading } = usePaymentElement();
  const { cartSession, processPayment, placeOrder } = useCohostCheckout();

  const [card, setCard] = useState<CreditCardInformation>({
    cardNumber: '', month: 0, year: 0, cardCode: '', nameOnCard: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPay = async () => {
    setBusy(true);
    setError(null);
    try {
      const token = await tokenizeCard(card);                                  // 1. tokenize
      const tx = await processPayment({ opaqueData: token.opaqueData });        // 2. charge
      const order = await placeOrder({                                         // 3. finalize
        transaction: { provider: 'authnet', transId: tx.transId },
      });
      if (order?.redirUri) window.location.assign(order.redirUri);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed');
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) return <p>Loading payment…</p>;

  return (
    <form onSubmit={(e) => { e.preventDefault(); onPay(); }}>
      <input placeholder="Name on card"
        value={card.nameOnCard}
        onChange={(e) => setCard({ ...card, nameOnCard: e.target.value })} />
      <input placeholder="Card number" inputMode="numeric"
        value={card.cardNumber}
        onChange={(e) => setCard({ ...card, cardNumber: e.target.value })} />
      <input placeholder="MM" inputMode="numeric"
        onChange={(e) => setCard({ ...card, month: Number(e.target.value) })} />
      <input placeholder="YY" inputMode="numeric"
        onChange={(e) => setCard({ ...card, year: Number(e.target.value) })} />
      <input placeholder="CVC" inputMode="numeric"
        value={card.cardCode}
        onChange={(e) => setCard({ ...card, cardCode: e.target.value })} />

      <button type="submit" disabled={busy}>
        {busy ? 'Processing…' : `Pay ${formatCurrency(cartSession?.costs?.total)}`}
      </button>

      {error && <p role="alert">{error}</p>}
    </form>
  );
}
```

`formatCurrency` turns the cart's `"USD,4999"` cost string into `"$49.99"`.

## 6. Free / fully-discounted carts

If the cart total is zero (e.g. a 100%-off coupon), skip tokenization entirely and just place the order:

```ts
const order = await placeOrder(); // no transaction needed
```

## 7. Notes & gotchas

- **Set customer + billing first.** Call `setCustomer(...)` / `setBillingAddress(...)` (from `useCohostCheckout`)
  before paying — Authorize.Net uses the billing address for AVS.
- **`tokenizeCard` throws** on a rejected card (bad number, expired, etc.) — surface `error.message` to the buyer.
- **Provider is automatic.** You don't branch on Stripe vs Authnet; the cart's connection decides. Today the
  Payment Element tokenizer supports Authorize.Net — for Stripe-backed carts, use the Accept Hosted iframe flow
  in the [README](../README.md) until the Stripe tokenizer ships.
- **No secrets in your app.** Only public keys reach the browser (via `paymentIntent`); the charge runs on
  Cohost with the merchant's connection.

---

### Related
- [README → Checkout & Accept Hosted iframe](../README.md#-checkout--cohostcheckoutprovider)
- `useCohostCheckout()` — cart items, coupons, customer, `placeOrder`, `processPayment`
- `usePaymentElement()` — `tokenizeCard`, `paymentIntent`
