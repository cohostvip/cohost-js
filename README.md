# Cohost JS SDK

Official JavaScript/TypeScript SDK for the Cohost platform.

## Packages

| Package | Description |
|---------|-------------|
| [@cohostvip/cohost-node](./packages/node) | Node.js SDK for server-side integration |
| [@cohostvip/cohost-react](./packages/react) | React components and hooks |
| [@cohostvip/payment-element](./packages/payment-element) | Framework-agnostic payment / checkout embedder (vanilla; powers the React `<CohostPaymentFrame>`) |
| [@cohostvip/cohost-types](./packages/types) | TypeScript type definitions |

## Installation

```bash
# Node.js SDK
npm install @cohost/node

# React SDK
npm install @cohost/react

# Types only
npm install @cohost/types
```

## Development

This is a pnpm monorepo. To get started:

```bash
pnpm install
pnpm build
```

## License

MIT
