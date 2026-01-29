import { FC, ReactNode, useEffect } from 'react'
import { clsx } from 'clsx'

export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean

  /**
   * Called when the modal should close (backdrop click, escape key)
   */
  onClose: () => void

  /**
   * Modal content
   */
  children: ReactNode

  /**
   * Optional header content (not rendered if undefined)
   */
  header?: ReactNode

  /**
   * Optional footer content (not rendered if undefined)
   */
  footer?: ReactNode

  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'

  /**
   * Whether clicking the backdrop closes the modal
   * @default true
   */
  closeOnBackdropClick?: boolean

  /**
   * Whether pressing Escape closes the modal
   * @default true
   */
  closeOnEscape?: boolean

  /**
   * Whether to show the close button in the header area
   * @default true
   */
  showCloseButton?: boolean

  /**
   * Additional class name for the modal content
   */
  className?: string
}

/**
 * Modal - Overlay dialog component
 *
 * @example
 * ```tsx
 * // Basic modal
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <p>Modal content here</p>
 * </Modal>
 *
 * // With header and footer
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   header={<h2>Modal Title</h2>}
 *   footer={<Button onClick={() => setIsOpen(false)}>Close</Button>}
 * >
 *   <p>Modal content here</p>
 * </Modal>
 * ```
 */
const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  header,
  footer,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
}) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onClose()
    }
  }

  return (
    <div
      className="ticketing-modal__backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={clsx(
          'ticketing-modal__container',
          `ticketing-modal__container--${size}`,
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - positioned absolutely if no header */}
        {showCloseButton && !header && (
          <button
            onClick={onClose}
            className="ticketing-modal__close-button"
            aria-label="Close modal"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Header */}
        {header && (
          <div className="ticketing-modal__header">
            <div className="ticketing-modal__header-content">
              {header}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ticketing-modal__header-close"
                aria-label="Close modal"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={clsx(
          'ticketing-modal__content',
          {
            'ticketing-modal__content--with-sections': header || footer,
            'ticketing-modal__content--full': !header && !footer,
          }
        )}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="ticketing-modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
