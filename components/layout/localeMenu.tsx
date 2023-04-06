import { GlobeAmericasIcon } from '@heroicons/react/24/outline'
import { Locale } from 'locales'
import { Menu, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'
import clsx from 'clsx'
const LocaleMenu: React.FC<{ colorClassName: string }> = ({ colorClassName }) => {
  const router = useRouter()
  const changeLocale = (locale: Locale) => {
    router.push(router.pathname, router.pathname, { locale })
  }
  return (
    <Menu as="div" className="relative inline-block text-left z-20">
      <div>
        <Menu.Button
          className="inline-flex w-full justify-center rounded-md px-2 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          role="button"
          tabIndex={0}
          aria-label="Change language"
        >
          <GlobeAmericasIcon className={clsx('h-8 w-8', colorClassName)} />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-brand-700 text-white' : 'text-brand-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-brand-600`}
                  onClick={() => changeLocale('en')}
                >
                  English
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-brand-700 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-brand-600`}
                  onClick={() => changeLocale('fr')}
                >
                  French
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default LocaleMenu
