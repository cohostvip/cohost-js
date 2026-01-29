import type { Meta, StoryObj } from '@storybook/react'
import TextArea from './TextArea'

const meta: Meta<typeof TextArea> = {
  component: TextArea,
  title: 'UI/TextArea',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message...',
    rows: 4,
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    helperText: 'Max 500 characters',
    rows: 4,
  },
}

export const WithError: Story = {
  args: {
    label: 'Message',
    value: '',
    error: 'Message is required',
    rows: 4,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Message',
    value: 'This textarea is disabled',
    disabled: true,
    rows: 4,
  },
}

export const NoResize: Story = {
  args: {
    label: 'Fixed Size',
    placeholder: 'Cannot resize',
    resize: 'none',
    rows: 4,
  },
}

export const FullWidth: Story = {
  args: {
    label: 'Full Width',
    placeholder: 'Full width textarea',
    fullWidth: true,
    rows: 4,
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
    <div className="space-y-4 w-80">
      <TextArea label="Small" size="sm" placeholder="Small size" rows={2} />
      <TextArea label="Medium" size="md" placeholder="Medium size" rows={2} />
      <TextArea label="Large" size="lg" placeholder="Large size" rows={2} />
    </div>
  ),
}
