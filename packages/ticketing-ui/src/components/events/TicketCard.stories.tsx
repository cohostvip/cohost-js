import type { Meta, StoryObj } from '@storybook/react'
import TicketCard from './TicketCard'

const meta: Meta<typeof TicketCard> = {
  component: TicketCard,
  title: 'Events/TicketCard',
  tags: ['autodocs'],
  argTypes: {
    onSelect: { action: 'selected' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Available: Story = {
  args: {
    name: 'General Admission',
    price: 2500,
    status: 'available',
  },
}

export const SoldOut: Story = {
  args: {
    name: 'VIP Pass',
    price: 15000,
    status: 'sold-out',
    description: '<p>Access to exclusive VIP lounge, complimentary drinks, and meet & greet.</p>',
  },
}

export const LimitedAvailability: Story = {
  args: {
    name: 'Early Bird Special',
    price: 1999,
    status: 'limited',
    quantityAvailable: 5,
    description: '<p>Limited time offer - save 20% on regular admission!</p>',
  },
}

export const WithDescription: Story = {
  args: {
    name: 'Premium Seating',
    price: 7500,
    status: 'available',
    description: `
      <p><strong>Includes:</strong></p>
      <ul>
        <li>Reserved seating in premium section</li>
        <li>Complimentary coat check</li>
        <li>Access to premium bar</li>
        <li>Event program and commemorative gift</li>
      </ul>
    `,
  },
}

export const FreeTicket: Story = {
  args: {
    name: 'Community Pass',
    price: 0,
    status: 'available',
    description: '<p>Free admission for community members. Registration required.</p>',
  },
}

export const WithFees: Story = {
  args: {
    name: 'Standard Entry',
    price: 3500,
    includesFees: true,
    status: 'available',
  },
}

export const Selectable: Story = {
  args: {
    name: 'Regular Ticket',
    price: 4500,
    status: 'available',
    onSelect: () => alert('Ticket selected!'),
  },
}

export const DifferentCurrency: Story = {
  args: {
    name: 'International Ticket',
    price: 5000,
    currency: 'EUR',
    status: 'available',
  },
}

export const LongDescription: Story = {
  args: {
    name: 'Platinum Experience',
    price: 25000,
    status: 'available',
    description: `
      <h4>The Ultimate VIP Experience</h4>
      <p>Treat yourself to an unforgettable evening with our most exclusive package.</p>

      <p><strong>Package Includes:</strong></p>
      <ul>
        <li>Premium reserved seating in the first three rows</li>
        <li>Pre-show champagne reception with appetizers</li>
        <li>Exclusive meet & greet with performers</li>
        <li>Professional photo opportunity</li>
        <li>Signed memorabilia</li>
        <li>Complimentary valet parking</li>
        <li>Access to VIP lounge with premium bar</li>
        <li>Commemorative gift bag</li>
      </ul>

      <p><em>Note: Limited availability. Must be 21+ to attend VIP reception.</em></p>
    `,
  },
}

export const AllStatuses: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <TicketCard name="Available" price={2500} status="available" />
      <TicketCard
        name="Limited"
        price={3000}
        status="limited"
        quantityAvailable={3}
      />
      <TicketCard name="Sold Out" price={3500} status="sold-out" />
    </div>
  ),
}

export const PriceRange: Story = {
  render: () => (
    <div className="grid gap-4">
      <TicketCard name="Free Admission" price={0} status="available" />
      <TicketCard name="Budget Pass" price={999} status="available" />
      <TicketCard name="Standard Ticket" price={5000} status="available" />
      <TicketCard name="Premium Pass" price={15000} status="available" />
      <TicketCard
        name="Luxury Experience"
        price={50000}
        includesFees={true}
        status="available"
      />
    </div>
  ),
}
