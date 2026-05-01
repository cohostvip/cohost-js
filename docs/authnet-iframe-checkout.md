# Place Order — Auth.Net iframe (React)

How to place a Cohost order from React after the Authorize.Net Accept
Hosted iframe returns a successful transaction.

Requires `@cohostvip/cohost-react@^0.3.19`, inside a
`<CohostCheckoutProvider>`.

---

## Quick use

```tsx
import { useCohostCheckout } from '@cohostvip/cohost-react';

const { submitAuthnetIframeTransaction } = useCohostCheckout();

// In your iframe success callback:
const result = await submitAuthnetIframeTransaction(iframeResponse);
// result: { result: 'ok', redirUri, id, uid, accessToken? }

router.push(result.redirUri);
```

`iframeResponse` is the verbatim payload from the Auth.Net Accept Hosted
iframe success callback (`AuthorizeNetIFrame.onReceiveCommunication` →
`JSON.parse(params.response)`):

```json
{
  "resultCode": "Ok",
  "messageCode": "Ok",
  "transactionData": {
    "accountType": "AmericanExpress",
    "accountNumber": "XXXX4004",
    "transId": "121598068514",
    "responseCode": "1",
    "authorization": "211311",
    "totalAmount": "1.00",
    "orderInvoiceNumber": "MJ3misxv7zyiXQ6UaXY1",
    "dateTime": "4/29/2026 8:20:05 PM"
  }
}
```

The provider extracts `transactionData.transId`, builds the place-order
body, and submits. The full payload is forwarded to the server and stored
on `cart.meta.transaction.raw.iframeResponse` for forensics — never
trusted as source of truth. The server independently verifies the
transaction with Authorize.Net before creating the order.

---

## Lower-level — `placeOrder(input?)`

If you've already got the `transId` and want to construct the body
yourself:

```tsx
const { placeOrder } = useCohostCheckout();

const result = await placeOrder({
  transaction: {
    provider: 'authnet',
    transId: '121598068514',
    iframeResponse, // optional but recommended
  },
});
```

Free or fully-prepaid cart? Just `await placeOrder()` with no arguments.

---

## Error handling

`submitAuthnetIframeTransaction` and `placeOrder` throw on verification
failure (HTTP 422 from the server). The cart stays open — show a message
and let the user retry.

```tsx
try {
  const result = await submitAuthnetIframeTransaction(iframeResponse);
  router.push(result.redirUri);
} catch (err: any) {
  // err.message and err.details.gatewayError describe what went wrong.
  setError(err.message);
}
```

| Server message | Meaning |
| --- | --- |
| `Auth.Net rejected the transaction lookup: Transaction not found` | The `transId` doesn't exist under your merchant. Re-issue the iframe. |
| `Transaction is not in an approved state` | Declined / errored at Authorize.Net. User retries with a different card. |
| `Transaction is under review and cannot complete the order yet` | FDS hold. Show "review in progress"; retryable once Auth.Net resolves it. |
| `Transaction amount does not match cart total` | Stale iframe URL — re-issue with a fresh hosted-payment-page request. |
| `Cart already has a transaction with a different transId` | Reload the cart. |

Submitting the **same** `transId` twice is safe — you'll get back the same
order.
