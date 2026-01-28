import type { Meta, StoryObj } from '@storybook/react'
import Button from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'UI/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled variant="primary">
        Primary Disabled
      </Button>
      <Button disabled variant="secondary">
        Secondary Disabled
      </Button>
      <Button disabled variant="outline">
        Outline Disabled
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button loading variant="primary">
        Loading...
      </Button>
      <Button loading variant="secondary">
        Loading...
      </Button>
      <Button loading variant="outline">
        Loading...
      </Button>
    </div>
  ),
}

export const WithIconLeft: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button
        iconLeft={
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        }
      >
        Add Item
      </Button>
      <Button
        variant="secondary"
        iconLeft={
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        }
      >
        Back
      </Button>
    </div>
  ),
}

export const WithIconRight: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button
        iconRight={
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        }
      >
        Next
      </Button>
      <Button
        variant="outline"
        iconRight={
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        }
      >
        Open External
      </Button>
    </div>
  ),
}

export const FullWidth: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Button fullWidth>Full Width Primary</Button>
      <Button fullWidth variant="secondary">
        Full Width Secondary
      </Button>
      <Button fullWidth variant="outline">
        Full Width Outline
      </Button>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    children: 'Interactive Button',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
}
