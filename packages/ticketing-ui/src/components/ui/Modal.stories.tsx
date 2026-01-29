import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'

const meta: Meta<typeof Modal> = {
  component: Modal,
  title: 'UI/Modal',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Wrapper to make modal interactive in stories
const ModalDemo = (props: Partial<React.ComponentProps<typeof Modal>>) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        {...props}
      >
        {props.children || <p className="text-ticketing-text">This is the modal content.</p>}
      </Modal>
    </>
  )
}

export const Default: Story = {
  render: () => <ModalDemo />,
}

export const WithHeader: Story = {
  render: () => (
    <ModalDemo header="Modal Title">
      <p className="text-ticketing-text">This modal has a header with a title.</p>
    </ModalDemo>
  ),
}

export const WithFooter: Story = {
  render: () => {
    const FooterDemo = () => {
      const [isOpen, setIsOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            footer={
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsOpen(false)}>Confirm</Button>
              </div>
            }
          >
            <p className="text-ticketing-text">This modal has a footer with action buttons.</p>
          </Modal>
        </>
      )
    }
    return <FooterDemo />
  },
}

export const WithHeaderAndFooter: Story = {
  render: () => {
    const FullDemo = () => {
      const [isOpen, setIsOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            header="Confirm Action"
            footer={
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsOpen(false)}>Confirm</Button>
              </div>
            }
          >
            <p className="text-ticketing-text">Are you sure you want to proceed with this action?</p>
          </Modal>
        </>
      )
    }
    return <FullDemo />
  },
}

export const SizeSmall: Story = {
  render: () => (
    <ModalDemo size="sm" header="Small Modal">
      <p className="text-ticketing-text">This is a small modal.</p>
    </ModalDemo>
  ),
}

export const SizeLarge: Story = {
  render: () => (
    <ModalDemo size="lg" header="Large Modal">
      <p className="text-ticketing-text">This is a large modal with more space for content.</p>
    </ModalDemo>
  ),
}

export const SizeXL: Story = {
  render: () => (
    <ModalDemo size="xl" header="Extra Large Modal">
      <p className="text-ticketing-text">This is an extra large modal.</p>
    </ModalDemo>
  ),
}

export const SizeFull: Story = {
  render: () => (
    <ModalDemo size="full" header="Full Width Modal">
      <p className="text-ticketing-text">This modal takes up most of the viewport.</p>
    </ModalDemo>
  ),
}

export const LongContent: Story = {
  render: () => (
    <ModalDemo header="Scrollable Content">
      <div className="space-y-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="text-ticketing-text">
            This is paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </div>
    </ModalDemo>
  ),
}

export const NoCloseButton: Story = {
  render: () => {
    const NoCloseDemo = () => {
      const [isOpen, setIsOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            showCloseButton={false}
            header="No Close Button"
            footer={
              <Button onClick={() => setIsOpen(false)} className="w-full">Close</Button>
            }
          >
            <p className="text-ticketing-text">This modal has no X button. Use the footer button to close.</p>
          </Modal>
        </>
      )
    }
    return <NoCloseDemo />
  },
}

export const NoBackdropClose: Story = {
  render: () => (
    <ModalDemo closeOnBackdropClick={false} header="Click Outside Disabled">
      <p className="text-ticketing-text">Clicking the backdrop won't close this modal. Use the X button.</p>
    </ModalDemo>
  ),
}

export const TicketDetails: Story = {
  render: () => {
    const TicketDemo = () => {
      const [isOpen, setIsOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setIsOpen(true)}>View Ticket Details</Button>
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            header="VIP Experience"
          >
            <div className="space-y-4">
              <p className="text-ticketing-primary text-xl font-semibold">$75.00</p>
              <div className="text-ticketing-text-muted space-y-2">
                <p><strong>Includes:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Reserved VIP seating</li>
                  <li>Complimentary drinks</li>
                  <li>Meet & greet access</li>
                  <li>Exclusive merchandise</li>
                  <li>Early entry to venue</li>
                </ul>
                <p className="pt-2">
                  This is a premium experience that includes all the perks you could want
                  for an unforgettable night.
                </p>
              </div>
            </div>
          </Modal>
        </>
      )
    }
    return <TicketDemo />
  },
}
