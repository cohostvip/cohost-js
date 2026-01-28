import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import TicketsList, { TicketItem } from './TicketsList'

const meta: Meta<typeof TicketsList> = {
  component: TicketsList,
  title: 'Events/TicketsList',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const sampleTickets: TicketItem[] = [
  {
    id: '1',
    name: 'General Admission',
    price: 2500,
    status: 'available',
    description: '<p>Standard entry to the event. Access to all general areas.</p>',
  },
  {
    id: '2',
    name: 'VIP Pass',
    price: 7500,
    status: 'available',
    includesFees: true,
    description: `
      <p><strong>Includes:</strong></p>
      <ul>
        <li>Reserved VIP seating</li>
        <li>Complimentary drinks</li>
        <li>Meet & greet access</li>
      </ul>
    `,
  },
  {
    id: '3',
    name: 'Early Bird Special',
    price: 1999,
    status: 'limited',
    quantityAvailable: 8,
    description: '<p>Limited time offer - save 20% on general admission!</p>',
  },
  {
    id: '4',
    name: 'Student Discount',
    price: 1500,
    status: 'available',
    description: '<p>Valid student ID required at entry.</p>',
  },
]

const mixedAvailabilityTickets: TicketItem[] = [
  {
    id: '1',
    name: 'General Admission',
    price: 3000,
    status: 'available',
  },
  {
    id: '2',
    name: 'VIP Package',
    price: 10000,
    status: 'sold-out',
    description: '<p>Sold out! Check back for future events.</p>',
  },
  {
    id: '3',
    name: 'Last Minute Deal',
    price: 2500,
    status: 'limited',
    quantityAvailable: 3,
  },
]

const singleTicket: TicketItem[] = [
  {
    id: '1',
    name: 'General Admission',
    price: 5000,
    status: 'available',
    includesFees: true,
  },
]

const freeTickets: TicketItem[] = [
  {
    id: '1',
    name: 'Community Pass',
    price: 0,
    status: 'available',
    description: '<p>Free for community members. Registration required.</p>',
  },
  {
    id: '2',
    name: 'Student Pass',
    price: 0,
    status: 'available',
    description: '<p>Free for students with valid ID.</p>',
  },
]

export const MultipleTickets: Story = {
  args: {
    tickets: sampleTickets,
  },
}

export const SingleTicket: Story = {
  args: {
    tickets: singleTicket,
  },
}

export const EmptyState: Story = {
  args: {
    tickets: [],
    showEmptyState: true,
  },
}

export const CustomEmptyMessage: Story = {
  args: {
    tickets: [],
    showEmptyState: true,
    emptyMessage: 'Tickets will be available soon. Check back later!',
  },
}

export const MixedAvailability: Story = {
  args: {
    tickets: mixedAvailabilityTickets,
  },
}

export const FreeTickets: Story = {
  args: {
    tickets: freeTickets,
    title: 'Free Community Tickets',
  },
}

export const WithCustomTitle: Story = {
  args: {
    tickets: sampleTickets,
    title: 'Select Your Tickets',
  },
}

export const WithoutTitle: Story = {
  args: {
    tickets: sampleTickets,
    title: '',
  },
}

export const WithSelection: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<string>()

    return (
      <div>
        <TicketsList
          tickets={sampleTickets}
          onSelectTicket={(ticket) => setSelectedId(ticket.id)}
          selectedTicketId={selectedId}
        />
        {selectedId && (
          <div className="mt-4 p-4 bg-ticketing-surface rounded-ticketing-md border border-ticketing-border">
            <p className="text-ticketing-text">
              Selected: {sampleTickets.find((t) => t.id === selectedId)?.name}
            </p>
            <button
              onClick={() => setSelectedId(undefined)}
              className="mt-2 text-sm text-ticketing-accent hover:underline"
            >
              Clear selection
            </button>
          </div>
        )}
      </div>
    )
  },
}

export const LargeList: Story = {
  args: {
    tickets: [
      {
        id: '1',
        name: 'General Admission',
        price: 2500,
        status: 'available',
      },
      {
        id: '2',
        name: 'VIP Pass',
        price: 7500,
        status: 'available',
        includesFees: true,
      },
      {
        id: '3',
        name: 'Early Bird',
        price: 1999,
        status: 'limited',
        quantityAvailable: 5,
      },
      {
        id: '4',
        name: 'Student Ticket',
        price: 1500,
        status: 'available',
      },
      {
        id: '5',
        name: 'Premium Seating',
        price: 10000,
        status: 'available',
      },
      {
        id: '6',
        name: 'Group Package (4 tickets)',
        price: 8000,
        status: 'available',
      },
      {
        id: '7',
        name: 'Backstage Pass',
        price: 15000,
        status: 'sold-out',
      },
      {
        id: '8',
        name: 'Last Minute Deal',
        price: 2000,
        status: 'limited',
        quantityAvailable: 2,
      },
    ],
  },
}

export const AllSoldOut: Story = {
  args: {
    tickets: [
      {
        id: '1',
        name: 'General Admission',
        price: 3000,
        status: 'sold-out',
      },
      {
        id: '2',
        name: 'VIP Pass',
        price: 8000,
        status: 'sold-out',
      },
    ],
  },
}
