import type { Meta, StoryObj } from '@storybook/react'
import Card from './Card'

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'UI/Card',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    clickable: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <p>This is a default card with some content.</p>,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card variant="default">
        <h3 className="font-semibold mb-2">Default Card</h3>
        <p className="text-sm text-ticketing-text-muted">
          Standard card with border and background
        </p>
      </Card>

      <Card variant="elevated">
        <h3 className="font-semibold mb-2">Elevated Card</h3>
        <p className="text-sm text-ticketing-text-muted">
          Card with shadow elevation effect
        </p>
      </Card>

      <Card variant="outlined">
        <h3 className="font-semibold mb-2">Outlined Card</h3>
        <p className="text-sm text-ticketing-text-muted">
          Card with prominent border outline
        </p>
      </Card>
    </div>
  ),
}

export const WithHeader: Story = {
  render: () => (
    <Card
      header={
        <div>
          <h2 className="text-xl font-bold">Card Header</h2>
          <p className="text-sm text-ticketing-text-muted">Optional subtitle</p>
        </div>
      }
    >
      <p>This card has a header section separated by a border.</p>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card
      footer={
        <div className="flex justify-between items-center">
          <span className="text-sm text-ticketing-text-muted">Card footer</span>
          <button className="text-ticketing-primary text-sm font-medium">
            Action
          </button>
        </div>
      }
    >
      <p>This card has a footer section separated by a border.</p>
    </Card>
  ),
}

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Card
      header={<h3 className="text-lg font-semibold">Event Details</h3>}
      footer={
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 text-sm rounded-lg border border-ticketing-border hover:bg-ticketing-surface">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm rounded-lg bg-ticketing-primary text-white hover:bg-ticketing-primary-hover">
            Confirm
          </button>
        </div>
      }
    >
      <div className="space-y-2">
        <p>
          <strong>Date:</strong> January 28, 2026
        </p>
        <p>
          <strong>Time:</strong> 7:00 PM - 10:00 PM
        </p>
        <p>
          <strong>Location:</strong> Main Hall
        </p>
      </div>
    </Card>
  ),
}

export const DifferentPadding: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card padding="none">
        <h3 className="font-semibold mb-2">No Padding</h3>
        <p className="text-sm text-ticketing-text-muted">
          Card content touches the edges
        </p>
      </Card>

      <Card padding="sm">
        <h3 className="font-semibold mb-2">Small Padding</h3>
        <p className="text-sm text-ticketing-text-muted">Compact spacing</p>
      </Card>

      <Card padding="md">
        <h3 className="font-semibold mb-2">Medium Padding</h3>
        <p className="text-sm text-ticketing-text-muted">
          Default comfortable spacing
        </p>
      </Card>

      <Card padding="lg">
        <h3 className="font-semibold mb-2">Large Padding</h3>
        <p className="text-sm text-ticketing-text-muted">Generous spacing</p>
      </Card>
    </div>
  ),
}

export const Clickable: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card clickable onClick={() => alert('Card clicked!')}>
        <h3 className="font-semibold mb-2">Clickable Card</h3>
        <p className="text-sm text-ticketing-text-muted">
          Hover over me to see the effect. Click to trigger action.
        </p>
      </Card>

      <Card clickable variant="elevated" onClick={() => alert('Card clicked!')}>
        <h3 className="font-semibold mb-2">Elevated Clickable</h3>
        <p className="text-sm text-ticketing-text-muted">
          Combines elevation with click interaction
        </p>
      </Card>
    </div>
  ),
}

export const NestedCards: Story = {
  render: () => (
    <Card padding="lg">
      <h2 className="text-xl font-bold mb-4">Parent Card</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="outlined" padding="sm">
          <h3 className="font-semibold mb-1">Nested Card 1</h3>
          <p className="text-sm text-ticketing-text-muted">
            Cards can be nested inside other cards
          </p>
        </Card>
        <Card variant="outlined" padding="sm">
          <h3 className="font-semibold mb-1">Nested Card 2</h3>
          <p className="text-sm text-ticketing-text-muted">
            Useful for complex layouts
          </p>
        </Card>
      </div>
    </Card>
  ),
}

export const Playground: Story = {
  args: {
    variant: 'default',
    padding: 'md',
    clickable: false,
    children: (
      <div>
        <h3 className="font-semibold mb-2">Interactive Card</h3>
        <p className="text-sm text-ticketing-text-muted">
          Use the controls to customize this card
        </p>
      </div>
    ),
  },
}
