import type { Meta, StoryObj } from '@storybook/react'
import DisplayPrice from './DisplayPrice'

const meta: Meta<typeof DisplayPrice> = {
  component: DisplayPrice,
  title: 'UI/DisplayPrice',
  tags: ['autodocs'],
  argTypes: {
    minimumFractionDigits: {
      control: { type: 'number', min: 0, max: 4 },
    },
    maximumFractionDigits: {
      control: { type: 'number', min: 0, max: 4 },
    },
    hideIfEmpty: {
      control: 'boolean',
    },
    hideIfFree: {
      control: 'boolean',
    },
    showAsSale: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    price: 'USD,5000', // $50.00
  },
}

export const DifferentCurrencies: Story = {
  render: () => (
    <div className="space-y-2">
      <div>
        <span className="font-semibold mr-2">USD:</span>
        <DisplayPrice price="USD,9999" />
      </div>
      <div>
        <span className="font-semibold mr-2">EUR:</span>
        <DisplayPrice price="EUR,9999" />
      </div>
      <div>
        <span className="font-semibold mr-2">GBP:</span>
        <DisplayPrice price="GBP,9999" />
      </div>
      <div>
        <span className="font-semibold mr-2">JPY:</span>
        <DisplayPrice price="JPY,999900" minimumFractionDigits={0} />
      </div>
      <div>
        <span className="font-semibold mr-2">CAD:</span>
        <DisplayPrice price="CAD,9999" />
      </div>
    </div>
  ),
}

export const FreePrice: Story = {
  render: () => (
    <div className="space-y-2">
      <div>
        <span className="font-semibold mr-2">Default free label:</span>
        <DisplayPrice price="USD,0" />
      </div>
      <div>
        <span className="font-semibold mr-2">Custom free label:</span>
        <DisplayPrice price="USD,0" freeLabel="No charge" />
      </div>
      <div>
        <span className="font-semibold mr-2">Custom free JSX:</span>
        <DisplayPrice
          price="USD,0"
          freeLabel={
            <span className="text-ticketing-success font-semibold">
              FREE EVENT
            </span>
          }
        />
      </div>
    </div>
  ),
}

export const SalePrice: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="font-semibold mb-2">With original price:</p>
        <DisplayPrice price="USD,3999" originalPrice="USD,5999" />
      </div>
      <div>
        <p className="font-semibold mb-2">Show as sale (no original):</p>
        <DisplayPrice price="USD,3999" showAsSale={true} />
      </div>
      <div>
        <p className="font-semibold mb-2">Large discount:</p>
        <DisplayPrice price="USD,1999" originalPrice="USD,9999" />
      </div>
    </div>
  ),
}

export const LargeNumbers: Story = {
  render: () => (
    <div className="space-y-2">
      <div>
        <span className="font-semibold mr-2">Thousands:</span>
        <DisplayPrice price="USD,123456" />
      </div>
      <div>
        <span className="font-semibold mr-2">Millions:</span>
        <DisplayPrice price="USD,1234567890" />
      </div>
      <div>
        <span className="font-semibold mr-2">Small amount:</span>
        <DisplayPrice price="USD,50" />
      </div>
    </div>
  ),
}

export const DecimalHandling: Story = {
  render: () => (
    <div className="space-y-2">
      <div>
        <span className="font-semibold mr-2">Default (2 decimals):</span>
        <DisplayPrice price="USD,5000" />
      </div>
      <div>
        <span className="font-semibold mr-2">No decimals:</span>
        <DisplayPrice
          price="USD,5000"
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
      </div>
      <div>
        <span className="font-semibold mr-2">4 decimals:</span>
        <DisplayPrice
          price="USD,5000"
          minimumFractionDigits={4}
          maximumFractionDigits={4}
        />
      </div>
      <div>
        <span className="font-semibold mr-2">Variable (0-2):</span>
        <DisplayPrice
          price="USD,5050"
          minimumFractionDigits={0}
          maximumFractionDigits={2}
        />
      </div>
    </div>
  ),
}

export const NegativePrice: Story = {
  render: () => (
    <div className="space-y-2">
      <div>
        <span className="font-semibold mr-2">Refund/Credit:</span>
        <DisplayPrice price="USD,-2500" />
      </div>
      <div>
        <span className="font-semibold mr-2">With label:</span>
        <DisplayPrice
          price="USD,-2500"
          leftDecorator={<span className="mr-1">Refund:</span>}
        />
      </div>
    </div>
  ),
}

export const WithDecorators: Story = {
  render: () => (
    <div className="space-y-2">
      <div>
        <DisplayPrice
          price="USD,5000"
          leftDecorator={<span className="mr-2">Price:</span>}
        />
      </div>
      <div>
        <DisplayPrice
          price="USD,5000"
          rightDecorator={<span className="ml-2 text-sm text-ticketing-text-muted">per ticket</span>}
        />
      </div>
      <div>
        <DisplayPrice
          price="USD,5000"
          leftDecorator={<span className="mr-2">Total:</span>}
          rightDecorator={<span className="ml-2 text-sm text-ticketing-text-muted">USD</span>}
        />
      </div>
    </div>
  ),
}

export const HideIfEmpty: Story = {
  render: () => (
    <div className="space-y-2">
      <div>
        <span className="font-semibold mr-2">With price:</span>
        <DisplayPrice price="USD,5000" hideIfEmpty={true} />
      </div>
      <div>
        <span className="font-semibold mr-2">Without price (hidden):</span>
        <DisplayPrice price={undefined} hideIfEmpty={true} />
        <span className="text-ticketing-text-muted text-sm">
          (Component is hidden)
        </span>
      </div>
      <div>
        <span className="font-semibold mr-2">Without price (shown):</span>
        <DisplayPrice price={undefined} hideIfEmpty={false} />
      </div>
    </div>
  ),
}

export const HideIfFree: Story = {
  render: () => (
    <div className="space-y-2">
      <div>
        <span className="font-semibold mr-2">Paid event:</span>
        <DisplayPrice price="USD,5000" hideIfFree={true} />
      </div>
      <div>
        <span className="font-semibold mr-2">Free event (hidden):</span>
        <DisplayPrice price="USD,0" hideIfFree={true} />
        <span className="text-ticketing-text-muted text-sm">
          (Component is hidden)
        </span>
      </div>
      <div>
        <span className="font-semibold mr-2">Free event (shown):</span>
        <DisplayPrice price="USD,0" hideIfFree={false} />
      </div>
    </div>
  ),
}

export const StyledPrices: Story = {
  render: () => (
    <div className="space-y-3">
      <DisplayPrice
        price="USD,9999"
        className="text-3xl font-bold text-ticketing-primary"
      />
      <DisplayPrice
        price="USD,4999"
        className="text-xl font-semibold text-ticketing-text"
      />
      <DisplayPrice
        price="USD,1999"
        className="text-sm text-ticketing-text-muted"
      />
      <DisplayPrice
        price="USD,2999"
        originalPrice="USD,5999"
        className="text-2xl"
      />
    </div>
  ),
}

export const Playground: Story = {
  args: {
    price: 'USD,5000',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    hideIfEmpty: false,
    hideIfFree: false,
    showAsSale: false,
    freeLabel: 'Free',
  },
}
