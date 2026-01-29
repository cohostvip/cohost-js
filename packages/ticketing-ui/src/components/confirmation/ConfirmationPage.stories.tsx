import type { Meta, StoryObj } from '@storybook/react'
import OrderConfirmationHeader from './OrderConfirmationHeader'
import EventSummary from './EventSummary'
import TicketsSummary from './TicketsSummary'
import PaymentSummary from './PaymentSummary'
import CustomerSummary from './CustomerSummary'
import OrderTotalsSummary from './OrderTotalsSummary'
import ConfirmationLayout from './ConfirmationLayout'

const meta: Meta = {
  title: 'Confirmation/Full Page Example',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export const TwoColumnLayout: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-ticketing-background p-6">
      <ConfirmationLayout
        header={
          <OrderConfirmationHeader
            orderNumber="ORD-12345"
            subtitle="A confirmation email has been sent to john@example.com"
          />
        }
        leftColumn={
          <>
            <TicketsSummary
              tickets={[
                { name: 'General Admission', quantity: 2, totalPrice: 'USD,5000' },
                { name: 'VIP Experience', quantity: 1, totalPrice: 'USD,7500' },
              ]}
            />
            <CustomerSummary
              name="John Smith"
              email="john@example.com"
              phone="+1 (555) 123-4567"
            />
            <PaymentSummary paymentMethod="Visa ending in 4242" />
          </>
        }
        rightColumn={
          <>
            <EventSummary
              name="Summer Music Festival 2026"
              date="Saturday, March 15, 2026"
              time="7:00 PM"
              venue="Madison Square Garden"
              address="New York, NY"
            />
            <OrderTotalsSummary
              subtotal="USD,12500"
              fees="USD,250"
              tax="USD,1275"
              total="USD,14025"
            />
          </>
        }
      />
    </div>
  ),
}

export const TwoColumnWithDiscount: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-ticketing-background p-6">
      <ConfirmationLayout
        header={
          <OrderConfirmationHeader
            orderNumber="ORD-67890"
            subtitle="Thank you for your purchase!"
          />
        }
        leftColumn={
          <>
            <TicketsSummary
              tickets={[
                { name: 'Early Bird Special', quantity: 4, totalPrice: 'USD,8000' },
              ]}
            />
            <CustomerSummary
              name="Jane Doe"
              email="jane@example.com"
            />
            <PaymentSummary paymentMethod="Mastercard ending in 8888" />
          </>
        }
        rightColumn={
          <>
            <EventSummary
              name="Tech Conference 2026"
              date="Friday, April 10, 2026"
              time="9:00 AM"
              venue="Convention Center"
              address="San Francisco, CA"
            />
            <OrderTotalsSummary
              subtotal="USD,8000"
              discount="USD,1600"
              fees="USD,160"
              tax="USD,656"
              total="USD,7216"
            />
          </>
        }
      />
    </div>
  ),
}

export const RedactedTwoColumn: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-ticketing-background p-6">
      <ConfirmationLayout
        header={
          <OrderConfirmationHeader
            orderNumber="ORD-12345"
            title="Order Details"
          />
        }
        leftColumn={
          <>
            <TicketsSummary
              tickets={[
                { name: 'General Admission', quantity: 2, totalPrice: 'USD,5000' },
              ]}
            />
            <CustomerSummary redacted />
            <PaymentSummary redacted />
          </>
        }
        rightColumn={
          <>
            <EventSummary
              name="Summer Music Festival 2026"
              date="Saturday, March 15, 2026"
              time="7:00 PM"
              venue="Madison Square Garden"
              address="New York, NY"
            />
            <OrderTotalsSummary total="USD,5510" redacted />
          </>
        }
      />
    </div>
  ),
}

export const FreeEventTwoColumn: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-ticketing-background p-6">
      <ConfirmationLayout
        header={
          <OrderConfirmationHeader
            orderNumber="ORD-FREE-001"
            subtitle="Your free tickets are confirmed!"
          />
        }
        leftColumn={
          <>
            <TicketsSummary
              tickets={[
                { name: 'Free Admission', quantity: 2, totalPrice: 'USD,0' },
              ]}
            />
            <CustomerSummary
              name="Community Member"
              email="member@example.com"
            />
          </>
        }
        rightColumn={
          <>
            <EventSummary
              name="Community Art Exhibition"
              date="Sunday, April 5, 2026"
              time="2:00 PM"
              venue="City Art Gallery"
              address="Downtown, NY"
            />
            <OrderTotalsSummary total="USD,0" />
          </>
        }
      />
    </div>
  ),
}

// Single column layout for comparison
export const SingleColumnLayout: StoryObj = {
  render: () => (
    <div className="max-w-lg mx-auto p-6 space-y-6 bg-ticketing-background min-h-screen">
      <OrderConfirmationHeader
        orderNumber="ORD-12345"
        subtitle="A confirmation email has been sent to john@example.com"
      />

      <EventSummary
        name="Summer Music Festival 2026"
        date="Saturday, March 15, 2026"
        time="7:00 PM"
        venue="Madison Square Garden"
        address="New York, NY"
      />

      <TicketsSummary
        tickets={[
          { name: 'General Admission', quantity: 2, totalPrice: 'USD,5000' },
          { name: 'VIP Experience', quantity: 1, totalPrice: 'USD,7500' },
        ]}
      />

      <CustomerSummary
        name="John Smith"
        email="john@example.com"
        phone="+1 (555) 123-4567"
      />

      <PaymentSummary paymentMethod="Visa ending in 4242" />

      <OrderTotalsSummary
        subtotal="USD,12500"
        fees="USD,250"
        tax="USD,1275"
        total="USD,14025"
      />
    </div>
  ),
}
