import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import TicketRow from './TicketRow'
import QuantitySelector from '../ui/QuantitySelector'

const meta: Meta<typeof TicketRow> = {
  component: TicketRow,
  title: 'Events/TicketRow',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'General Admission',
    price: 'USD,2500',
  },
}

export const WithDescription: Story = {
  args: {
    name: 'General Admission',
    price: 'USD,2500',
    description: 'Access to the main event area with standard seating.',
  },
}

export const SoldOut: Story = {
  args: {
    name: 'VIP Experience',
    price: 'USD,7500',
    soldOut: true,
  },
}

export const FreeTicket: Story = {
  args: {
    name: 'Free Community Event',
    price: 'USD,0',
  },
}

export const WithQuantitySelector: Story = {
  render: () => {
    const [quantity, setQuantity] = useState(0)
    return (
      <div className="w-80">
        <TicketRow
          name="General Admission"
          price="USD,2500"
          description="Access to the main event area"
          rightContent={
            <QuantitySelector
              value={quantity}
              onIncrement={() => setQuantity((q) => q + 1)}
              onDecrement={() => setQuantity((q) => Math.max(0, q - 1))}
              max={10}
            />
          }
        />
      </div>
    )
  },
}

export const TicketListExample: Story = {
  render: () => {
    const [quantities, setQuantities] = useState<Record<string, number>>({
      ga: 0,
      vip: 0,
      student: 0,
    })

    const tickets = [
      { id: 'ga', name: 'General Admission', price: 'USD,2500' },
      { id: 'vip', name: 'VIP Experience', price: 'USD,7500', soldOut: true },
      { id: 'student', name: 'Student Discount', price: 'USD,1500' },
    ]

    return (
      <div className="w-80 divide-y divide-ticketing-border">
        {tickets.map((ticket) => (
          <TicketRow
            key={ticket.id}
            name={ticket.name}
            price={ticket.price}
            soldOut={ticket.soldOut}
            rightContent={
              !ticket.soldOut && (
                <QuantitySelector
                  value={quantities[ticket.id]}
                  onIncrement={() =>
                    setQuantities((q) => ({ ...q, [ticket.id]: q[ticket.id] + 1 }))
                  }
                  onDecrement={() =>
                    setQuantities((q) => ({
                      ...q,
                      [ticket.id]: Math.max(0, q[ticket.id] - 1),
                    }))
                  }
                  max={10}
                />
              )
            }
          />
        ))}
      </div>
    )
  },
}

export const Clickable: Story = {
  args: {
    name: 'General Admission',
    price: 'USD,2500',
    description: 'Click to see details',
    onClick: () => alert('Ticket clicked!'),
  },
}
