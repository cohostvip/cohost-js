import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import QuantitySelector, { QuantitySelectorProps } from './QuantitySelector'

const meta: Meta<typeof QuantitySelector> = {
  title: 'UI/QuantitySelector',
  component: QuantitySelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0 },
      description: 'Current quantity value',
    },
    min: {
      control: { type: 'number' },
      description: 'Minimum allowed value',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum allowed value',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all interactions',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Interactive wrapper for stateful stories
const InteractiveQuantitySelector = (props: Partial<QuantitySelectorProps> & { value: number }) => {
  const [value, setValue] = useState(props.value)
  return (
    <QuantitySelector
      value={value}
      min={props.min ?? 0}
      max={props.max}
      disabled={props.disabled}
      size={props.size}
      onIncrement={() => setValue((v) => (props.max !== undefined ? Math.min(v + 1, props.max) : v + 1))}
      onDecrement={() => setValue((v) => Math.max(v - 1, props.min ?? 0))}
    />
  )
}

export const Default: Story = {
  render: () => <InteractiveQuantitySelector value={0} min={0} />,
}

export const WithValue: Story = {
  render: () => <InteractiveQuantitySelector value={3} min={0} />,
}

export const WithMinMax: Story = {
  render: () => <InteractiveQuantitySelector value={2} min={1} max={5} />,
}

export const AtMinimum: Story = {
  render: () => <InteractiveQuantitySelector value={0} min={0} max={10} />,
}

export const AtMaximum: Story = {
  render: () => <InteractiveQuantitySelector value={10} min={0} max={10} />,
}

export const Disabled: Story = {
  args: {
    value: 2,
    disabled: true,
    onIncrement: () => {},
    onDecrement: () => {},
  },
}

export const SizeSmall: Story = {
  render: () => <InteractiveQuantitySelector value={1} size="sm" />,
}

export const SizeMedium: Story = {
  render: () => <InteractiveQuantitySelector value={1} size="md" />,
}

export const SizeLarge: Story = {
  render: () => <InteractiveQuantitySelector value={1} size="lg" />,
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex items-center gap-4">
        <span className="w-16 text-ticketing-text-muted text-sm">Small:</span>
        <InteractiveQuantitySelector value={1} size="sm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-ticketing-text-muted text-sm">Medium:</span>
        <InteractiveQuantitySelector value={2} size="md" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-ticketing-text-muted text-sm">Large:</span>
        <InteractiveQuantitySelector value={3} size="lg" />
      </div>
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="bg-ticketing-surface p-4 rounded-lg border border-ticketing-border">
      <div className="flex items-center justify-between gap-8">
        <div>
          <h4 className="font-medium text-ticketing-text">General Admission</h4>
          <p className="text-sm text-ticketing-accent">$25.00</p>
        </div>
        <InteractiveQuantitySelector value={0} />
      </div>
    </div>
  ),
}

export const TicketListExample: Story = {
  render: () => {
    const tickets = [
      { name: 'General Admission', price: '$25.00' },
      { name: 'VIP Pass', price: '$75.00' },
      { name: 'Student Discount', price: '$15.00' },
    ]

    return (
      <div className="bg-ticketing-surface rounded-lg border border-ticketing-border w-80">
        <div className="border-b border-ticketing-border px-4 py-3">
          <h3 className="font-bold text-ticketing-text">Tickets</h3>
        </div>
        <div className="divide-y divide-ticketing-border">
          {tickets.map((ticket, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div>
                <h4 className="font-medium text-ticketing-text">{ticket.name}</h4>
                <p className="text-sm text-ticketing-accent">{ticket.price}</p>
              </div>
              <InteractiveQuantitySelector value={0} max={10} />
            </div>
          ))}
        </div>
      </div>
    )
  },
}
