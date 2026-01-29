import type { Meta, StoryObj } from '@storybook/react'
import OrderSummary from './OrderSummary'
import type { OrderSummaryItem, OrderSummaryCosts } from './OrderSummary'

const meta: Meta<typeof OrderSummary> = {
  component: OrderSummary,
  title: 'Checkout/OrderSummary',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

const sampleItems: OrderSummaryItem[] = [
  { id: '1', name: 'General Admission', quantity: 2, totalPrice: 'USD,5000' },
  { id: '2', name: 'VIP Experience', quantity: 1, totalPrice: 'USD,7500' },
]

const sampleCosts: OrderSummaryCosts = {
  subtotal: 'USD,12500',
  fee: 'USD,250',
  tax: 'USD,1275',
  total: 'USD,14025',
}

export const Default: Story = {
  args: {
    items: sampleItems,
    costs: sampleCosts,
  },
}

export const WithDiscount: Story = {
  args: {
    items: sampleItems,
    costs: {
      subtotal: 'USD,12500',
      discount: 'USD,2500',
      fee: 'USD,250',
      tax: 'USD,1025',
      total: 'USD,11275',
    },
    coupons: ['SAVE20'],
  },
}

export const WithContinueButton: Story = {
  args: {
    items: sampleItems,
    costs: sampleCosts,
    showContinueButton: true,
    onContinue: () => console.log('Continue clicked'),
  },
}

export const ContinueDisabled: Story = {
  args: {
    items: sampleItems,
    costs: sampleCosts,
    showContinueButton: true,
    onContinue: () => console.log('Continue clicked'),
    continueDisabled: true,
  },
}

export const CustomContinueLabel: Story = {
  args: {
    items: sampleItems,
    costs: sampleCosts,
    showContinueButton: true,
    onContinue: () => console.log('Continue clicked'),
    continueLabel: 'Proceed to Payment',
  },
}

export const EmptyCart: Story = {
  args: {
    items: [{ id: '1', name: 'Ticket', quantity: 0, totalPrice: 'USD,0' }],
    costs: {
      subtotal: 'USD,0',
      total: 'USD,0',
    },
  },
}

export const FreeOrder: Story = {
  args: {
    items: [
      { id: '1', name: 'Free Community Event', quantity: 2, totalPrice: 'USD,0' },
    ],
    costs: {
      subtotal: 'USD,0',
      total: 'USD,0',
    },
  },
}

export const LargeOrder: Story = {
  args: {
    items: [
      { id: '1', name: 'General Admission', quantity: 5, totalPrice: 'USD,12500' },
      { id: '2', name: 'VIP Experience', quantity: 3, totalPrice: 'USD,22500' },
      { id: '3', name: 'Student Discount', quantity: 2, totalPrice: 'USD,3000' },
    ],
    costs: {
      subtotal: 'USD,38000',
      fee: 'USD,760',
      tax: 'USD,3876',
      total: 'USD,42636',
    },
  },
}

export const NoFees: Story = {
  args: {
    items: sampleItems,
    costs: {
      subtotal: 'USD,12500',
      total: 'USD,12500',
    },
  },
}
