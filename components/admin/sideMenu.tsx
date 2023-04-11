import { AlertDialog } from '../shared/alertDialog'
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BookOpenIcon,
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { AuthApi } from '@/utils/api/auth'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import LocaleMenuButton from './localMenuButton'
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
  const session = useSession()

  const [openLogout, setOpenLogout] = React.useState(false)
  const router = useRouter()
  const preformLogout = async () => {
    // Delete the refresh token from the database
    const res = await new AuthApi(session.data).logout()

    // dont signout if there is an error
    if (!res || !res.payload) return

    signOut({ callbackUrl: '/auth/signin' })
  }

  const menuSection = [
    {
      Icon: HomeIcon,
      text: 'DASHBOARD',
      isHighlighted: props.higlightDashboard ?? false,
      actionOnClick: () => {
        router.push('/admin')
      },
    },
    {
      Icon: BookOpenIcon,
      text: 'COURSES',
      isHighlighted: props.higlightCourses ?? false,
      actionOnClick: () => {
        router.push('/admin/courses')
      },
    },
    {
      Icon: UserGroupIcon,
      text: 'USERS',
      isHighlighted: props.higlightUsers ?? false,
      actionOnClick: () => {
        router.push('/admin/users')
      },
    },
    {
      Icon: UsersIcon,
      text: 'CREATORS',
      isHighlighted: props.higlightCreators ?? false,
      actionOnClick: () => {
        router.push('/admin/creators')
      },
    },
  ]

  const profileLogout = [
    {
      Icon: UserIcon,
      text: 'PROFILE',
      isHighlighted: props.higlightProfile ?? false,
      actionOnClick: () => {
        router.push('/admin/profile')
      },
    },
    {
      Body: LocaleMenuButton,
    },

    {
      Icon: ArrowRightOnRectangleIcon,
      text: 'LOGOUT',
      isHighlighted: props.higlightLogout ?? false,
      actionOnClick: () => {
        setOpenLogout(true)
      },
    },
  ]

  return (
    <>
      {
        <AlertDialog
          title="Are you sure you want to logout?"
          close={() => {
            setOpenLogout(false)
          }}
          open={openLogout}
          confirm={preformLogout}
          message="You will be logged out of your account."
          confirmButtonText="Logout"
          backButtonText="Cancel"
        />
      }
      {/* Menu after MD */}
      <div className="hidden md:flex bg-brand w-full max-w-[12rem] h-screen flex-col justify-between items-center py-4 px-1 lg:px-4">
        <Link href={'/'}>
          <Image src={logo_white} alt="Hero Image" className="w-32" priority></Image>
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
