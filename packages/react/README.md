# @cohostvip/cohost-react

React bindings for the [Cohost API](https://cohost.vip), built on top of [`@cohostvip/cohost-node`](https://www.npmjs.com/package/@cohostvip/cohost-node).

Use this package to easily connect your React or Next.js app to Cohost's event and order APIs using a provider/hook pattern.

---

## 📦 Installation

```bash
pnpm add @cohostvip/cohost-react
```

Or with npm:

```bash
npm install @cohostvip/cohost-react
```

---

## 🚀 Usage

Wrap your app (or part of it) in the `CohostProvider` and use the `useCohost()` hook to access the API client.

### Example

```tsx
// app.tsx or layout.tsx
import { CohostProvider } from '@cohostvip/cohost-react';

export function App() {
  return (
    <CohostProvider token="your-api-token">
      <MyComponent />
    </CohostProvider>
  );
}
```

```tsx
// inside your component
import { useCohost } from '@cohostvip/cohost-react';

function MyComponent() {
  const cohost = useCohost();

  useEffect(() => {
    cohost.events.list().then(console.log);
  }, []);

  return <div>Loaded events</div>;
}
```

---

## 🔐 Auth

Pass your API `token` to the `CohostProvider`. This token is required for all authenticated requests.  
You can optionally pass:

- `baseUrl` — override the default API URL (e.g. for staging)
- `debug` — enable console debugging of API requests

---

## 📘 API Reference

This wrapper gives you access to the full Cohost API as defined in [`@cohostvip/cohost-node`](https://www.npmjs.com/package/@cohostvip/cohost-node).  
See its documentation for available methods like:

- `client.events.list()`
- `client.orders.fetch(orderId, userId)`
- etc.

---

## 🛒 Checkout — `CohostCheckoutProvider`

Wrap a checkout page in `CohostCheckoutProvider` and use `useCohostCheckout()`
to drive cart updates, payment, and order placement.

```tsx
import { CohostCheckoutProvider, useCohostCheckout } from '@cohostvip/cohost-react';

export function CheckoutPage({ cartSessionId }: { cartSessionId: string }) {
  return (
    <CohostCheckoutProvider cartSessionId={cartSessionId}>
      <CheckoutForm />
    </CohostCheckoutProvider>
  );
}
```

There are three ways to take a card payment:

- **Payment Frame** _(recommended)_ — embed `<CohostPaymentFrame>` and render your own Pay button; the card
  field is hosted by Cohost in an iframe (smallest PCI surface). See the **[Payment Frame guide](./docs/payment-frame.md)**.
- **Payment Element** — render the card fields in your own UI and tokenize with `usePaymentElement()`.
  See the **[Payment Element guide](./docs/payment-element.md)**.
- **Auth.Net Accept Hosted iframe (low-level)** — wire Authorize.Net's hosted iframe yourself (below).
  `<CohostPaymentFrame>` supersedes this.

### Auth.Net Accept Hosted iframe

For the iframe payment flow, hand the iframe's success callback **directly**
to the provider — no need to call `processPayment` separately. The provider
extracts the `transId`, builds the place-order body, and submits. The server
then independently validates the transaction with Authorize.Net before
creating the order.

```tsx
import { useCohostCheckout, type AuthNetIframeResponse } from '@cohostvip/cohost-react';

function PayWithIframe() {
  const { submitAuthnetIframeTransaction } = useCohostCheckout();
  const router = useRouter();

  React.useEffect(() => {
    // Authorize.Net Accept Hosted iframe communicates back via this global.
    (window as any).AuthorizeNetIFrame = {
      onReceiveCommunication: async (queryStr: string) => {
        const params = Object.fromEntries(new URLSearchParams(queryStr));

        if (params.action === 'transactResponse' && params.response) {
          const iframeResponse: AuthNetIframeResponse = JSON.parse(params.response);

          try {
            const result = await submitAuthnetIframeTransaction(iframeResponse);
            if (result?.redirUri) router.push(result.redirUri);
          } catch (err) {
            // Verification failed (transaction not found, amount mismatch,
            // FDS pending, etc.). Cart stays open — show an error and retry.
            console.error('Order placement failed:', err);
          }
        }
      },
    };
  }, [submitAuthnetIframeTransaction, router]);

  return <iframe src={hostedPaymentPageUrl} />;
}
```

**What the provider does for you:**
- Reads `iframeResponse.transactionData.transId`.
- POSTs to `/cart/sessions/:id/place-order` with
  `{ transaction: { provider: 'authnet', transId, iframeResponse } }`.
- The full iframe payload is forwarded to the server and stored on
  `cart.meta.transaction.raw.iframeResponse` for forensics — but **never**
  trusted as the source of truth. The server fetches the transaction from
  Authorize.Net to verify status, amount, and currency.

### Lower-level: `placeOrder(input?)`

You can also call `placeOrder` directly if you need to pass the body
yourself (e.g. you already have a `transId` from another flow):

```tsx
const { placeOrder } = useCohostCheckout();

const result = await placeOrder({
  transaction: {
    provider: 'authnet',
    transId: '121598068514',
  },
});
```

For free or fully-prepaid carts, `placeOrder()` with no arguments still
works as before.

---

## ✅ Requirements

- React 18 or 19
- Next.js 14 or 15

---

## 🗒️ Changelog
See the latest changes [here](./CHANGELOG.md).

---

## 🚧 Roadmap
Planned features and improvements are tracked [here](./ROADMAP.md).

---

## 🛠️ Support

If you're building something custom or need help integrating, reach out at [cohost.vip](https://cohost.vip) or open an issue.

