import { Bars3Icon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import MenuButton from './menuButton'
import React, { useState } from 'react'
import clsx from 'clsx'
import creators from '@/images/creators.svg'
import dashboard_logo from '@/images/dashboard_logo.svg'
import logo_head from '@/images/logo_head.svg'
import logo_white from '@/images/logo_white.svg'
import logout from '@/images/logout.svg'
import open_book from '@/images/open_book.svg'
import profile_icon from '@/images/profile_icon.svg'
import user_group from '@/images/user_group.svg'

const MenuSection = () => {
  const [open, setIsOpen] = useState(false)

  const menuSection = [
    {
      icon: dashboard_logo,
      text: 'DASHBOARD',
    },
    {
      icon: open_book,
      text: 'COURSES',
    },
    {
      icon: user_group,
      text: 'USERS',
    },
    {
      icon: creators,
      text: 'CREATORS',
    },
  ]
  const profileLogout = [
    {
      icon: profile_icon,
      text: 'PROFILE',
    },
    {
      icon: logout,
      text: 'LOGOUT',
    },
  ]

  return (
    <>
      {/* Menu after MD */}
      <div className="hidden md:flex bg-brand w-1/5 h-screen flex-col gap-20 justify-between items-center py-8 px-1 lg:px-4">
        <Link href={'/'}>
          <Image src={logo_white} alt="Hero Image" width={150} height={50}></Image>
        </Link>
        <div className="relative flex flex-col gap-2 w-full">
          {menuSection.map((item, index) => (
            <div key={index}>
              <div className="bg-brand-300 h-px opacity-25" />
              <MenuButton text={item.text} icon={item.icon} />
            </div>
          ))}
        </div>
        <div className="relative flex flex-col gap-3 w-full">
          {profileLogout.map((item, index) => (
            <div key={index}>
              {index !== 0 && <div className="bg-brand-300 h-px opacity-25" />}
              <MenuButton text={item.text} icon={item.icon} />
            </div>
          ))}
        </div>
      </div>
      {/* Menu before MD */}
      <div
        className={clsx(
          'flex md:hidden bg-brand h-screen flex-col justify-start items-center gap-20 py-8',
          open && 'w-40 absolute',
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

        <div
          className={clsx('relative flex flex-col w-full gap-1', open && 'gap-2', !open && 'px-3')}
        >
          {menuSection.map((item, index) => (
            <div key={index}>
              <div
                className={clsx('bg-brand-300 h-px opacity-25 inline-flex w-full', !open && 'pl-4')}
              />
              <div key={item.text} className="flex gap-3 hover:bg-brand-500 py-2">
                <button>
                  <Image
                    src={item.icon}
                    alt="image"
                    className={clsx('inline-flex duration-500 ', open && 'hidden ')}
                  ></Image>
                </button>
                <button
                  className={clsx('text-brand-300 font-semibold text-xs ', !open && 'hidden ')}
                >
                  {item.text}
                </button>
              </div>
            </div>
          ))}
          <div className={clsx('relative flex flex-col gap-1', open && 'gap-2')}>
            {profileLogout.map((item, index) => (
              <div key={index}>
                <div
                  className={clsx(
                    'bg-brand-300 h-px opacity-25 inline-flex  w-full',
                    !open && 'pl-3'
                  )}
                />
                <div key={item.text} className="flex gap-3 hover:bg-brand-500 py-2">
                  <button>
                    <Image
                      src={item.icon}
                      alt="image"
                      className={clsx('inline-flex duration-500', open && 'hidden ')}
                    ></Image>
                  </button>
                  <button
                    className={clsx('text-brand-300 font-semibold text-xs ', !open && 'hidden ')}
                  >
                    {item.text}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
export default MenuSection
