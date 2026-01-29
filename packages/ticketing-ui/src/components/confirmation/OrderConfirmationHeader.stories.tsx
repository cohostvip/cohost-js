import type { Meta, StoryObj } from '@storybook/react'
import OrderConfirmationHeader from './OrderConfirmationHeader'

const meta: Meta<typeof OrderConfirmationHeader> = {
  component: OrderConfirmationHeader,
  title: 'Confirmation/OrderConfirmationHeader',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    orderNumber: 'ORD-12345',
  },
}

export const WithSubtitle: Story = {
  args: {
    orderNumber: 'ORD-12345',
    subtitle: 'A confirmation email has been sent to your inbox.',
  },
}

export const CustomTitle: Story = {
  args: {
    orderNumber: 'ORD-12345',
    title: 'Your tickets are confirmed!',
    subtitle: 'Check your email for your tickets.',
  },
}

export const CustomIcon: Story = {
  args: {
    orderNumber: 'ORD-12345',
    title: 'Order Complete',
    icon: (
      <svg
        className="w-16 h-16"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
        />
      </svg>
    ),
  },
}

export const InContext: Story = {
  render: () => (
    <div className="max-w-md mx-auto p-6 bg-ticketing-background rounded-lg">
      <OrderConfirmationHeader
        orderNumber="ORD-12345"
        subtitle="A confirmation email has been sent to john@example.com"
      />
    </div>
  ),
}
