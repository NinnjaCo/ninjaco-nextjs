import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BookOpenIcon,
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import MenuButton from './menuButton'
import MenuSection from './menuSection'
import React, { useState } from 'react'
import clsx from 'clsx'
import logo_head from '@/images/logo_head.svg'
import logo_white from '@/images/logo_white.svg'

interface SideMenuProps {
  higlightDashboard?: boolean
  higlightCourses?: boolean
  higlightUsers?: boolean
  higlightCreators?: boolean
  higlightProfile?: boolean
  higlightLogout?: boolean
}

const SideMenu = (props: SideMenuProps) => {
  const [open, setIsOpen] = useState(false)

  const menuSection = [
    {
      Icon: HomeIcon,
      text: 'DASHBOARD',
      isHighlighted: props.higlightDashboard ?? false,
    },
    {
      Icon: BookOpenIcon,
      text: 'COURSES',
      isHighlighted: props.higlightCourses ?? false,
    },
    {
      Icon: UserGroupIcon,
      text: 'USERS',
      isHighlighted: props.higlightUsers ?? false,
    },
    {
      Icon: UsersIcon,
      text: 'CREATORS',
      isHighlighted: props.higlightCreators ?? false,
    },
  ]

  const profileLogout = [
    {
      Icon: UserIcon,
      text: 'PROFILE',
      isHighlighted: props.higlightProfile ?? false,
    },
    {
      Icon: ArrowRightOnRectangleIcon,
      text: 'LOGOUT',
      isHighlighted: props.higlightLogout ?? false,
      link: '/admin/logout',
    },
  ]

  return (
    <>
      {/* Menu after MD */}
      <div className="hidden md:flex bg-brand w-1/5 h-screen flex-col justify-between items-center py-4 px-1 lg:px-4">
        <Link href={'/'}>
          <Image src={logo_white} alt="Hero Image" width={150} height={50} priority></Image>
        </Link>
        <MenuSection iterable={menuSection} />
        <MenuSection iterable={profileLogout} />
      </div>
      {/* Menu before MD */}
      <div
        className={clsx(
          'flex md:hidden bg-brand self-stretch flex-1 flex-col justify-start py-4 gap-8',
          open && 'w-40 absolute min-h-full',
          !open && 'w-16',
          'duration-300 z-10'
        )}
      >
        <div
          className={clsx(
            'flex w-full',
            open && 'items-center justify-between px-4',
            !open && 'flex-col px-2 gap-4'
          )}
        >
          <Link href={'/'} className={clsx(open && 'w-16', !open && 'w-8')}>
            <Image src={open ? logo_white : logo_head} alt="Hero Image"></Image>
          </Link>

          {open ? (
            <ChevronLeftIcon
              className={clsx('h-8 w-8 cursor-pointer text-brand-300', !open && 'rotate-180')}
              onClick={() => setIsOpen(!open)}
            ></ChevronLeftIcon>
          ) : (
            <Bars3Icon
              className={clsx('w-8 h-8 cursor-pointer text-brand-300')}
              onClick={() => setIsOpen(!open)}
            />
          )}
        </div>

        <MenuSection
          iterable={menuSection}
          outerClassName={clsx(open && 'gap-2', !open && 'px-3')}
          hideText={!open}
        />
        <MenuSection
          iterable={profileLogout}
          outerClassName={clsx(open && 'gap-2', !open && 'px-3')}
          hideText={!open}
        />
      </div>
    </>
  )
}

export default SideMenu
