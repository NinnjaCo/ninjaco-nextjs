import { Bars3Icon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { useRouter } from 'next-router-mock'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import LocaleMenu from '../layout/localeMenu'
import clsx from 'clsx'
import creator_profile from '@/images/creator_profile.svg'
import logo_black from '@/images/logo_black.svg'
import seperator from '@/images/seperator.svg'

export type MenuStyleOptions = {
  logoToUse: 'light'
  startBackgroundDark: boolean
  startTextWhite: boolean
  isSticky: boolean
  startWithBottomBorder: boolean
  startButtonDark: boolean
}

const CreatorMenu: React.FC<{ menuOption: MenuStyleOptions }> = ({ menuOption }) => {
  const router = useRouter()
  const session = useSession()

  const linkForMenu = [
    {
      name: 'Courses',
      href: '/creator/courses',
    },
    {
      name: 'Games',
      href: '/creator/games',
    },
  ]
  const isUserLoggedIn = () => {
    return session?.status === 'authenticated' && session.data.id
  }

  return (
    <div
      className={clsx(
        'flex justify-between items-center w-full h-fit px-4 md:pl-8 lg:pl-12 pt-2 md:pt-9 pb-2 bg-brand z-10  border-b-2 border-secondary-700',
        {
          'fixed top-0': true,
        }
      )}
      style={{
        backgroundColor: '#ffffff',

        borderBottomColor: ' #C0D2E6',
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
        <Image src={logo_black} alt="Hero Image" fill></Image>
      </div>
      <div className="sm:block hidden">
        <div className="flex gap-2 sm:gap-4 md:gap-8 lg:gap-16 justify-evenly mr-4 md:mr-8 lg:mr-14">
          <button className="hover-underline-animation">
            <Link href={'/creator'} className={clsx('md:text-xl lg:text-2xl  "text-brand-700 ')}>
              Courses
            </Link>
          </button>

          <Image src={seperator} alt="seperator"></Image>

          <button className="hover-underline-animation">
            <Link
              href={'/creator/games'}
              className={clsx('md:text-xl lg:text-2xl  "text-brand-700')}
            >
              Games
            </Link>
          </button>
        </div>
      </div>
      <div className="sm:block hidden">
        <div className=" flex gap-5  items-center">
          {/* add profile pic */}
          <LocaleMenu colorClassName="text-brand-700" />
          <Image src={creator_profile} alt="Hero Image " width={30}></Image>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="flex sm:hidden items-center gap-2">
        <LocaleMenu colorClassName="text-brand-700" />
        <Popover>
          {() => (
            <>
              <Popover.Button
                className="group flex items-center"
                role="button"
                tabIndex={0}
                aria-label="Change language"
              >
                <Bars3Icon className={clsx('w-8 h-8 cursor-pointer text-brand-700')} />
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
                      {linkForMenu.map((item, i) => (
                        <Link
                          key={i}
                          href={item.href}
                          className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        >
                          <div className="ml-4">
                            <p className="text-sm font-medium text-brand-700">{item.name}</p>
                          </div>
                        </Link>
                      ))}
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

export default CreatorMenu
