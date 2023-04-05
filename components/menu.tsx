import { Bars3Icon } from '@heroicons/react/20/solid'
import { Popover, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import LocaleMenu from '@/components/localeMenu'
import React, { Fragment, RefObject, useMemo } from 'react'
import clsx from 'clsx'
import darkBackgroundLogo from '@/images/logo_white.svg'
import lightBackgroundLogo from '@/images/logo_black.svg'
import useScrollPosition from '@/hooks/useScrollPosition'
import useTranslation from '@/hooks/useTranslation'

const Menu: React.FC<{
  className?: string
  isBackgroundLight: boolean
  aboutRef?: RefObject<HTMLDivElement>
}> = ({ className, isBackgroundLight, aboutRef }) => {
  const t = useTranslation()
  const router = useRouter()
  const scrollPosition = useScrollPosition()
  const linksForMobileMenu = [
    {
      name: t.Menu.about,
      description: t.Menu.aboutDescription,
      href: '#about',
    },
    {
      name: t.Menu.courses,
      description: t.Menu.coursesDescription,
      href: '/courses',
    },
  ]

  // if no isBackgroundLight is passed, use the default logo
  // else if isBackgroundLight is true, use the light background logo only if the scroll position is less than 200
  // else use the dark background logo
  const logoToUse = useMemo(() => {
    return isBackgroundLight === undefined
      ? lightBackgroundLogo
      : isBackgroundLight
      ? scrollPosition.y === undefined || scrollPosition.y < 200
        ? lightBackgroundLogo
        : darkBackgroundLogo
      : darkBackgroundLogo
  }, [scrollPosition.y, isBackgroundLight])

  const getMenuOpacity = () => {
    if (scrollPosition.y === undefined) {
      return 0
    }
    if (scrollPosition.y < 200) {
      return scrollPosition.y / 200
    }
    return 1
  }

  const scrollToAbout = () => {
    if (aboutRef?.current) {
      aboutRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <div
      className={clsx(
        'flex justify-between items-center w-full h-fit px-4 md:pl-8 lg:pl-12 pt-2 md:pt-9 pb-2 fixed top-0 bg-brand z-10  border-b-2 border-secondary-700',
        className
      )}
      style={{
        // backgroundColor is bg-brand
        backgroundColor: isBackgroundLight
          ? `rgba(41,55,91, ${getMenuOpacity()})`
          : 'rgba(41,55,91, 1)',
        // borderBottomColor is border-secondary-700
        borderBottomColor: isBackgroundLight
          ? `rgba(254,209,98, ${getMenuOpacity()})`
          : 'rgba(254,209,98, 1)',
      }}
    >
      <div
        className="w-24 md:w-36 lg:w-40 h-12 relative cursor-pointer"
        onClick={() => {
          router.push('/')
        }}
        tabIndex={0}
        role="button"
        onKeyDown={() => {
          router.push('/')
        }}
      >
        <Image src={logoToUse} alt="Hero Image" fill></Image>
      </div>

      <div className="hidden md:flex justify-evenly md:gap-6 lg:gap-16 items-center">
        <div className="md:text-base lg:text-xl text-brand-50 hover-underline-animation">
          <button onClick={scrollToAbout}> {t.Menu.about}</button>
        </div>
        <Link
          href={'/courses'}
          className="md:text-base lg:text-xl text-brand-50 hover-underline-animation"
        >
          {t.Menu.courses}
        </Link>
        <LocaleMenu />
        <div className="btn border-2 text-sm rounded-xl font-semibold  hover:bg-brand-500 hover:text-white border-brand-200 text-brand-50">
          {t.Menu.startCoding}
        </div>
      </div>
      {/* Mobile menu */}
      <div className="flex md:hidden items-center gap-2">
        <LocaleMenu />
        <Popover>
          {() => (
            <>
              <Popover.Button className="group flex items-center">
                <Bars3Icon className="w-8 h-8 text-brand-100 cursor-pointer" />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-10 right-0">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-brand ring-opacity-5">
                    <div className="relative grid gap-8 bg-brand-50 p-7 lg:grid-cols-2">
                      {linksForMobileMenu.map((item, i) => (
                        <Link
                          key={i}
                          href={item.href}
                          className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        >
                          <div className="ml-4">
                            <p className="text-sm font-medium text-brand-700">{item.name}</p>
                            <p className="text-sm text-brand-500">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="bg-brand-100 p-4 flex items-center justify-between gap-8">
                      <div className="btn btn-brand">{t.Menu.signIn}</div>
                      <div className="btn btn-secondary">{t.Menu.register}</div>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default Menu
