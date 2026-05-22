# Build the Auth.Net Accept Hosted request (`paymentRequest`)

How to fetch the enriched `paymentRequest` payload and use it to build your
Authorize.Net Accept Hosted iframe request, so the resulting transaction lands
fully populated (billing, tax, order, items) instead of barren.

Requires `@cohostvip/cohost-node@^0.3.20` / `@cohostvip/cohost-react@^0.3.20`.

For the *other* side — placing the Cohost order after the iframe succeeds — see
[authnet-iframe-checkout.md](./authnet-iframe-checkout.md).

---

## What you get

For Auth.Net carts, the payment-intent response now includes a `paymentRequest`
field: a ready-to-use Authorize.Net `transactionRequest` you merge into your
`getHostedPaymentPageRequest` (Accept Hosted) or `createTransactionRequest`
(direct API).

```jsonc
{
  "provider": "authnet",
  "apiLoginId": "…",
  "publicClientKey": "…",
  "paymentRequest": {
    "transactionRequest": {
      "transactionType": "authCaptureTransaction",
      "amount": "20.00",
      "currencyCode": "USD",
      "customer": { "email": "demo@example.com" },
      "billTo": {
        "firstName": "Enrich", "lastName": "Tester", "phoneNumber": "+15551234567",
        "address": "1 Test Street", "city": "Brooklyn", "state": "NY",
        "zip": "11211", "country": "US"
      },
      "lineItems": {
        "lineItem": [
          { "itemId": "offering-simple", "name": "General Admission",
            "description": "offering-simple", "quantity": 2,
            "unitPrice": "10.00", "taxable": false }
        ]
      },
      "order": {
        "invoiceNumber": "WnUsVKAVLIWiy1S65qFJ",
        "description": "Summer Fest — 2x General Admission @ 10.00"
      }
    }
  }
}
```

`amount` is authoritative. `order.invoiceNumber` is the cart id (≤20 chars) — keep
it so the server can bind the transaction back to the cart. `tax` and `shipping`
blocks appear only when non-zero.

---

## Fetch it

The payload is built **fresh on every request** and is **not** persisted on the
cart, so you must fetch it from the endpoint (don't read `cart.meta.paymentIntent`).

### React

```tsx
import { PaymentElementProvider, usePaymentElement } from '@cohostvip/cohost-react';

// forceFetchPaymentIntent bypasses the cached meta.paymentIntent and always
// calls /payment/payment-intent — required to receive paymentRequest.
<PaymentElementProvider forceFetchPaymentIntent>
  <Checkout />
</PaymentElementProvider>;

function Checkout() {
  const { paymentIntent } = usePaymentElement();
  const transactionRequest = paymentIntent?.paymentRequest?.transactionRequest;
  // …hand transactionRequest to your getHostedPaymentPageRequest call
}
```

Or call the client directly (always hits the endpoint, no provider needed):

```tsx
import { useCohostClient } from '@cohostvip/cohost-react';

const { client } = useCohostClient();
const intent = await client.cart.getPaymentIntent(sessionId);
const transactionRequest = intent.paymentRequest?.transactionRequest;
```

### Node

```ts
const intent = await client.cart.getPaymentIntent(sessionId);
const transactionRequest = intent.paymentRequest?.transactionRequest; // fully typed
```

---

## What Accept Hosted honors (L2 vs L3)

The hosted iframe is **Level-2 only**. These fields populate the transaction:
`customer`, `billTo`, `tax`, `shipping`, `order.invoiceNumber`, `order.description`.

`lineItems` is **Level-3** detail — the hosted iframe silently ignores it (the
form is summarized). It's included anyway because it works verbatim if you use the
direct `createTransactionRequest` API. To keep item context visible on a hosted
transaction, the item summary is also packed into `order.description`
(`<Event Name> — Nx <item> @ <price>; …`, capped at 255 chars).

---

## Merge into `getHostedPaymentPageRequest`

Add your own `merchantAuthentication` and `hostedPaymentSettings`; drop our
`transactionRequest` in as-is:

```ts
const body = {
  getHostedPaymentPageRequest: {
    merchantAuthentication: { name: API_LOGIN_ID, transactionKey: TRANSACTION_KEY },
    transactionRequest, // ← from intent.paymentRequest.transactionRequest
    hostedPaymentSettings: {
      setting: [
        { settingName: 'hostedPaymentReturnOptions',
          settingValue: JSON.stringify({ showReceipt: false }) },
        { settingName: 'hostedPaymentIFrameCommunicatorUrl',
          settingValue: JSON.stringify({ url: 'https://yoursite.com/communicator' }) },
      ],
    },
  },
};
// POST to https://api.authorize.net/xml/v1/request.api → returns a form token.
```

---

## Generate a query string

If your tooling needs the payload flattened to a URL-encoded query string (bracket
notation), use this helper:

```ts
import type { AuthNetPaymentRequest } from '@cohostvip/cohost-node';

/** Flatten paymentRequest into a URL-encoded query string (bracket notation). */
export function paymentRequestToQueryString(payload: AuthNetPaymentRequest): string {
  const enc = encodeURIComponent;
  const walk = (value: unknown, path: string): string[] => {
    if (value === undefined || value === null) return [];
    if (Array.isArray(value)) {
      return value.flatMap((item, i) => walk(item, `${path}[${i}]`));
    }
    if (typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
        walk(v, path ? `${path}[${k}]` : k)
      );
    }
    return [`${enc(path)}=${enc(String(value))}`];
  };
  return walk(payload.transactionRequest, 'transactionRequest').join('&');
}
```

Example output (truncated):

```
transactionRequest[transactionType]=authCaptureTransaction&transactionRequest[amount]=20.00&transactionRequest[currencyCode]=USD&transactionRequest[customer][email]=demo%40example.com&transactionRequest[billTo][firstName]=Enrich&transactionRequest[billTo][zip]=11211&transactionRequest[lineItems][lineItem][0][itemId]=offering-simple&transactionRequest[order][invoiceNumber]=WnUsVKAVLIWiy1S65qFJ
```

---

## Authorize only (don't capture yet)

The payload defaults to `authCaptureTransaction` — funds are authorized **and
captured** in one step. To only place an authorization hold and capture later,
override `transactionType` before sending:

```ts
const intent = await client.cart.getPaymentIntent(sessionId);
const tr = intent.paymentRequest!.transactionRequest;

tr.transactionType = 'authOnlyTransaction'; // authorize only — no capture
```

| transactionType | Behavior |
| --- | --- |
| `authCaptureTransaction` (default) | Authorizes and captures immediately. Use when you fulfill at checkout. |
| `authOnlyTransaction` | Places a hold on the funds without capturing. Use when you want to confirm funds at checkout but capture at a later event (e.g. on fulfillment). |

With auth-only you must **capture later** with a `priorAuthCaptureTransaction`
referencing the original `transId` — a separate server-side step. The hold expires
if you never capture (typically within a few days, per your processor). Only switch
to auth-only if you have a capture step in place; otherwise the customer is never
charged.
