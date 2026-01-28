import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import TicketSelector from './TicketSelector'
import type { CartSession, CartSessionItem } from '@cohostvip/cohost-node'

const meta: Meta<typeof TicketSelector> = {
  component: TicketSelector,
  title: 'Checkout/TicketSelector',
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
  const [mockCartSession, setMockCartSession] = useState(cartSession)

  const incrementItem = (itemId: string) => {
    setMockCartSession((prev: any) => ({
      ...prev,
      items: prev.items.map((item: CartSessionItem) =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity + 1,
              costs: {
                ...item.costs,
                total: `${item.offering.costs?.gross?.split(',')[0]},${
                  (parseInt(item.offering.costs?.gross?.split(',')[1] || '0') *
                    (item.quantity + 1)) ||
                  0
                }`,
              },
            }
          : item
      ),
    }))
  }

  const decrementItem = (itemId: string) => {
    setMockCartSession((prev: any) => ({
      ...prev,
      items: prev.items.map((item: CartSessionItem) =>
        item.id === itemId && item.quantity > 0
          ? {
              ...item,
              quantity: item.quantity - 1,
              costs: {
                ...item.costs,
                total: `${item.offering.costs?.gross?.split(',')[0]},${
                  (parseInt(item.offering.costs?.gross?.split(',')[1] || '0') *
                    (item.quantity - 1)) ||
                  0
                }`,
              },
            }
          : item
      ),
    }))
  }

  // Mock the useCohostCheckout hook
  const mockContext = {
    cartSession: mockCartSession,
    incrementItem,
    decrementItem,
  }

  // Override the module for mocking
  const OriginalCohostCheckout = require('@cohostvip/cohost-react')
  OriginalCohostCheckout.useCohostCheckout = () => mockContext

  return <>{children}</>
}

const defaultItems: Partial<CartSessionItem>[] = [
  {
    id: '1',
    quantity: 0,
    offering: {
      id: 'ga-ticket',
      name: 'General Admission',
      description: '<p>Access to the main event area with standard seating.</p>',
      costs: { gross: 'USD,2500' },
      sorting: 1,
      maximumQuantity: 10,
    },
    costs: { total: 'USD,0' },
  },
  {
    id: '2',
    quantity: 0,
    offering: {
      id: 'vip-ticket',
      name: 'VIP Experience',
      description:
        '<p>Premium seating, backstage access, and complimentary refreshments.</p><p>Includes meet and greet opportunity.</p>',
      costs: { gross: 'USD,7500' },
      sorting: 2,
      maximumQuantity: 4,
    },
    costs: { total: 'USD,0' },
  },
  {
    id: '3',
    quantity: 0,
    offering: {
      id: 'student-ticket',
      name: 'Student Discount',
      description: '<p>Discounted ticket for students with valid ID.</p>',
      costs: { gross: 'USD,1500' },
      sorting: 3,
      maximumQuantity: 10,
    },
    costs: { total: 'USD,0' },
  },
]

export const Default: Story = {
  render: () => (
    <MockCohostCheckoutProvider
      cartSession={{ items: defaultItems } as any}
    >
      <TicketSelector />
    </MockCohostCheckoutProvider>
  ),
}

export const WithQuantityLimits: Story = {
  render: () => (
    <MockCohostCheckoutProvider
      cartSession={{
        items: [
          {
            id: '1',
            quantity: 0,
            offering: {
              id: 'limited-ticket',
              name: 'Limited Edition Ticket',
              description: '<p>Only 2 tickets available per order.</p>',
              costs: { gross: 'USD,5000' },
              sorting: 1,
              maximumQuantity: 2,
            },
            costs: { total: 'USD,0' },
          },
        ],
      } as any}
    >
      <TicketSelector />
    </MockCohostCheckoutProvider>
  ),
}

export const WithSoldOutTickets: Story = {
  render: () => (
    <MockCohostCheckoutProvider
      cartSession={{
        items: [
          {
            id: '1',
            quantity: 0,
            offering: {
              id: 'available-ticket',
              name: 'Available Ticket',
              costs: { gross: 'USD,2500' },
              sorting: 1,
            },
            costs: { total: 'USD,0' },
          },
          {
            id: '2',
            quantity: 0,
            offering: {
              id: 'sold-out-ticket',
              name: 'Sold Out Ticket',
              costs: { gross: 'USD,5000' },
              sorting: 2,
              maximumQuantity: 0,
            },
            costs: { total: 'USD,0' },
          },
        ],
      } as any}
    >
      <TicketSelector />
    </MockCohostCheckoutProvider>
  ),
}

export const SingleTicketType: Story = {
  render: () => (
    <MockCohostCheckoutProvider
      cartSession={{
        items: [
          {
            id: '1',
            quantity: 0,
            offering: {
              id: 'single-ticket',
              name: 'Event Ticket',
              description: '<p>Standard admission to the event.</p>',
              costs: { gross: 'USD,3000' },
              sorting: 1,
            },
            costs: { total: 'USD,0' },
          },
        ],
      } as any}
    >
      <TicketSelector />
    </MockCohostCheckoutProvider>
  ),
}

export const FreeTickets: Story = {
  render: () => (
    <MockCohostCheckoutProvider
      cartSession={{
        items: [
          {
            id: '1',
            quantity: 0,
            offering: {
              id: 'free-ticket',
              name: 'Free Community Event',
              description: '<p>Free admission for community members.</p>',
              costs: { gross: 'USD,0' },
              sorting: 1,
            },
            costs: { total: 'USD,0' },
          },
        ],
      } as any}
    >
      <TicketSelector />
    </MockCohostCheckoutProvider>
  ),
}

export const EmptyState: Story = {
  render: () => (
    <MockCohostCheckoutProvider cartSession={{ items: [] } as any}>
      <TicketSelector />
    </MockCohostCheckoutProvider>
  ),
}
