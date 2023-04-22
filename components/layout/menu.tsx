import { AuthApi } from '@/utils/api/auth'
import { Bars3Icon } from '@heroicons/react/20/solid'
import { Popover, Transition } from '@headlessui/react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import LocaleMenu from '@/components/layout/localeMenu'
import React, { Fragment, RefObject, useCallback } from 'react'
import clsx from 'clsx'
import darkBackgroundLogo from '@/images/logo_white.svg'
import lightBackgroundLogo from '@/images/logo_black.svg'
import useScrollPosition from '@/hooks/useScrollPosition'
import useTranslation from '@/hooks/useTranslation'

export type MenuStyleOptions = {
  logoToUse: 'light' | 'dark'
  startBackgroundDark: boolean
  startTextWhite: boolean
  isSticky: boolean
  startWithBottomBorder: boolean
  startButtonDark: boolean
  aboutRef?: RefObject<HTMLDivElement>
}

const Menu: React.FC<{ menuOption: MenuStyleOptions }> = ({ menuOption }) => {
  const SCROLL_BREAKPOINT = 150

  const t = useTranslation()
  const router = useRouter()
  const scrollPosition = useScrollPosition()
  const session = useSession()
  const linksForMobileMenu = [
    {
      name: t.Menu.about,
      description: t.Menu.aboutDescription,
      href: '/#about',
    },
    {
      name: t.Menu.courses,
      description: t.Menu.coursesDescription,
      href: '/app',
    },
  ]

  const logoToUse = useCallback(() => {
    if (menuOption.logoToUse === 'dark') {
      if (scrollPosition.y === undefined) {
        return lightBackgroundLogo
      }
      if (scrollPosition.y > SCROLL_BREAKPOINT) {
        return darkBackgroundLogo
      }
      return lightBackgroundLogo
    }
    return darkBackgroundLogo
  }, [scrollPosition.y, menuOption])

  const getMenuOpacity = useCallback(() => {
    // Returns a  value between 0 and 1 depending on the scroll position
    if (scrollPosition.y === undefined) {
      return 0
    }
    if (scrollPosition.y < SCROLL_BREAKPOINT) {
      return scrollPosition.y / SCROLL_BREAKPOINT
    }
    return 1
  }, [scrollPosition.y])

  const getTextColorClassName = useCallback(() => {
    if (menuOption.startTextWhite) {
      if (scrollPosition.y === undefined) {
        return 'text-brand-50'
      }
      if (scrollPosition.y > SCROLL_BREAKPOINT) {
        return 'text-brand-50'
      }
      return 'text-brand-50'
    }
    if (scrollPosition.y === undefined) {
      return 'text-brand-700'
    }
    if (scrollPosition.y > SCROLL_BREAKPOINT) {
      return 'text-brand-50'
    }
    return 'text-brand-700'
  }, [scrollPosition.y, menuOption])

  const getButtonColorClassName = useCallback(() => {
    const outlineOnLight = 'border-brand text-brand-700'
    const outlineOnDark = 'border-brand-400 text-brand-50'
    const solidOnLight = 'bg-brand text-brand-100'
    const solidOnDark = 'bg-brand-500 text-brand-50'
    if (menuOption.startBackgroundDark) {
      return menuOption.startButtonDark ? solidOnDark : outlineOnDark
    }
    if (menuOption.startButtonDark) {
      if (scrollPosition.y === undefined) {
        return solidOnLight
      }
      if (scrollPosition.y > SCROLL_BREAKPOINT) {
        return solidOnDark
      }
      return solidOnLight
    }
    if (scrollPosition.y === undefined) {
      return outlineOnLight
    }
    if (scrollPosition.y > SCROLL_BREAKPOINT) {
      return outlineOnDark
    }
    return outlineOnLight
  }, [scrollPosition.y, menuOption])

  const scrollToAbout = () => {
    if (menuOption.aboutRef?.current) {
      menuOption.aboutRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const isUserLoggedIn = () => {
    return session?.status === 'authenticated' && session.data.id
  }

  const clickSignOut = async () => {
    // Delete the refresh token from the database
    const res = await new AuthApi(session.data).logout()

    // dont signout if there is an error
    if (!res || !res.payload) return

    signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <div
      className={clsx(
        'flex justify-between items-center w-full h-fit px-4 md:pl-8 lg:pl-12 pt-2 md:pt-9 pb-2 bg-brand z-10  border-b-2 border-secondary-700',
        {
          'fixed top-0': menuOption.isSticky,
        }
      )}
      style={{
        // backgroundColor is bg-brand
        backgroundColor: menuOption.startBackgroundDark
          ? 'rgba(41,55,91, 1)'
          : `rgba(41,55,91, ${getMenuOpacity()})`,

        // borderBottomColor is border-secondary-700 or border-brand-200
        borderBottomColor: menuOption.startWithBottomBorder
          ? menuOption.startBackgroundDark
            ? 'rgba(254,209,98)'
            : 'rgb(192, 210, 230)'
          : menuOption.startBackgroundDark
          ? 'rgba(254,209,98, 1)'
          : `rgba(254,209,98, ${getMenuOpacity()})`,
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
        <Image src={logoToUse()} alt="Hero Image" fill priority></Image>
      </div>

      <div className="hidden md:flex justify-evenly md:gap-6 lg:gap-16 items-center">
        {menuOption.aboutRef ? (
          <button
            onClick={scrollToAbout}
            className={clsx(
              'md:text-base lg:text-xl hover-underline-animation',
              getTextColorClassName()
            )}
          >
            {t.Menu.about}
          </button>
        ) : (
          <Link
            href={'/#about'}
            className={clsx(
              'md:text-base lg:text-xl hover-underline-animation',
              getTextColorClassName()
            )}
          >
            {t.Menu.about}
          </Link>
        )}
        <Link
          href={'/app'}
          className={clsx(
            'md:text-base lg:text-xl hover-underline-animation',
            getTextColorClassName()
          )}
        >
          {t.Menu.courses}
        </Link>
        <LocaleMenu colorClassName={getTextColorClassName()} />
        <Link
          className={clsx(
            'btn border-2 text-sm rounded-xl font-semibold hover:bg-brand-500',
            getButtonColorClassName()
          )}
          href={'/auth/signup'}
        >
          {t.Menu.startCoding}
        </Link>
      </div>
      {/* Mobile menu */}
      <div className="flex md:hidden items-center gap-2">
        <LocaleMenu colorClassName={getTextColorClassName()} />
        <Popover>
          {() => (
            <>
              <Popover.Button
                className="group flex items-center"
                role="button"
                tabIndex={0}
                aria-label="Change language"
              >
                <Bars3Icon className={clsx('w-8 h-8 cursor-pointer', getTextColorClassName())} />
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
                    <div className="bg-brand-100 p-4 flex justify-center items-center">
                      {isUserLoggedIn() ? (
                        <button
                          className="btn btn-warning justify-self-start flex-1"
                          onClick={clickSignOut}
                        >
                          {t.Menu.signOut}
                        </button>
                      ) : (
                        <>
                          <Link className="btn btn-brand mr-8" href="/auth/signin">
                            {t.Menu.signIn}
                          </Link>
                          <Link className="btn btn-secondary" href="/auth/signup">
                            {t.Menu.register}
                          </Link>
                        </>
                      )}
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
