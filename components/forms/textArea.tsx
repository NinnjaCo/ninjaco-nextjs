import { Control, Controller } from 'react-hook-form'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import React from 'react'
import clsx from 'clsx'

type InputProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  cols: number
  rows: number
  rootClassName?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  label: string
  placeholder: string
  error: string | undefined
  isRequired?: boolean
}
// eslint-disable-next-line react/display-name
export const TextArea = React.forwardRef<HTMLTextAreaElement, InputProps>(
  (
    {
      className,
      cols,
      rows,
      name,
      control,
      label,
      placeholder,
      error,
      rootClassName,
      isRequired,
      ...others
    },
    ref
  ) => {
    return (
      <div className={clsx('flex flex-col gap-2 z-10', rootClassName)}>
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
              <textarea
                ref={ref}
                name={name}
                id={name}
                cols={cols}
                rows={rows}
                {...others}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e)
                }}
                placeholder={placeholder}
                className={clsx(
                  'block w-full px-4 py-2 text-brand-700 placeholder-brand-400 border border-brand-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm',
                  error &&
                    'text-error-dark pr-10 placeholder-error border-error focus:ring-error-dark focus:border-error-dark',
                  className
                )}
                {...others}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={`${name}-error`}
              />
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
)
