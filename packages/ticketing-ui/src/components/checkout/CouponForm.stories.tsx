import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import CouponForm from './CouponForm'
import type { AppliedCoupon } from './CouponForm'

const meta: Meta<typeof CouponForm> = {
  component: CouponForm,
  title: 'Checkout/CouponForm',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onApply: async (code: string) => {
      await new Promise((r) => setTimeout(r, 1000))
      if (code !== 'SAVE20') {
        throw new Error('Invalid promo code')
      }
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export const WithAppliedCoupon: Story = {
  args: {
    appliedCoupon: {
      code: 'SAVE20',
      discount: '20% off',
    },
    onApply: async () => {},
    onRemove: () => alert('Remove clicked'),
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export const AppliedWithoutRemove: Story = {
  args: {
    appliedCoupon: {
      code: 'EARLYBIRD',
      discount: '$10 off',
    },
    onApply: async () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export const Disabled: Story = {
  args: {
    onApply: async () => {},
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export const Interactive: Story = {
  render: () => {
    const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | undefined>()

    return (
      <div className="w-80">
        <CouponForm
          appliedCoupon={appliedCoupon}
          onApply={async (code) => {
            await new Promise((r) => setTimeout(r, 1000))
            if (code === 'SAVE20') {
              setAppliedCoupon({ code, discount: '20% off' })
            } else if (code === 'FREE10') {
              setAppliedCoupon({ code, discount: '$10 off' })
            } else {
              throw new Error('Invalid promo code. Try SAVE20 or FREE10')
            }
          }}
          onRemove={() => setAppliedCoupon(undefined)}
        />
        <p className="text-xs text-ticketing-text-muted mt-4">
          Try codes: SAVE20 or FREE10
        </p>
      </div>
    )
  },
}

export const InOrderSummaryContext: Story = {
  render: () => {
    const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | undefined>()

    return (
      <div className="w-80 bg-ticketing-surface border border-ticketing-border rounded-lg p-4">
        <h3 className="font-semibold text-ticketing-text mb-4">Order Summary</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-ticketing-text-muted">Subtotal</span>
            <span className="text-ticketing-text">$125.00</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-sm">
              <span className="text-ticketing-success">Discount</span>
              <span className="text-ticketing-success">-$25.00</span>
            </div>
          )}
        </div>
        <CouponForm
          appliedCoupon={appliedCoupon}
          onApply={async (code) => {
            await new Promise((r) => setTimeout(r, 500))
            if (code === 'SAVE20') {
              setAppliedCoupon({ code, discount: '20% off' })
            } else {
              throw new Error('Invalid code')
            }
          }}
          onRemove={() => setAppliedCoupon(undefined)}
        />
        <div className="flex justify-between font-semibold text-ticketing-text mt-4 pt-4 border-t border-ticketing-border">
          <span>Total</span>
          <span>{appliedCoupon ? '$100.00' : '$125.00'}</span>
        </div>
      </div>
    )
  },
}
