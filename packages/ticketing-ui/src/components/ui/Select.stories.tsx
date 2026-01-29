import type { Meta, StoryObj } from '@storybook/react'
import Select from './Select'

const meta: Meta<typeof Select> = {
  component: Select,
  title: 'UI/Select',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
]

export const Default: Story = {
  args: {
    options: countryOptions,
    placeholder: 'Select a country',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    helperText: 'Choose your billing country',
  },
}

export const WithError: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    error: 'Country is required',
  },
}

export const WithDefaultValue: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    defaultValue: 'uk',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    defaultValue: 'us',
    disabled: true,
  },
}

export const WithDisabledOptions: Story = {
  args: {
    label: 'Ticket Type',
    options: [
      { value: 'ga', label: 'General Admission - $25' },
      { value: 'vip', label: 'VIP - $75', disabled: true },
      { value: 'student', label: 'Student - $15' },
    ],
    placeholder: 'Select ticket type',
    helperText: 'VIP tickets are sold out',
  },
}

export const FullWidth: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
}

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <Select label="Small" size="sm" options={countryOptions} placeholder="Select..." />
      <Select label="Medium" size="md" options={countryOptions} placeholder="Select..." />
      <Select label="Large" size="lg" options={countryOptions} placeholder="Select..." />
    </div>
  ),
}
