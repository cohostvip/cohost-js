import type { Meta, StoryObj } from '@storybook/react'
import InfoPanel, { CalendarIcon, ClockIcon, MapPinIcon } from './InfoPanel'

const meta: Meta<typeof InfoPanel> = {
  component: InfoPanel,
  title: 'Events/InfoPanel',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const DateInfo: Story = {
  args: {
    icon: <CalendarIcon />,
    children: 'Saturday, March 15, 2026',
    subtitle: 'Doors open at 6:30 PM',
  },
}

export const TimeInfo: Story = {
  args: {
    icon: <ClockIcon />,
    children: '7:00 PM - 11:00 PM',
    subtitle: 'Eastern Time (ET)',
  },
}

export const LocationInfo: Story = {
  args: {
    icon: <MapPinIcon />,
    children: 'Madison Square Garden',
    subtitle: '4 Pennsylvania Plaza, New York, NY 10001',
  },
}

export const WithoutSubtitle: Story = {
  args: {
    icon: <CalendarIcon />,
    children: 'March 15, 2026 at 7:00 PM',
  },
}

export const CustomIcon: Story = {
  args: {
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    children: 'John Smith',
    subtitle: 'Event Organizer',
  },
}

export const EventProfileExample: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <InfoPanel
        icon={<CalendarIcon />}
        subtitle="Saturday"
      >
        March 15, 2026
      </InfoPanel>
      <InfoPanel
        icon={<ClockIcon />}
        subtitle="Eastern Time"
      >
        7:00 PM - 11:00 PM
      </InfoPanel>
      <InfoPanel
        icon={<MapPinIcon />}
        subtitle="4 Pennsylvania Plaza, New York, NY 10001"
      >
        Madison Square Garden
      </InfoPanel>
    </div>
  ),
}

export const InCard: Story = {
  render: () => (
    <div className="bg-ticketing-surface border border-ticketing-border rounded-lg p-4 w-80">
      <h3 className="font-semibold text-ticketing-text mb-4">Event Details</h3>
      <div className="space-y-4">
        <InfoPanel
          icon={<CalendarIcon />}
          subtitle="Doors open at 6:30 PM"
        >
          Saturday, March 15, 2026
        </InfoPanel>
        <InfoPanel
          icon={<MapPinIcon />}
          subtitle="New York, NY"
        >
          Madison Square Garden
        </InfoPanel>
      </div>
    </div>
  ),
}
