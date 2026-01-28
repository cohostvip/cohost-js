import type { Meta, StoryObj } from '@storybook/react'
import CheckoutStepper, { CheckoutStep } from './CheckoutStepper'

const meta: Meta<typeof CheckoutStepper> = {
  component: CheckoutStepper,
  title: 'Checkout/CheckoutStepper',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const steps: CheckoutStep[] = [
  { id: 1, title: 'Tickets', description: 'Select tickets' },
  { id: 2, title: 'Info', description: 'Your details' },
  { id: 3, title: 'Payment', description: 'Complete order' },
]

export const Step1Active: Story = {
  args: {
    steps,
    currentStepId: 1,
  },
}

export const Step2Active: Story = {
  args: {
    steps,
    currentStepId: 2,
  },
}

export const Step3Active: Story = {
  args: {
    steps,
    currentStepId: 3,
  },
}

export const AllStepsCompleted: Story = {
  args: {
    steps,
    currentStepId: 4, // Beyond last step
  },
}

export const WithClickableSteps: Story = {
  args: {
    steps,
    currentStepId: 3,
    allowClickableSteps: true,
    onStepClick: (stepId: number) => {
      console.log('Navigate to step:', stepId)
    },
  },
}

export const TwoSteps: Story = {
  args: {
    steps: [
      { id: 1, title: 'Select', description: 'Choose tickets' },
      { id: 2, title: 'Checkout', description: 'Complete purchase' },
    ],
    currentStepId: 1,
  },
}

export const FourSteps: Story = {
  args: {
    steps: [
      { id: 1, title: 'Tickets', description: 'Select' },
      { id: 2, title: 'Details', description: 'Info' },
      { id: 3, title: 'Payment', description: 'Pay' },
      { id: 4, title: 'Confirm', description: 'Review' },
    ],
    currentStepId: 2,
  },
}

export const WithoutDescriptions: Story = {
  args: {
    steps: [
      { id: 1, title: 'Tickets' },
      { id: 2, title: 'Info' },
      { id: 3, title: 'Payment' },
    ],
    currentStepId: 2,
  },
}
