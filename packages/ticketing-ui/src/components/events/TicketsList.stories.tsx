import type { Meta, StoryObj } from '@storybook/react'
import TicketsList from './TicketsList'
import type { TicketItem, TicketGroup, TicketQuantities } from './TicketsList'

const meta: Meta<typeof TicketsList> = {
  component: TicketsList,
  title: 'Events/TicketsList',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

const sampleTickets: TicketItem[] = [
  {
    id: '1',
    name: 'General Admission',
    price: 'USD,2500',
    status: 'available',
    description: '<p>Standard entry to the event. Access to all general areas.</p>',
  },
  {
    id: '2',
    name: 'VIP Pass',
    price: 'USD,7500',
    status: 'available',
    includesFees: true,
    maxQuantity: 4,
    description: `
      <p><strong>Includes:</strong></p>
      <ul>
        <li>Reserved VIP seating</li>
        <li>Complimentary drinks</li>
        <li>Meet & greet access</li>
        <li>Exclusive merchandise</li>
        <li>Early entry to venue</li>
      </ul>
      <p>This is a premium experience that includes all the perks you could want for an unforgettable night.</p>
    `,
  },
  {
    id: '3',
    name: 'Early Bird Special',
    price: 'USD,1999',
    status: 'limited',
    maxQuantity: 2,
    description: '<p>Limited time offer - save 20% on general admission!</p>',
  },
  {
    id: '4',
    name: 'Student Discount',
    price: 'USD,1500',
    status: 'available',
    description: '<p>Valid student ID required at entry.</p>',
  },
]

const mixedAvailabilityTickets: TicketItem[] = [
  {
    id: '1',
    name: 'General Admission',
    price: 'USD,3000',
    status: 'available',
  },
  {
    id: '2',
    name: 'VIP Package',
    price: 'USD,10000',
    status: 'sold-out',
    description: '<p>Sold out! Check back for future events.</p>',
  },
  {
    id: '3',
    name: 'Last Minute Deal',
    price: 'USD,2500',
    status: 'limited',
    maxQuantity: 3,
  },
]

const singleTicket: TicketItem[] = [
  {
    id: '1',
    name: 'General Admission',
    price: 'USD,5000',
    status: 'available',
    includesFees: true,
  },
]

const freeTickets: TicketItem[] = [
  {
    id: '1',
    name: 'Community Pass',
    price: 'USD,0',
    status: 'available',
    description: '<p>Free for community members. Registration required.</p>',
  },
  {
    id: '2',
    name: 'Student Pass',
    price: 'USD,0',
    status: 'available',
    description: '<p>Free for students with valid ID.</p>',
  },
]

const groupedTickets: TicketItem[] = [
  { id: '1', name: 'GA Floor', price: 'USD,5000', status: 'available', groupId: 'ga' },
  { id: '2', name: 'GA Balcony', price: 'USD,4000', status: 'available', groupId: 'ga' },
  { id: '3', name: 'VIP Floor', price: 'USD,15000', status: 'available', groupId: 'vip', includesFees: true },
  { id: '4', name: 'VIP Suite', price: 'USD,25000', status: 'limited', groupId: 'vip', maxQuantity: 2 },
  { id: '5', name: 'Backstage Pass', price: 'USD,50000', status: 'sold-out', groupId: 'premium' },
]

const ticketGroups: TicketGroup[] = [
  { id: 'ga', name: 'General Admission', description: 'Standard access to the venue', sorting: 1 },
  { id: 'vip', name: 'VIP Experience', description: 'Premium seating with complimentary drinks', sorting: 2 },
  { id: 'premium', name: 'Exclusive Access', sorting: 3 },
]

const handleGetTickets = (quantities: TicketQuantities) => {
  const selected = Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => `${id}: ${qty}`)
    .join(', ')
  alert(`Selected tickets: ${selected || 'None'}`)
}

export const Default: Story = {
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
  },
}

export const WithTitle: Story = {
  args: {
    tickets: sampleTickets,
    title: 'Select Your Tickets',
  },
}

export const WithTicketGroups: Story = {
  args: {
    tickets: groupedTickets,
    ticketGroups: ticketGroups,
  },
}

export const AllSoldOut: Story = {
  args: {
    tickets: [
      {
        id: '1',
        name: 'General Admission',
        price: 'USD,3000',
        status: 'sold-out',
      },
      {
        id: '2',
        name: 'VIP Pass',
        price: 'USD,8000',
        status: 'sold-out',
      },
    ],
  },
}

export const LongDescriptions: Story = {
  args: {
    tickets: [
      {
        id: '1',
        name: 'Premium Experience',
        price: 'USD,15000',
        status: 'available',
        description: `
          <p>The Premium Experience includes everything you need for an unforgettable night. You'll enjoy priority entry,
          access to our exclusive lounge with complimentary cocktails and hors d'oeuvres, the best seats in the house,
          a meet and greet opportunity with the performers, and a commemorative gift bag to take home.</p>
          <p>This package is perfect for those who want to make the most of their event experience and create lasting memories.</p>
        `,
      },
      {
        id: '2',
        name: 'Standard Entry',
        price: 'USD,3500',
        status: 'available',
        description: '<p>Basic entry with access to general admission areas.</p>',
      },
    ],
  },
}

export const WithButton: Story = {
  args: {
    tickets: sampleTickets,
    onGetTickets: handleGetTickets,
  },
}

export const WithTitleAndButton: Story = {
  args: {
    tickets: sampleTickets,
    title: 'Tickets',
    onGetTickets: handleGetTickets,
  },
}
