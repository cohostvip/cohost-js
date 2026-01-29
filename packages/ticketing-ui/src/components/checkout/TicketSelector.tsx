import { FC, useState } from 'react'
import DisplayPrice from '../ui/DisplayPrice'
import QuantitySelector from '../ui/QuantitySelector'

export interface TicketSelectorItem {
  id: string
  name: string
  description?: string
  price: string
  quantity: number
  totalPrice?: string
  maxQuantity?: number
  minQuantity?: number
  soldOut?: boolean
}

interface TicketDetailsModalProps {
  item: TicketSelectorItem
  isOpen: boolean
  onClose: () => void
}

const TicketDetailsModal: FC<TicketDetailsModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50 cursor-default"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="relative bg-ticketing-surface rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-ticketing-surface border-b border-ticketing-border p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-ticketing-text">
                {item.name}
              </h3>
              <div className="mt-2">
                <DisplayPrice
                  price={item.price}
                  className="text-lg font-semibold text-ticketing-text"
                  rightDecorator={
                    <span className="text-sm text-ticketing-text-muted ml-1 font-normal">
                      per ticket
                    </span>
                  }
                />
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-ticketing-text-muted hover:text-ticketing-text transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {item.description && (
            <div
              className="prose prose-sm max-w-none text-ticketing-text-muted"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          )}

          {/* Additional Info */}
          {item.maxQuantity !== undefined && item.maxQuantity < 10 && (
            <div className="mt-6 p-4 bg-ticketing-background rounded-lg">
              <p className="text-sm text-ticketing-text-muted">
                <strong className="text-ticketing-text">
                  Maximum Quantity:
                </strong>{' '}
                {item.maxQuantity} per order
              </p>
            </div>
          )}

          {item.minQuantity !== undefined && item.minQuantity > 1 && (
            <div className="mt-4 p-4 bg-ticketing-background rounded-lg">
              <p className="text-sm text-ticketing-text-muted">
                <strong className="text-ticketing-text">
                  Minimum Quantity:
                </strong>{' '}
                {item.minQuantity}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-ticketing-surface border-t border-ticketing-border p-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-ticketing-primary text-white rounded-lg hover:bg-ticketing-primary-hover transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export interface TicketSelectorProps {
  /**
   * List of ticket items
   */
  items: TicketSelectorItem[]

  /**
   * Called when quantity is incremented
   */
  onIncrement: (itemId: string) => void

  /**
   * Called when quantity is decremented
   */
  onDecrement: (itemId: string) => void

  /**
   * Additional class names
   */
  className?: string
}

/**
 * TicketSelector - Display and select tickets with quantities
 *
 * @example
 * ```tsx
 * <TicketSelector
 *   items={[
 *     { id: '1', name: 'General Admission', price: 'USD,2500', quantity: 0 },
 *     { id: '2', name: 'VIP', price: 'USD,7500', quantity: 0 }
 *   ]}
 *   onIncrement={(id) => handleIncrement(id)}
 *   onDecrement={(id) => handleDecrement(id)}
 * />
 * ```
 */
const TicketSelector: FC<TicketSelectorProps> = ({
  items,
  onIncrement,
  onDecrement,
  className = '',
}) => {
  const [selectedItem, setSelectedItem] = useState<TicketSelectorItem | null>(
    null
  )

  return (
    <>
      <div
        className={`bg-ticketing-surface rounded-lg shadow-sm border border-ticketing-border ${className}`}
      >
        <div className="p-6 border-b border-ticketing-border">
          <h3 className="text-lg font-semibold text-ticketing-text">
            Select Tickets
          </h3>
          <p className="text-sm text-ticketing-text-muted mt-1">
            Choose the number of tickets you&apos;d like to purchase
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {items.map((item) => {
              const isSoldOut = item.soldOut || item.maxQuantity === 0

              return (
                <div
                  key={item.id}
                  className={`border border-ticketing-border rounded-lg p-4 ${
                    isSoldOut ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-medium text-ticketing-text">
                          {item.name}
                        </h4>
                        {isSoldOut && (
                          <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                            Sold Out
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="mt-1 text-sm text-ticketing-primary hover:text-ticketing-primary-hover transition-colors font-medium"
                        >
                          See Details
                        </button>
                      )}
                      <div className="mt-2">
                        <DisplayPrice
                          price={item.price}
                          className="text-lg font-semibold text-ticketing-text"
                          rightDecorator={
                            <span className="text-sm font-normal text-ticketing-text-muted ml-1">
                              per ticket
                            </span>
                          }
                          freeLabel="Free"
                        />
                      </div>
                    </div>

                    <div className="ml-6 flex flex-col items-end space-y-3">
                      {/* Quantity Selector */}
                      <QuantitySelector
                        value={item.quantity}
                        onIncrement={() => onIncrement(item.id)}
                        onDecrement={() => onDecrement(item.id)}
                        min={0}
                        max={item.maxQuantity}
                        disabled={isSoldOut}
                      />
                      {item.quantity > 0 && item.totalPrice && (
                        <div className="text-right">
                          <span className="text-sm text-ticketing-text-muted block">
                            Subtotal
                          </span>
                          <DisplayPrice
                            price={item.totalPrice}
                            className="text-lg font-semibold text-ticketing-text"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Show offering constraints if any */}
                  {item.maxQuantity !== undefined && item.maxQuantity < 10 && !isSoldOut && (
                    <div className="mt-3 text-xs text-ticketing-text-muted">
                      Maximum {item.maxQuantity} per order
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {items.length === 0 && (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 text-ticketing-text-muted mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p className="text-ticketing-text-muted">No tickets available</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <TicketDetailsModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  )
}

export default TicketSelector
