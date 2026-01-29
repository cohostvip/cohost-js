import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import Radio from './Radio'

const meta: Meta<typeof Radio> = {
  component: Radio,
  title: 'UI/Radio',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Option A',
    name: 'default-radio',
  },
}

export const Checked: Story = {
  args: {
    label: 'Option A',
    name: 'checked-radio',
    defaultChecked: true,
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Credit Card',
    name: 'payment',
    helperText: 'Pay with Visa, Mastercard, or Amex',
  },
}

export const WithError: Story = {
  args: {
    label: 'Option A',
    name: 'error-radio',
    error: 'Please select an option',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled option',
    name: 'disabled-radio',
    disabled: true,
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Radio size="sm" label="Small radio" name="sizes" value="sm" />
      <Radio size="md" label="Medium radio" name="sizes" value="md" />
      <Radio size="lg" label="Large radio" name="sizes" value="lg" />
    </div>
  ),
}

export const RadioGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState('card')
    const options = [
      { value: 'card', label: 'Credit Card', helper: 'Visa, Mastercard, Amex' },
      { value: 'paypal', label: 'PayPal', helper: 'Pay with your PayPal account' },
      { value: 'apple', label: 'Apple Pay', helper: 'Quick checkout with Apple Pay' },
    ]

    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-ticketing-text">Payment method</p>
        {options.map((option) => (
          <Radio
            key={option.value}
            name="payment-method"
            value={option.value}
            label={option.label}
            helperText={option.helper}
            checked={selected === option.value}
            onChange={(e) => setSelected(e.target.value)}
          />
        ))}
      </div>
    )
  },
}

export const TicketSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState('ga')
    const tickets = [
      { value: 'ga', label: 'General Admission', price: '$25' },
      { value: 'vip', label: 'VIP Experience', price: '$75' },
      { value: 'student', label: 'Student Discount', price: '$15' },
    ]

    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-ticketing-text">Select ticket type</p>
        {tickets.map((ticket) => (
          <div
            key={ticket.value}
            className={`p-4 rounded-lg border ${
              selected === ticket.value
                ? 'border-ticketing-primary bg-ticketing-primary/5'
                : 'border-ticketing-border'
            }`}
          >
            <Radio
              name="ticket-type"
              value={ticket.value}
              label={
                <span className="flex justify-between w-full">
                  <span>{ticket.label}</span>
                  <span className="text-ticketing-accent font-semibold">{ticket.price}</span>
                </span>
              }
              checked={selected === ticket.value}
              onChange={(e) => setSelected(e.target.value)}
            />
          </div>
        ))}
      </div>
    )
  },
}
