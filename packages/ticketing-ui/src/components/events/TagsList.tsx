import { FC } from 'react'
import { clsx } from 'clsx'

export interface Tag {
  /**
   * Tag text to display
   */
  text: string

  /**
   * Optional URL for the tag (makes it a link)
   */
  url?: string
}

export interface TagsListProps {
  /**
   * Array of tags to display
   */
  tags: Tag[]

  /**
   * Optional callback when a tag is clicked
   */
  onClick?: (tag: Tag) => void

  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * Additional class name
   */
  className?: string
}

/**
 * TagsList - Display a list of tags with optional links and click handlers
 *
 * @example
 * ```tsx
 * <TagsList
 *   tags={[
 *     { text: 'Music' },
 *     { text: 'Concert', url: '/events?tag=concert' },
 *     { text: 'Live' },
 *   ]}
 *   onClick={(tag) => console.log('Clicked:', tag.text)}
 * />
 * ```
 */
const TagsList: FC<TagsListProps> = ({
  tags,
  onClick,
  size = 'md',
  className,
}) => {
  if (tags.length === 0) return null

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  const baseClasses = clsx(
    'inline-flex items-center rounded-full',
    'bg-ticketing-surface border border-ticketing-border',
    'text-ticketing-text transition-colors',
    sizeClasses[size]
  )

  const interactiveClasses = 'hover:bg-ticketing-surface-hover cursor-pointer'

  return (
    <div className={clsx('flex flex-wrap gap-2', className)}>
      {tags.map((tag, index) => {
        const isInteractive = !!tag.url || !!onClick
        const classes = clsx(baseClasses, isInteractive && interactiveClasses)

        const handleClick = () => {
          if (onClick) {
            onClick(tag)
          }
        }

        if (tag.url) {
          return (
            <a
              key={`${tag.text}-${index}`}
              href={tag.url}
              className={classes}
              onClick={onClick ? handleClick : undefined}
            >
              {tag.text}
            </a>
          )
        }

        if (onClick) {
          return (
            <button
              key={`${tag.text}-${index}`}
              type="button"
              className={classes}
              onClick={handleClick}
            >
              {tag.text}
            </button>
          )
        }

        return (
          <span key={`${tag.text}-${index}`} className={classes}>
            {tag.text}
          </span>
        )
      })}
    </div>
  )
}

export default TagsList
