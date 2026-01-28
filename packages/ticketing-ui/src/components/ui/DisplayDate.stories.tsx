import type { Meta, StoryObj } from '@storybook/react'
import DisplayDate from './DisplayDate'

const meta: Meta<typeof DisplayDate> = {
  component: DisplayDate,
  title: 'UI/DisplayDate',
  tags: ['autodocs'],
  argTypes: {
    format: {
      control: 'select',
      options: ['full', 'short', 'time', 'relative'],
    },
    mode: {
      control: 'select',
      options: ['inline', 'block'],
    },
    showTime: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Sample dates for stories
const futureDate = new Date('2026-06-15T19:00:00Z')
const pastDate = new Date('2025-12-25T18:30:00Z')
const today = new Date()
const endDate = new Date('2026-06-15T22:00:00Z')

export const Default: Story = {
  args: {
    date: futureDate,
  },
}

export const FullFormat: Story = {
  render: () => (
    <div className="space-y-2">
      <DisplayDate date={futureDate} format="full" showTime={true} />
      <DisplayDate date={futureDate} format="full" showTime={false} />
    </div>
  ),
}

export const ShortFormat: Story = {
  render: () => (
    <div className="space-y-2">
      <DisplayDate date={futureDate} format="short" />
      <DisplayDate date={pastDate} format="short" />
    </div>
  ),
}

export const TimeOnly: Story = {
  render: () => (
    <div className="space-y-2">
      <DisplayDate date={futureDate} format="time" />
      <DisplayDate date={pastDate} format="time" />
    </div>
  ),
}

export const RelativeFormat: Story = {
  render: () => (
    <div className="space-y-2">
      <div>
        <span className="font-semibold">Today: </span>
        <DisplayDate date={today} format="relative" />
      </div>
      <div>
        <span className="font-semibold">Future date: </span>
        <DisplayDate date={futureDate} format="relative" />
      </div>
      <div>
        <span className="font-semibold">Past date: </span>
        <DisplayDate date={pastDate} format="relative" />
      </div>
    </div>
  ),
}

export const WithTime: Story = {
  render: () => (
    <div className="space-y-2">
      <div>
        <span className="font-semibold">With time: </span>
        <DisplayDate date={futureDate} showTime={true} />
      </div>
      <div>
        <span className="font-semibold">Without time: </span>
        <DisplayDate date={futureDate} showTime={false} />
      </div>
    </div>
  ),
}

export const WithTimeRange: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="font-semibold mb-2">Inline with time range:</p>
        <DisplayDate date={futureDate} endDate={endDate} mode="inline" />
      </div>
      <div>
        <p className="font-semibold mb-2">Block with time range:</p>
        <DisplayDate date={futureDate} endDate={endDate} mode="block" />
      </div>
    </div>
  ),
}

export const PastDate: Story = {
  render: () => (
    <div className="space-y-2">
      <DisplayDate date={pastDate} />
    </div>
  ),
}

export const FutureDate: Story = {
  render: () => (
    <div className="space-y-2">
      <DisplayDate date={futureDate} />
    </div>
  ),
}

export const Today: Story = {
  render: () => (
    <div className="space-y-2">
      <DisplayDate date={today} />
    </div>
  ),
}

export const BlockDisplay: Story = {
  render: () => (
    <div className="space-y-4">
      <DisplayDate date={futureDate} mode="block" />
      <DisplayDate date={pastDate} mode="block" />
      <DisplayDate date={today} mode="block" />
    </div>
  ),
}

export const BlockDisplayNoTime: Story = {
  render: () => (
    <div className="space-y-4">
      <DisplayDate date={futureDate} mode="block" showTime={false} />
      <DisplayDate date={pastDate} mode="block" showTime={false} />
    </div>
  ),
}

export const WithTimezone: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="font-semibold mb-2">UTC (Default):</p>
        <DisplayDate date={futureDate} />
      </div>
      <div>
        <p className="font-semibold mb-2">America/New_York:</p>
        <DisplayDate date={futureDate} timezone="America/New_York" />
      </div>
      <div>
        <p className="font-semibold mb-2">Europe/London:</p>
        <DisplayDate date={futureDate} timezone="Europe/London" />
      </div>
      <div>
        <p className="font-semibold mb-2">Asia/Tokyo:</p>
        <DisplayDate date={futureDate} timezone="Asia/Tokyo" />
      </div>
    </div>
  ),
}

export const AllModes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="font-semibold mb-2">Inline Mode:</p>
        <DisplayDate date={futureDate} mode="inline" />
      </div>
      <div>
        <p className="font-semibold mb-2">Block Mode:</p>
        <DisplayDate date={futureDate} mode="block" />
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    date: futureDate,
    format: 'full',
    mode: 'inline',
    showTime: true,
  },
}
