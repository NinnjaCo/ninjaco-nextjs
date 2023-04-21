import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Control, Controller } from 'react-hook-form'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { translationElement } from '@/locales'
import clsx from 'clsx'

interface SelectProps {
  selectList: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  label: string | translationElement
  error: string | undefined
  isRequired?: boolean
  rootClassName?: string
  placeholder?: string
  disabled?: boolean
}

export default function Select({
  name,
  control,
  label,
  error,
  selectList,
  isRequired,
  placeholder,
  rootClassName,
  disabled,
}: SelectProps) {
  return (
    <div className={clsx('flex flex-col gap-2 z-20', rootClassName)}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-brand-500">
          {label} {isRequired && <span className="text-error">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="w-full relative">
            <Listbox
              value={field.value}
              onChange={(e) => {
                field.onChange(e)
              }}
            >
              <div className="relative mt-1">
                <Listbox.Button
                  aria-disabled={disabled}
                  className={clsx(
                    'block w-full px-4 py-2 text-brand-700 placeholder-brand-400 border border-brand-300 rounded-md focus:outline-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm',
                    {
                      'bg-brand-50 cursor-not-allowed': disabled,
                    }
                  )}
                >
                  <span className="block truncate text-left text-brand">
                    {field.value ?? placeholder}
                  </span>
                  {!error && (
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-brand-400" aria-hidden="true" />
                    </span>
                  )}
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  {disabled ? null : (
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-brand ring-opacity-5 focus:outline-none sm:text-sm">
                      {selectList.map((option, optionIdx) => (
                        <Listbox.Option
                          key={optionIdx}
                          className={({ active }) =>
                            clsx(
                              'relative cursor-default select-none m-2 rounded-lg py-2 pl-10 pr-4',
                              {
                                'bg-brand-100 text-brand-700': active,
                              }
                            )
                          }
                          value={option}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={clsx('block truncate font-normal', {
                                  'font-medium': selected,
                                })}
                              >
                                {option}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand">
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  )}
                </Transition>
              </div>
            </Listbox>
            {error && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ExclamationCircleIcon className="w-5 h-5 text-error" aria-hidden="true" />
              </div>
            )}
          </div>
        )}
      ></Controller>

      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  )
}
