import { FC, useState } from 'react'
import { useCohostCheckout } from '@cohostvip/cohost-react'
import type { CartSessionItem } from '@cohostvip/cohost-node'
import DisplayPrice from '../ui/DisplayPrice'

interface TicketDetailsModalProps {
  item: CartSessionItem
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
                {item.offering?.name || 'Ticket Details'}
              </h3>
              <p className="text-lg font-semibold text-ticketing-text mt-2">
                <DisplayPrice
                  price={item.offering.costs?.gross}
                  rightDecorator={
                    <span className="text-sm text-ticketing-muted ml-1 font-normal">
                      per ticket
                    </span>
                  }
                />
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-ticketing-muted hover:text-ticketing-text transition-colors"
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
          {!!item.offering?.description && (
            <div
              className="prose prose-sm max-w-none text-ticketing-muted"
              dangerouslySetInnerHTML={{ __html: item.offering.description }}
            />
          )}

          {/* Additional Info */}
          {!!item.offering?.maximumQuantity &&
            item.offering.maximumQuantity < 10 && (
              <div className="mt-6 p-4 bg-ticketing-background rounded-lg">
                <p className="text-sm text-ticketing-muted">
                  <strong className="text-ticketing-text">
                    Maximum Quantity:
                  </strong>{' '}
                  {item.offering.maximumQuantity} per order
                </p>
              </div>
            )}

          {!!(
            item.offering?.minimumQuantity &&
            item.offering.minimumQuantity > 1
          ) && (
            <div className="mt-4 p-4 bg-ticketing-background rounded-lg">
              <p className="text-sm text-ticketing-muted">
                <strong className="text-ticketing-text">
                  Minimum Quantity:
                </strong>{' '}
                {item.offering.minimumQuantity}
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
  className?: string
}

/**
 * TicketSelector - Display and select tickets with quantities
 *
 * Requires Cohost SDK context (CohostCheckoutProvider).
 *
 * @example
 * ```tsx
 * <CohostCheckoutProvider cartSessionId="...">
 *   <TicketSelector />
 * </CohostCheckoutProvider>
 * ```
 */
const TicketSelector: FC<TicketSelectorProps> = ({ className = '' }) => {
  const { cartSession, incrementItem, decrementItem } = useCohostCheckout()
  const { items } = cartSession!
  const [selectedItem, setSelectedItem] = useState<CartSessionItem | null>(null)

  return (
    <>
      <div
        className={`bg-ticketing-surface rounded-lg shadow-sm border border-ticketing-border ${className}`}
      >
        <div className="p-6 border-b border-ticketing-border">
          <h3 className="text-lg font-semibold text-ticketing-text">
            Select Tickets
          </h3>
          <p className="text-sm text-ticketing-muted mt-1">
            Choose the number of tickets you&apos;d like to purchase
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {items
              .toSorted((a, b) => a.offering.sorting - b.offering.sorting)
              .map((item) => (
                <div
                  key={item.id}
                  className="border border-ticketing-border rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-base font-medium text-ticketing-text">
                        {item.offering?.name || 'Ticket'}
                      </h4>
                      {item.offering?.description && (
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="mt-1 text-sm text-ticketing-primary hover:text-ticketing-primary-hover transition-colors font-medium"
                        >
                          See Details →
                        </button>
                      )}
                      <div className="mt-2">
                        <DisplayPrice
                          price={item.offering.costs?.gross}
                          className="text-lg font-semibold text-ticketing-text"
                          rightDecorator={
                            <span className="text-sm font-thin text-ticketing-muted ml-1">
                              per ticket
                            </span>
                          }
                          freeLabel={
                            <div className="text-sm font-thin text-ticketing-muted italic">
                              Free
                            </div>
                          }
                        />
                      </div>
                    </div>

                    <div className="ml-6 flex flex-col items-end space-y-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => decrementItem(item.id)}
                          disabled={item.quantity < 1}
                          className="w-8 h-8 rounded-full bg-ticketing-background flex items-center justify-center text-ticketing-text hover:bg-ticketing-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium text-ticketing-text">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementItem(item.id)}
                          className="w-8 h-8 rounded-full bg-ticketing-background flex items-center justify-center text-ticketing-text hover:bg-ticketing-surface-hover transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      {item.quantity > 0 && (
                        <div className="text-right">
                          <DisplayPrice
                            price={item.costs?.total}
                            className="text-lg font-semibold text-ticketing-text"
                            leftDecorator={
                              <div className="text-sm font-thin text-ticketing-muted">
                                Subtotal
                              </div>
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Show offering constraints if any */}
                  {item.offering?.maximumQuantity &&
                    item.offering.maximumQuantity < 10 && (
                      <div className="mt-3 text-xs text-ticketing-muted">
                        Maximum {item.offering.maximumQuantity} per order
                      </div>
                    )}
                </div>
              ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 text-ticketing-muted mx-auto mb-4"
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
              <p className="text-ticketing-muted">No tickets available</p>
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
