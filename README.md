# @cohostvip/cohost-node

> Official Node.js SDK for the Cohost API

[![npm version](https://img.shields.io/npm/v/@cohostvip/cohost-node.svg)](https://www.npmjs.com/package/@cohostvip/cohost-node)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

---

## ✨ Features

- 🎯 **TypeScript-first** - Full type safety and IntelliSense support
- 🔐 **Token authentication** - Secure API access with bearer tokens
- 📦 **Dual module support** - Works with ESM and CommonJS
- 🚀 **Promise-based** - Modern async/await API
- 🔄 **Auto-unwrapping** - Automatically extracts data from API responses
- 🛡️ **Error handling** - Custom error types with status codes
- 📊 **Pagination** - Built-in support for paginated endpoints

---

## 📦 Installation

```bash
npm install @cohostvip/cohost-node
# or
pnpm add @cohostvip/cohost-node
# or
yarn add @cohostvip/cohost-node
```

---

## 🚀 Quick Start

```typescript
import { createCohostClient } from '@cohostvip/cohost-node';

const client = createCohostClient({
  token: 'your-api-token',
  settings: { debug: false } // optional
});

// Fetch events
const events = await client.events.list();
const event = await client.events.fetch('evt_123');

// Create an event
const newEvent = await client.events.create({
  name: 'Summer Concert',
  startDate: '2025-07-15T19:00:00Z',
  venue: { name: 'City Arena' }
});

// Create tickets
await client.events.createTickets(newEvent.id, [
  { name: 'General Admission', price: 50, quantity: 100 },
  { name: 'VIP', price: 150, quantity: 20 }
]);
```

---

## 📚 API Reference

### Events API

```typescript
// List all events
const events = await client.events.list();

// Get single event
const event = await client.events.fetch('evt_123');

// Search events (with pagination)
const results = await client.events.search({
  page: 1,
  size: 20
});

// Create event
const newEvent = await client.events.create({
  name: 'My Event',
  startDate: '2025-12-01T18:00:00Z'
});

// Update event
await client.events.update('evt_123', {
  name: 'Updated Event Name'
});

// Get event tickets
const tickets = await client.events.tickets('evt_123');

// Create tickets
const result = await client.events.createTickets('evt_123', {
  name: 'General Admission',
  price: 50,
  currency: 'USD',
  quantity: 100
});

// Update ticket
await client.events.updateTicket('evt_123', 'tkt_456', {
  price: 55
});

// Delete ticket
await client.events.deleteTicket('evt_123', 'tkt_456');

// Get attendees (requires authentication)
const attendees = await client.events.attendees('evt_123', {
  page: 1,
  size: 50
});
```

### Orders API

```typescript
// List orders with filters
const orders = await client.orders.list({
  status: 'completed',
  startDate: '2025-01-01',
  endDate: '2025-12-31'
});

// Get order details
const order = await client.orders.fetch('ord_123', 'user_456');

// Get order attendees
const attendees = await client.orders.attendees('ord_123', 'user_456');

// Send order confirmation email
await client.orders.sendConfirmation('ord_123');
```

### Cart/Checkout API

```typescript
// Start cart session
const session = await client.cart.start({
  contextId: 'evt_123'
});

// Get cart session
const cart = await client.cart.get(session.id);

// Update session (customer info)
await client.cart.update(session.id, {
  customer: {
    email: 'customer@example.com',
    name: 'John Doe'
  }
});

// Add/update cart items
await client.cart.updateItem(session.id, {
  offeringId: 'tkt_456',
  quantity: 2
});

// Apply coupon
await client.cart.applyCoupon(session.id, 'SUMMER20');

// Remove coupon
await client.cart.deleteCoupon(session.id, 'cpn_789');

// Pre-validate payment
const validation = await client.cart.preValidate(session.id);

// Process payment
await client.cart.processPayment(session.id, {
  paymentMethod: 'card',
  // payment details...
});

// Place order
const result = await client.cart.placeOrder(session.id);

// Cancel session
await client.cart.cancel(session.id);
```

### Coupons API

```typescript
// List all coupons
const coupons = await client.coupons.list();

// List coupons for specific event
const eventCoupons = await client.coupons.list({
  eventId: 'evt_123'
});

// Create coupon
const coupon = await client.coupons.create({
  code: 'SUMMER2025',
  discountType: 'percentage',
  discountValue: 20,
  maxUses: 100,
  expiresAt: '2025-08-31T23:59:59Z'
});

// Update coupon
await client.coupons.update('cpn_789', {
  discountValue: 25,
  maxUses: 150
});

// Delete coupon
await client.coupons.delete('cpn_789');
```

---

## 🔧 Configuration

### Client Options

```typescript
import { createCohostClient } from '@cohostvip/cohost-node';

const client = createCohostClient({
  token: 'your-api-token',
  settings: {
    debug: true,                          // Enable debug logging
    apiUrl: 'https://api.cohost.vip/v1'  // Custom API URL (optional)
  }
});
```

### Runtime Overrides

Override token, baseUrl, or headers for specific requests:

```typescript
const adminClient = client.requestWithOverrides({
  token: 'admin-token',
  headers: {
    'X-Custom-Header': 'value'
  }
});

const event = await adminClient.events.fetch('evt_123');
```

---

## 🛡️ Error Handling

```typescript
import { CohostError } from '@cohostvip/cohost-node';

try {
  const event = await client.events.fetch('invalid-id');
} catch (error) {
  if (error instanceof CohostError) {
    console.error('Error code:', error.errorCode);
    console.error('Status code:', error.statusCode);
    console.error('Message:', error.message);
  }
}
```

---

## 📊 TypeScript Support

Full TypeScript definitions included:

```typescript
import {
  createCohostClient,
  CohostClient,
  EventProfile,
  Ticket,
  Coupon,
  PaginatedResponse
} from '@cohostvip/cohost-node';

const client: CohostClient = createCohostClient({
  token: 'your-token'
});

const events: EventProfile[] = await client.events.list();
const tickets: Ticket[] = await client.events.tickets('evt_123');
```

---

## 🛠 Environment Requirements

- **Node.js**: 18 or later
- **API Token**: Active Cohost API authentication token

---

## 🚧 Roadmap

See our [ROADMAP.md](./ROADMAP.md) for planned features and improvements.

**Coming Soon:**
- Workflows API integration
- Webhook validation helpers
- Enhanced retry logic and rate limiting

---

## 📖 Documentation

- [API Reference](https://docs.cohost.vip)
- [Changelog](./CHANGELOG.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

---

## 📄 License

ISC © [Cohost](https://cohost.vip)

---

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/@cohostvip/cohost-node)
- [GitHub Repository](https://github.com/cohostvip/cohost-node)
- [API Documentation](https://docs.cohost.vip)
- [Cohost Website](https://cohost.vip)
