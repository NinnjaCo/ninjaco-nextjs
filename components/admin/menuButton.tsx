import React from 'react'
import clsx from 'clsx'

const MenuButton: React.FC<{
  text: string
  Icon: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
      title?: string
      titleId?: string
    } & React.RefAttributes<SVGSVGElement>
  >
  isHighlighted?: boolean
  hideText?: boolean
  actionOnClick?: () => void
}> = ({ text, Icon, isHighlighted, hideText, actionOnClick }) => {
  return (
    <button
      key={text}
      className={clsx('flex gap-2 hover:bg-brand-500 pl-1 py-1 xs:py-2 rounded w-full', {
        'bg-brand-500 border-l-secondary border-l-2': isHighlighted,
      })}
      onClick={actionOnClick}
      tabIndex={0}
      aria-label={text}
      aria-hidden={hideText}
      aria-pressed={isHighlighted}
    >
      {Icon && (
        <Icon
          className={clsx('w-4', {
            'text-secondary': isHighlighted,
            'text-brand-300': !isHighlighted,
          })}
        />
      )}
      <div
        className={clsx('text-brand-300 font-semibold text-xs lg:text-sm', {
          'text-secondary': isHighlighted,
          hidden: hideText,
        })}
      >
        {text}
      </div>
    </button>
  )
}
export default MenuButton
