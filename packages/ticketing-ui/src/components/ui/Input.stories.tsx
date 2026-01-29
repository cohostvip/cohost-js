import type { Meta, StoryObj } from '@storybook/react'
import Input from './Input'

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'UI/Input',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    helperText: "We'll never share your email with anyone.",
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Email',
    value: 'disabled@example.com',
    disabled: true,
  },
}

export const SizeSmall: Story = {
  args: {
    label: 'Small Input',
    placeholder: 'Small size',
    size: 'sm',
  },
}

export const SizeMedium: Story = {
  args: {
    label: 'Medium Input',
    placeholder: 'Medium size',
    size: 'md',
  },
}

export const SizeLarge: Story = {
  args: {
    label: 'Large Input',
    placeholder: 'Large size',
    size: 'lg',
  },
}

export const FullWidth: Story = {
  args: {
    label: 'Full Width',
    placeholder: 'Full width input',
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

export const PasswordInput: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
  },
}

export const NumberInput: Story = {
  args: {
    label: 'Quantity',
    type: 'number',
    min: 0,
    max: 100,
    placeholder: '0',
  },
}
