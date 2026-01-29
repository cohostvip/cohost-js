import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import TicketSelector from './TicketSelector'
import type { TicketSelectorItem } from './TicketSelector'

const meta: Meta<typeof TicketSelector> = {
  component: TicketSelector,
  title: 'Checkout/TicketSelector',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Interactive wrapper for stateful stories
const InteractiveTicketSelector = ({
  initialItems,
}: {
  initialItems: TicketSelectorItem[]
}) => {
  const [items, setItems] = useState(initialItems)

  const handleIncrement = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item
        if (item.maxQuantity !== undefined && item.quantity >= item.maxQuantity) return item
        const newQuantity = item.quantity + 1
        const priceValue = parseInt(item.price.split(',')[1] || '0')
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: `${item.price.split(',')[0]},${priceValue * newQuantity}`,
        }
      })
    )
  }

  const handleDecrement = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId || item.quantity <= 0) return item
        const newQuantity = item.quantity - 1
        const priceValue = parseInt(item.price.split(',')[1] || '0')
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: newQuantity > 0 ? `${item.price.split(',')[0]},${priceValue * newQuantity}` : undefined,
        }
      })
    )
  }

  return (
    <TicketSelector
      items={items}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
    />
  )
}

const defaultItems: TicketSelectorItem[] = [
  {
    id: '1',
    name: 'General Admission',
    description: '<p>Access to the main event area with standard seating.</p>',
    price: 'USD,2500',
    quantity: 0,
    maxQuantity: 10,
  },
  {
    id: '2',
    name: 'VIP Experience',
    description:
      '<p>Premium seating, backstage access, and complimentary refreshments.</p><p>Includes meet and greet opportunity.</p>',
    price: 'USD,7500',
    quantity: 0,
    maxQuantity: 4,
  },
  {
    id: '3',
    name: 'Student Discount',
    description: '<p>Discounted ticket for students with valid ID.</p>',
    price: 'USD,1500',
    quantity: 0,
    maxQuantity: 10,
  },
]

export const Default: Story = {
  render: () => <InteractiveTicketSelector initialItems={defaultItems} />,
}

export const WithQuantityLimits: Story = {
  render: () => (
    <InteractiveTicketSelector
      initialItems={[
        {
          id: '1',
          name: 'Limited Edition Ticket',
          description: '<p>Only 2 tickets available per order.</p>',
          price: 'USD,5000',
          quantity: 0,
          maxQuantity: 2,
        },
      ]}
    />
  ),
}

export const WithSoldOutTickets: Story = {
  render: () => (
    <InteractiveTicketSelector
      initialItems={[
        {
          id: '1',
          name: 'Available Ticket',
          price: 'USD,2500',
          quantity: 0,
        },
        {
          id: '2',
          name: 'Sold Out Ticket',
          price: 'USD,5000',
          quantity: 0,
          soldOut: true,
        },
      ]}
    />
  ),
}

export const SingleTicketType: Story = {
  render: () => (
    <InteractiveTicketSelector
      initialItems={[
        {
          id: '1',
          name: 'Event Ticket',
          description: '<p>Standard admission to the event.</p>',
          price: 'USD,3000',
          quantity: 0,
        },
      ]}
    />
  ),
}

export const FreeTickets: Story = {
  render: () => (
    <InteractiveTicketSelector
      initialItems={[
        {
          id: '1',
          name: 'Free Community Event',
          description: '<p>Free admission for community members.</p>',
          price: 'USD,0',
          quantity: 0,
        },
      ]}
    />
  ),
}

export const EmptyState: Story = {
  args: {
    items: [],
    onIncrement: () => {},
    onDecrement: () => {},
  },
}

export const WithPreselectedQuantities: Story = {
  render: () => (
    <InteractiveTicketSelector
      initialItems={[
        {
          id: '1',
          name: 'General Admission',
          price: 'USD,2500',
          quantity: 2,
          totalPrice: 'USD,5000',
        },
        {
          id: '2',
          name: 'VIP Experience',
          price: 'USD,7500',
          quantity: 1,
          totalPrice: 'USD,7500',
        },
      ]}
    />
  ),
}
