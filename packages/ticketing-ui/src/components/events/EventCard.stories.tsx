import type { Meta, StoryObj } from '@storybook/react'
import EventCard from './EventCard'

const meta: Meta<typeof EventCard> = {
  component: EventCard,
  title: 'Events/EventCard',
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'Summer Music Festival 2024',
    startDate: '2024-07-15T19:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=450&fit=crop',
    imageAlt: 'Outdoor music festival with crowd',
    venueName: 'Central Park',
    venueAddress: 'New York, NY',
    summary: 'Join us for an unforgettable evening of live music featuring top artists from around the world.',
  },
}

export const WithImage: Story = {
  args: {
    name: 'Art Gallery Opening Night',
    startDate: '2024-06-20T18:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&h=450&fit=crop',
    imageAlt: 'Modern art gallery interior',
    venueName: 'Downtown Gallery',
    venueAddress: '123 Art Street, Brooklyn, NY',
    summary: 'Experience contemporary art from emerging artists in an intimate gallery setting.',
  },
}

export const WithoutImage: Story = {
  args: {
    name: 'Tech Conference 2024',
    startDate: '2024-08-10T09:00:00Z',
    venueName: 'Convention Center',
    venueAddress: 'San Francisco, CA',
    summary: 'Three days of workshops, keynotes, and networking with industry leaders.',
  },
}

export const SoldOut: Story = {
  args: {
    name: 'Exclusive Wine Tasting',
    startDate: '2024-05-25T20:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=450&fit=crop',
    imageAlt: 'Wine glasses on table',
    venueName: 'Le Chateau',
    venueAddress: 'Napa Valley, CA',
    summary: 'An intimate evening sampling rare vintages with our expert sommelier.',
    soldOut: true,
  },
}

export const WithVenue: Story = {
  args: {
    name: 'Stand-up Comedy Night',
    startDate: '2024-06-05T21:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=450&fit=crop',
    imageAlt: 'Comedy club stage with microphone',
    venueName: 'The Laugh Factory',
    venueAddress: 'Hollywood, CA',
    summary: 'A hilarious night featuring three of the hottest comedians in the circuit.',
  },
}

export const MinimalInfo: Story = {
  args: {
    name: 'Community Meetup',
    startDate: '2024-07-01T19:00:00Z',
  },
}

export const LongContent: Story = {
  args: {
    name: 'International Film Festival Premiere Screening and Q&A Session',
    startDate: '2024-09-15T19:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=450&fit=crop',
    imageAlt: 'Cinema theater interior',
    venueName: 'Grand Cinema Theater at the Historical Arts District',
    venueAddress: '456 Film Boulevard, Downtown Los Angeles, California',
    summary:
      'Join us for the world premiere of an award-winning documentary followed by an exclusive Q&A session with the director, producer, and key cast members. This is a rare opportunity to engage with the creative team behind this groundbreaking film.',
  },
}

export const Clickable: Story = {
  args: {
    name: 'Interactive Workshop',
    startDate: '2024-06-28T14:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=450&fit=crop',
    imageAlt: 'Workshop space',
    venueName: 'Maker Space',
    venueAddress: 'Austin, TX',
    summary: 'Hands-on workshop for beginners in digital art and design.',
    onClick: () => alert('Card clicked!'),
  },
}

export const WithHref: Story = {
  args: {
    name: 'Spring Concert Series',
    startDate: '2024-05-15T19:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=450&fit=crop',
    imageAlt: 'Concert hall',
    venueName: 'Symphony Hall',
    venueAddress: 'Boston, MA',
    summary: 'Classical music performances featuring renowned orchestras.',
    href: '/events/spring-concert',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <EventCard
        name="With Image"
        startDate="2024-07-15T19:00:00Z"
        imageUrl="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=225&fit=crop"
        venueName="Central Park"
      />
      <EventCard
        name="Without Image"
        startDate="2024-07-15T19:00:00Z"
        venueName="Downtown Venue"
        summary="Join us for an amazing event."
      />
      <EventCard
        name="Sold Out"
        startDate="2024-07-15T19:00:00Z"
        imageUrl="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=225&fit=crop"
        soldOut={true}
      />
    </div>
  ),
}
