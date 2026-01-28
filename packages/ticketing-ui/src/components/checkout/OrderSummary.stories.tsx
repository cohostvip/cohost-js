import type { Meta, StoryObj } from '@storybook/react'
import OrderSummary from './OrderSummary'
import type { CartSession, CartSessionItem } from '@cohostvip/cohost-node'

const meta: Meta<typeof OrderSummary> = {
  component: OrderSummary,
  title: 'Checkout/OrderSummary',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Mock Cohost SDK provider
const MockCohostCheckoutProvider = ({
  children,
  cartSession,
}: {
  children: React.ReactNode
  cartSession: Partial<CartSession>
}) => {
  const mockContext = {
    cartSession,
    applyCoupon: async (code: string) => {
      console.log('Applying coupon:', code)
      if (code !== 'VALID') {
        throw new Error('Invalid promo code')
      }
    },
  }

  // Mock the useCohostCheckout hook
  const OriginalCohostCheckout = require('@cohostvip/cohost-react')
  OriginalCohostCheckout.useCohostCheckout = () => mockContext

  return <>{children}</>
}

const itemsWithQuantity: Partial<CartSessionItem>[] = [
  {
    id: '1',
    quantity: 2,
    offering: {
      id: 'ga-ticket',
      name: 'General Admission',
      costs: { gross: 'USD,2500' },
    },
    costs: { total: 'USD,5000' },
  },
  {
    id: '2',
    quantity: 1,
    offering: {
      id: 'vip-ticket',
      name: 'VIP Experience',
      costs: { gross: 'USD,7500' },
    },
    costs: { total: 'USD,7500' },
  },
]

export const WithItems: Story = {
  render: () => (
    <MockCohostCheckoutProvider
      cartSession={{
        items: itemsWithQuantity,
        costs: {
          subtotal: 'USD,12500',
          fee: 'USD,250',
          tax: 'USD,1275',
          total: 'USD,14025',
        },
        coupons: [],
      } as any}
    >
      <OrderSummary />
    </MockCohostCheckoutProvider>
  ),
}

export const WithDiscountApplied: Story = {
  render: () => (
    <MockCohostCheckoutProvider
      cartSession={{
        items: itemsWithQuantity,
        costs: {
          subtotal: 'USD,12500',
          discount: 'USD,2500',
          fee: 'USD,250',
          tax: 'USD,1025',
          total: 'USD,11275',
        },
        coupons: [{ code: 'SAVE20', id: 'coupon-1' }],
      } as any}
    >
      <OrderSummary />
    </MockCohostCheckoutProvider>
  ),
}

export const WithFees: Story = {
  render: () => (
    <MockCohostCheckoutProvider
      cartSession={{
        items: itemsWithQuantity,
        costs: {
          subtotal: 'USD,12500',
          fee: 'USD,500',
          tax: 'USD,1300',
          total: 'USD,14300',
        },
        coupons: [],
      } as any}
    >
      <OrderSummary />
    </MockCohostCheckoutProvider>
  ),
}

export const EmptyCart: Story = {
  render: () => (
    <MockCohostCheckoutProvider
      cartSession={{
        items: [
          {
            id: '1',
            quantity: 0,
            offering: {
              id: 'ticket',
              name: 'Ticket',
              costs: { gross: 'USD,2500' },
            },
            costs: { total: 'USD,0' },
          },
        ],
        costs: {
          subtotal: 'USD,0',
          fee: 'USD,0',
          tax: 'USD,0',
          total: 'USD,0',
        },
        coupons: [],
      } as any}
    >
      <OrderSummary />
    </MockCohostCheckoutProvider>
  ),
}

export const FreeOrder: Story = {
  render: () => (
    <MockCohostCheckoutProvider
      cartSession={{
        items: [
          {
            id: '1',
            quantity: 2,
            offering: {
              id: 'free-ticket',
              name: 'Free Event Ticket',
              costs: { gross: 'USD,0' },
            },
            costs: { total: 'USD,0' },
          },
        ],
        costs: {
          subtotal: 'USD,0',
          fee: 'USD,0',
          tax: 'USD,0',
          total: 'USD,0',
        },
        coupons: [],
      } as any}
    >
      <OrderSummary />
    </MockCohostCheckoutProvider>
  ),
}

export const WithContinueButton: Story = {
  render: () => (
    <MockCohostCheckoutProvider
      cartSession={{
        items: itemsWithQuantity,
        costs: {
          subtotal: 'USD,12500',
          fee: 'USD,250',
          tax: 'USD,1275',
          total: 'USD,14025',
        },
        coupons: [],
      } as any}
    >
      <OrderSummary
        showContinueButton
        onContinue={() => console.log('Continue clicked')}
      />
    </MockCohostCheckoutProvider>
  ),
}

export const WithContinueButtonDisabled: Story = {
  render: () => (
    <MockCohostCheckoutProvider
      cartSession={{
        items: itemsWithQuantity,
        costs: {
          subtotal: 'USD,12500',
          fee: 'USD,250',
          tax: 'USD,1275',
          total: 'USD,14025',
        },
        coupons: [],
      } as any}
    >
      <OrderSummary
        showContinueButton
        onContinue={() => console.log('Continue clicked')}
        continueDisabled
      />
    </MockCohostCheckoutProvider>
  ),
}

export const LargeOrder: Story = {
  render: () => (
    <MockCohostCheckoutProvider
      cartSession={{
        items: [
          {
            id: '1',
            quantity: 5,
            offering: {
              id: 'ticket-1',
              name: 'General Admission',
              costs: { gross: 'USD,2500' },
            },
            costs: { total: 'USD,12500' },
          },
          {
            id: '2',
            quantity: 3,
            offering: {
              id: 'ticket-2',
              name: 'VIP Experience',
              costs: { gross: 'USD,7500' },
            },
            costs: { total: 'USD,22500' },
          },
          {
            id: '3',
            quantity: 2,
            offering: {
              id: 'ticket-3',
              name: 'Student Discount',
              costs: { gross: 'USD,1500' },
            },
            costs: { total: 'USD,3000' },
          },
        ],
        costs: {
          subtotal: 'USD,38000',
          fee: 'USD,760',
          tax: 'USD,3876',
          total: 'USD,42636',
        },
        coupons: [],
      } as any}
    >
      <OrderSummary />
    </MockCohostCheckoutProvider>
  ),
}
