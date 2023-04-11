import MenuButton from './menuButton'
import React from 'react'
import clsx from 'clsx'

interface SideMenuTabProps {
  text?: string
  Icon?: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
      title?: string
      titleId?: string
    } & React.RefAttributes<SVGSVGElement>
  >
  isHighlighted?: boolean
  actionOnClick?: () => void
  Body?: any
}

interface MenuSectionProps {
  iterable: SideMenuTabProps[]
  outerClassName?: string
  innerClassName?: string
  hideText?: boolean
}

const MenuSection = (props: MenuSectionProps) => {
  return (
    <div className={clsx('relative flex flex-col w-full gap-2', props.outerClassName)}>
      {props.iterable.map((item, index) => (
        <div key={index}>
          <div
            className={clsx(
              'bg-brand-300 h-px opacity-25 inline-flex w-full',
              props.innerClassName
            )}
          />
          <MenuButton
            text={item.text}
            Icon={item.Icon}
            isHighlighted={item.isHighlighted}
            hideText={props.hideText}
            actionOnClick={item.actionOnClick}
            Body={item.Body}
          />
        </div>
      ))}
    </div>
  )
}
export default MenuSection
