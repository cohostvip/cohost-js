# @cohostvip/ticketing-ui

React UI component library for Cohost ticketing applications. Provides themed, accessible components for building event ticketing experiences.

## Installation

```bash
npm install @cohostvip/ticketing-ui
# or
pnpm add @cohostvip/ticketing-ui
```

### Peer Dependencies

This package requires the following peer dependencies:

```json
{
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0",
  "@cohostvip/cohost-react": ">=0.0.1",
  "tailwindcss": "^3.4.0"
}
```

## Setup

### 1. Import CSS Variables

Import the CSS variables in your app's root layout or global CSS:

```tsx
// app/layout.tsx or similar
import '@cohostvip/ticketing-ui/styles'
```

### 2. Configure Tailwind

Add the ticketing-ui preset to your Tailwind config:

```js
// tailwind.config.js
import ticketingPreset from '@cohostvip/ticketing-ui/preset'

export default {
  presets: [ticketingPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@cohostvip/ticketing-ui/dist/**/*.js',
  ],
  // ... your config
}
```

## Components

### UI Primitives

| Component | Description |
|-----------|-------------|
| `Button` | Multi-variant button with loading state, icons |
| `Card` | Container with header/footer slots |
| `DisplayDate` | Formatted date display (inline/block modes) |
| `DisplayPrice` | Currency formatting with sale price support |
| `QuantitySelector` | Increment/decrement quantity control |

### Event Components

| Component | Description |
|-----------|-------------|
| `EventCard` | Event preview card with image, date, venue |
| `TicketCard` | Individual ticket type display |
| `TicketsList` | List of selectable tickets |

### Checkout Components

| Component | Description |
|-----------|-------------|
| `TicketSelector` | Ticket selection with SDK integration |
| `OrderSummary` | Cart summary with SDK integration |
| `CheckoutStepper` | Visual checkout progress indicator |
| `PromoCodeInput` | Promo code entry with validation states |

## Usage Examples

### Button

```tsx
import { Button } from '@cohostvip/ticketing-ui'

<Button variant="primary" size="md" onClick={handleClick}>
  Get Tickets
</Button>

<Button variant="secondary" loading>
  Processing...
</Button>

<Button variant="outline" iconLeft={<IconPlus />}>
  Add to Cart
</Button>
```

### EventCard

```tsx
import { EventCard } from '@cohostvip/ticketing-ui'

<EventCard
  name="Summer Music Festival"
  startDate="2026-07-15T19:00:00Z"
  imageUrl="/event-image.jpg"
  venueName="Central Park"
  summary="Annual outdoor concert featuring local artists"
  soldOut={false}
/>
```

### QuantitySelector

```tsx
import { QuantitySelector } from '@cohostvip/ticketing-ui'

const [quantity, setQuantity] = useState(0)

<QuantitySelector
  value={quantity}
  onIncrement={() => setQuantity(q => q + 1)}
  onDecrement={() => setQuantity(q => q - 1)}
  min={0}
  max={10}
/>
```

### DisplayPrice

```tsx
import { DisplayPrice } from '@cohostvip/ticketing-ui'

<DisplayPrice amount="USD,2500" />
// Renders: $25.00

<DisplayPrice amount="USD,2500" originalAmount="USD,3500" />
// Renders: $25.00 (with strikethrough $35.00)

<DisplayPrice amount="USD,0" />
// Renders: Free
```

## Theming

Components use CSS custom properties for theming. Override these in your CSS to customize:

```css
:root {
  /* Primary colors */
  --ticketing-primary: #6366f1;
  --ticketing-primary-hover: #4f46e5;
  --ticketing-accent: #8b5cf6;

  /* Background colors */
  --ticketing-background: #ffffff;
  --ticketing-surface: #f8fafc;
  --ticketing-surface-hover: #f1f5f9;

  /* Text colors */
  --ticketing-text: #1e293b;
  --ticketing-text-muted: #64748b;

  /* Border colors */
  --ticketing-border: #e2e8f0;

  /* Status colors */
  --ticketing-success: #22c55e;
  --ticketing-error: #ef4444;
  --ticketing-warning: #f59e0b;

  /* Typography */
  --ticketing-font-family: system-ui, sans-serif;

  /* Border radius */
  --ticketing-radius-sm: 0.25rem;
  --ticketing-radius-md: 0.5rem;
  --ticketing-radius-lg: 0.75rem;
}
```

### Dark Mode Example

```css
.dark {
  --ticketing-background: #0f172a;
  --ticketing-surface: #1e293b;
  --ticketing-surface-hover: #334155;
  --ticketing-text: #f8fafc;
  --ticketing-text-muted: #94a3b8;
  --ticketing-border: #334155;
}
```

## Storybook

Run Storybook to browse components and their variants:

```bash
cd packages/ticketing-ui
pnpm storybook
```

## SDK Integration

Some components integrate with `@cohostvip/cohost-react` hooks:

- `TicketSelector` uses `useCohostCheckout` for cart management
- `OrderSummary` displays cart state from SDK context

Ensure your app is wrapped with the Cohost SDK provider:

```tsx
import { CohostProvider } from '@cohostvip/cohost-react'

function App() {
  return (
    <CohostProvider config={{ apiKey: 'your-key' }}>
      <YourApp />
    </CohostProvider>
  )
}
```

## TypeScript

All components export their prop types:

```tsx
import type { ButtonProps, EventCardProps } from '@cohostvip/ticketing-ui'
```

## License

ISC
