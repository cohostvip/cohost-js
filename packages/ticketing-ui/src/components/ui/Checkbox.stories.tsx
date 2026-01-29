import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import Checkbox from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: 'UI/Checkbox',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
}

export const Checked: Story = {
  args: {
    label: 'Accept terms and conditions',
    defaultChecked: true,
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Subscribe to newsletter',
    helperText: "We'll send you updates about new events",
  },
}

export const WithError: Story = {
  args: {
    label: 'Accept terms and conditions',
    error: 'You must accept the terms to continue',
  },
}

export const Disabled: Story = {
  args: {
    label: 'This option is disabled',
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    label: 'This option is disabled and checked',
    disabled: true,
    defaultChecked: true,
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox size="sm" label="Small checkbox" />
      <Checkbox size="md" label="Medium checkbox" />
      <Checkbox size="lg" label="Large checkbox" />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <Checkbox
        label="Toggle me"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        helperText={checked ? 'Checkbox is checked' : 'Checkbox is unchecked'}
      />
    )
  },
}

export const CheckboxGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([])
    const options = ['Email notifications', 'SMS notifications', 'Push notifications']

    const toggle = (option: string) => {
      setSelected((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option]
      )
    }

    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-ticketing-text">Notification preferences</p>
        {options.map((option) => (
          <Checkbox
            key={option}
            label={option}
            checked={selected.includes(option)}
            onChange={() => toggle(option)}
          />
        ))}
      </div>
    )
  },
}
