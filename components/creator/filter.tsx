import { FunnelIcon } from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import clsx from 'clsx'
import useTranslation from '@/hooks/useTranslation'

interface Field {
  name: string
  previousStateModifier: (prev: any) => any
  setter: React.Dispatch<React.SetStateAction<any>>
}

const Filter = ({ filterFields }: { filterFields: Field[] }) => {
  const t = useTranslation()
  return (
    <Menu as="div" className="relative inline-block text-left z-20">
      <div>
        <Menu.Button
          className="inline-flex w-full justify-center text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 btn bg-brand-50 border-[1px] border-brand-200 rounded-md text-brand hover:bg-brand hover:text-white py-1 px-4 h-fit gap-3"
          role="button"
          tabIndex={0}
          aria-label="Change language"
        >
          <FunnelIcon className="w-4 h-4" />
          {t.Filter.filter}
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
        <Menu.Items className="absolute -right-2 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
          {filterFields.map((field: Field, index: number) => {
            return (
              <div className="px-1 py-1 " key={index}>
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={clsx(
                        'bg-white text-brand block w-full text-left px-4 py-2 text-sm hover:bg-brand-300 rounded'
                      )}
                      onClick={() => {
                        if (field.previousStateModifier && field.setter) {
                          field.setter((prev: any) => {
                            return field.previousStateModifier([...prev])
                          })
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label="Sort by newest"
                      onKeyDown={() => {
                        if (field.previousStateModifier && field.setter) {
                          field.setter((prev: any) => {
                            return field.previousStateModifier([...prev])
                          })
                        }
                      }}
                    >
                      {field.name}
                    </div>
                  )}
                </Menu.Item>
              </div>
            )
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default Filter
