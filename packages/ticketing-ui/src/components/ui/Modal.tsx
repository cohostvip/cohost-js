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

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]',
  }

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={clsx(
          'relative w-full bg-ticketing-surface rounded-lg shadow-xl',
          'max-h-[calc(100vh-2rem)] flex flex-col',
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - positioned absolutely if no header */}
        {showCloseButton && !header && (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 p-1 text-ticketing-text-muted hover:text-ticketing-text transition-colors"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Header */}
        {header && (
          <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-ticketing-border">
            <div className="flex-1 text-lg font-semibold text-ticketing-text">
              {header}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 text-ticketing-text-muted hover:text-ticketing-text transition-colors -mr-1"
                aria-label="Close modal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={clsx(
          'flex-1 overflow-y-auto',
          header || footer ? 'px-6 py-4' : 'p-6'
        )}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-ticketing-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
