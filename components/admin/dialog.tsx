import * as React from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'

type AdminAlertDialog = React.ComponentPropsWithRef<'div'> & {
  title: string
  open: boolean
  close: () => void
  confirm: () => void
  detailsRows?: { label: string; value: string }[]
  backButtonText?: string
  backButtonClassName?: string
  confirmButtonText?: string
  confirmButtonClassName?: string
  rootClassName?: string
}

export const AdminAlertDialog: React.FC<AdminAlertDialog> = ({
  title,
  detailsRows,
  backButtonText,
  backButtonClassName,
  confirmButtonText,
  confirmButtonClassName,
  open,
  close,
  confirm,
  rootClassName,
  children,
}) => {
  return open ? (
    <div className="relative z-40" aria-labelledby={title} role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-brand-700 bg-opacity-75 transition-opacity"></div>

      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full text-center sm:p-0">
          <div
            className={clsx(
              'relative bg-white rounded-lg text-left overflow-hidden break-words shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full',
              rootClassName
            )}
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg leading-6 font-medium text-brand" id="modal-title">
                    {title}
                  </h3>
                  <button
                    className="flex-shrink-0 cursor-pointer flex items-center justify-center z-10 h-8 w-8 rounded bg-brand-100 sm:mx-0"
                    onClick={close}
                  >
                    <XMarkIcon className="h-6 w-6 text-brand" aria-hidden="true" />
                  </button>
                </div>
                {detailsRows && (
                  <div className="grid grid-cols-3">
                    <div className="flex flex-col gap-1">
                      {detailsRows.map((row) => {
                        return (
                          <p className="text-sm text-brand font-medium" key={row.label}>
                            {row.label}
                          </p>
                        )
                      })}
                    </div>
                    <div className="flex flex-col col-span-2">
                      {detailsRows.map((row) => {
                        return (
                          <p className="text-sm text-brand" key={row.value}>
                            {row.value}
                          </p>
                        )
                      })}
                    </div>
                  </div>
                )}
                {children}
              </div>
            </div>
            <div className="bg-brand-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className={clsx(
                  'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm',
                  confirmButtonClassName
                )}
                onClick={confirm}
              >
                {confirmButtonText ?? 'Delete'}
              </button>
              <button
                type="button"
                className={clsx(
                  'mt-3 w-full inline-flex justify-center rounded-md border border-brand-100 shadow-sm px-4 py-2 bg-white text-base font-medium text-brand hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm',
                  backButtonClassName
                )}
                onClick={close}
              >
                {backButtonText ?? 'Go back'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null
}
