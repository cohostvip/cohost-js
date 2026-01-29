import type { Meta, StoryObj } from '@storybook/react'
import TagsList, { type Tag } from './TagsList'

const meta: Meta<typeof TagsList> = {
  component: TagsList,
  title: 'Events/TagsList',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tags: [
      { text: 'Music' },
      { text: 'Concert' },
      { text: 'Live Performance' },
    ],
  },
}

export const WithUrls: Story = {
  args: {
    tags: [
      { text: 'Music', url: '/events?tag=music' },
      { text: 'Concert', url: '/events?tag=concert' },
      { text: 'Rock', url: '/events?tag=rock' },
    ],
  },
}

export const WithClickHandler: Story = {
  args: {
    tags: [
      { text: 'Music' },
      { text: 'Concert' },
      { text: 'Live' },
    ],
    onClick: (tag: Tag) => alert(`Clicked: ${tag.text}`),
  },
}

export const MixedTags: Story = {
  args: {
    tags: [
      { text: 'Featured' },
      { text: 'Music', url: '/events?tag=music' },
      { text: 'Weekend' },
      { text: 'Local', url: '/events?tag=local' },
    ],
    onClick: (tag: Tag) => console.log('Clicked:', tag),
  },
}

export const SizeSmall: Story = {
  args: {
    tags: [
      { text: 'Music' },
      { text: 'Concert' },
      { text: 'Live' },
    ],
    size: 'sm',
  },
}

export const SizeMedium: Story = {
  args: {
    tags: [
      { text: 'Music' },
      { text: 'Concert' },
      { text: 'Live' },
    ],
    size: 'md',
  },
}

export const SizeLarge: Story = {
  args: {
    tags: [
      { text: 'Music' },
      { text: 'Concert' },
      { text: 'Live' },
    ],
    size: 'lg',
  },
}

export const ManyTags: Story = {
  args: {
    tags: [
      { text: 'Music' },
      { text: 'Concert' },
      { text: 'Live Performance' },
      { text: 'Rock' },
      { text: 'Alternative' },
      { text: 'Indie' },
      { text: 'Local Artist' },
      { text: 'Weekend Event' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export const Empty: Story = {
  args: {
    tags: [],
  },
}
