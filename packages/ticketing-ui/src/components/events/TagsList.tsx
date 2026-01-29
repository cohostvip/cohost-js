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

  const sizeClass = {
    sm: 'ticketing-tag--sm',
    md: 'ticketing-tag--md',
    lg: 'ticketing-tag--lg',
  }[size]

  return (
    <div className={clsx('ticketing-tags-list', className)}>
      {tags.map((tag, index) => {
        const isInteractive = !!tag.url || !!onClick
        const tagClasses = clsx(
          'ticketing-tag',
          sizeClass,
          isInteractive && 'ticketing-tag--interactive'
        )

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
              className={clsx(tagClasses, 'ticketing-tag__link')}
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
              className={clsx(tagClasses, 'ticketing-tag__button')}
              onClick={handleClick}
            >
              {tag.text}
            </button>
          )
        }

        return (
          <span key={`${tag.text}-${index}`} className={tagClasses}>
            {tag.text}
          </span>
        )
      })}
    </div>
  )
}

export default TagsList
