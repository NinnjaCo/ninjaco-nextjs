import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
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
  const [open, setIsOpen] = useState(true)

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

  const profile_logout = [
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
      <div className="hidden md:block bg-brand  w-1/5 ">
        <div className="flex flex-col gap-20 justify-between items-center">
          <Link href={'/'}>
            <Image
              src={logo_white}
              alt="Hero Image"
              width={150}
              height={50}
              className=" mt-7"
            ></Image>
          </Link>
          <div className="relative flex flex-col gap-3 w-2/3 ">
            {menuSection.map((item) => (
              <>
                <div className="bg-brand-300 h-px opacity-25" />
                <div key={item.text} className="flex gap-3 mb-4">
                  <Image src={item.icon} alt="image"></Image>
                  <button className="text-brand-300 font-semibold text-sm">{item.text}</button>
                </div>
              </>
            ))}
          </div>
          <div className="relative flex flex-col gap-3 w-2/3 ">
            {profile_logout.map((item) => (
              <>
                <div className="bg-brand-300  h-px opacity-25" />
                <div key={item.text} className="flex gap-3 mb-4">
                  <Image src={item.icon} alt="image"></Image>
                  <button className="text-brand-300 font-semibold text-sm">{item.text}</button>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
      <div
        className={clsx(
          'block md:hidden bg-brand h-screen flex-col justify-between items-center',
          open && 'w-40',
          !open && 'w-16',
          'duration-300 relative'
        )}
      >
        <ChevronLeftIcon
          className={clsx('h-10 w-10 text-brand-300 absolute right-2 top-2', !open && 'rotate-180')}
          onClick={() => setIsOpen(!open)}
        ></ChevronLeftIcon>

        <div
          className={clsx(
            'absolute top-12 inline-flex ',
            open && 'left-10',
            !open && 'left-2 mt-4'
          )}
        >
          <Link href={'/'}>
            <Image src={logo_head} alt="Hero Image"></Image>
          </Link>
        </div>
        {/* +++++++++++++++++++++++ */}
        <div className="flex flex-col pt-36">
          <div
            className={clsx(
              'relative flex flex-col  w-2/3 ',
              open && 'left-10 gap-3',
              !open && 'left-3'
            )}
          >
            {menuSection.map((item) => (
              <>
                <div
                  className={clsx(
                    'bg-brand-300 h-px opacity-25 inline-flex ',
                    !open && 'pl-3 mt-4'
                  )}
                />
                <div key={item.text} className="flex gap-3 mb-4">
                  <button>
                    <Image
                      src={item.icon}
                      alt="image"
                      className={clsx('inline-flex duration-500', open && 'rotate-[360deg]')}
                    ></Image>
                  </button>

                  <button
                    className={clsx('text-brand-300 font-semibold text-xs ', !open && 'hidden ')}
                  >
                    {item.text}
                  </button>
                </div>
              </>
            ))}
            <div className={clsx('relative flex flex-col ', open && 'gap-3')}>
              {profile_logout.map((item) => (
                <>
                  <div
                    className={clsx(
                      'bg-brand-300 h-px opacity-25 inline-flex ',
                      !open && 'pl-3 mt-4'
                    )}
                  />
                  <div key={item.text} className="flex gap-3 mb-4">
                    <button>
                      <Image
                        src={item.icon}
                        alt="image"
                        className={clsx('inline-flex duration-500', open && 'rotate-[360deg]')}
                      ></Image>
                    </button>

                    <button
                      className={clsx('text-brand-300 font-semibold text-xs ', !open && 'hidden ')}
                    >
                      {item.text}
                    </button>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MenuSection
