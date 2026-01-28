import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import QuantitySelector from './QuantitySelector'

const meta: Meta<typeof QuantitySelector> = {
  component: QuantitySelector,
  title: 'Checkout/QuantitySelector',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
    },
    min: {
      control: 'number',
    },
    max: {
      control: 'number',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Interactive wrapper for stories
const InteractiveQuantitySelector = (args: any) => {
  const [value, setValue] = useState(args.value || 0)

  return (
    <QuantitySelector
      {...args}
      value={value}
      onIncrement={() => setValue((v) => v + 1)}
      onDecrement={() => setValue((v) => v - 1)}
    />
  )
}

export const Default: Story = {
  render: InteractiveQuantitySelector,
  args: {
    value: 0,
  },
}

export const WithInitialValue: Story = {
  render: InteractiveQuantitySelector,
  args: {
    value: 3,
  },
}

export const WithLimits: Story = {
  render: InteractiveQuantitySelector,
  args: {
    value: 5,
    min: 0,
    max: 10,
  },
}

export const AtMinimum: Story = {
  render: InteractiveQuantitySelector,
  args: {
    value: 0,
    min: 0,
    max: 10,
  },
}

export const AtMaximum: Story = {
  render: InteractiveQuantitySelector,
  args: {
    value: 10,
    min: 0,
    max: 10,
  },
}

export const Disabled: Story = {
  render: InteractiveQuantitySelector,
  args: {
    value: 5,
    disabled: true,
  },
}
