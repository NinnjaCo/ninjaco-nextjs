import { Bars3Icon, BookOpenIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { User } from '@/models/crud'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import LocaleMenu from '../layout/localeMenu'
import clsx from 'clsx'
import logo_black from '@/images/logo_black.svg'
import useTranslation from '@/hooks/useTranslation'
import useUserProfilePicture from '@/hooks/useUserProfilePicture'

interface UserMenuPros {
  isOnCoursePage: boolean
  isOnGamesPage: boolean
  user: User
}
const UserMenu = ({ isOnCoursePage, user, isOnGamesPage }: UserMenuPros) => {
  const profilePhoto = useUserProfilePicture(user)
  const session = useSession()
  const t = useTranslation()
  const linkForMenu = [
    {
      name: 'Courses',
      icon: BookOpenIcon,
      href: '/app',
    },
    {
      name: 'Games',
      icon: PuzzlePieceIcon,
      href: '/app/games',
    },
    {
      name: 'Profile',
      icon: () => {
        return (
          <Image
            className="rounded-full bg-white border-2 border-brand w-9 h-9"
            src={session?.data?.user?.profilePicture || profilePhoto.profilePic}
            width={45}
            height={45}
            alt="PP"
          />
        )
      },
      href: '/app/profile',
    },
  ]

  return (
    <div
      className={clsx(
        'flex justify-between items-center w-full h-fit px-6 py-6 bg-brand z-10  border-b-2 border-secondary-700',
        {
          'fixed top-0': false,
        }
      )}
      style={{
        backgroundColor: '#ffffff',

        borderBottomColor: ' #C0D2E6',
      }}
    >
      <Link className="w-24 md:w-36 lg:w-40 h-12 relative cursor-pointer" href="/">
        <Image src={logo_black} alt="Hero Image" fill priority></Image>
      </Link>
      <div className="sm:block hidden">
        <div className="flex gap-6 justify-between">
          <button className="hover-underline-animation">
            <Link
              href={'/app'}
              className={clsx('md:text-xl lg:text-2xl text-brand-400', {
                'text-brand-700 font-medium border-b-2 border-secondary-500':
                  isOnCoursePage && !isOnGamesPage,
              })}
            >
              {t.MenuCreator.courses}
            </Link>
          </button>

          <div className="w-[4px] h-8 bg-brand-300 rounded-full"></div>

          <button className="hover-underline-animation">
            <Link
              href={'/app/games'}
              className={clsx('md:text-xl lg:text-2xl text-brand-400', {
                'text-brand-700 font-medium border-b-2 border-secondary-500':
                  isOnGamesPage && !isOnCoursePage,
              })}
            >
              {t.MenuCreator.games}
            </Link>
          </button>
        </div>
      </div>
      <div className="sm:block hidden">
        <div className=" flex gap-5 items-center justify-center">
          {/* add profile pic */}
          <LocaleMenu colorClassName="text-brand-500" />
          <Link href="/app/profile" className="w-9 h-9">
            <Image
              className="rounded-full bg-white border-2 border-brand w-9 h-9"
              src={profilePhoto.profilePic}
              width={45}
              height={45}
              alt="Profile Photo"
              priority
            />
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="flex sm:hidden items-center gap-2">
        <LocaleMenu colorClassName="text-brand-700" />{' '}
        <Popover>
          {() => (
            <>
              <Popover.Button
                className="group flex items-center"
                role="button"
                tabIndex={0}
                aria-label="Change language"
              >
                <Bars3Icon className="w-9 h-9 cursor-pointer text-brand" />
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
                <Popover.Panel className="absolute z-30 right-0 -translate-x-8">
                  <div className="overflow-hidden rounded shadow-lg ring-1 ring-brand ring-opacity-5 bg-brand-50">
                    <div className="relative flex flex-col divide-y-2 divide-brand-300">
                      {linkForMenu.map((item, i) => (
                        <Link
                          key={i}
                          href={item.href}
                          className="px-4 py-4  flex gap-4 items-center transition duration-150 ease-in-out hover:bg-brand-400 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        >
                          <item.icon className="h-7 w-7 text-brand-700" />
                          <p className="text-sm font-medium text-brand-700">{item.name}</p>
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

export default UserMenu
