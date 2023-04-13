import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { translationElement } from '@/locales'
import React from 'react'
import clsx from 'clsx'

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string | translationElement
  error?: string | undefined
  classes?: { root: string }
  name: string
  StartIcon?: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
      title?: string
      titleId?: string
    } & React.RefAttributes<SVGSVGElement>
  >
  EndIcon?: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
      title?: string
      titleId?: string
    } & React.RefAttributes<SVGSVGElement>
  >
  isRequired?: boolean
}

// eslint-disable-next-line react/display-name
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ classes, className, label, error, name, StartIcon, EndIcon, isRequired, ...others }, ref) => (
    <div className={classes?.root}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-brand-500">
          {label} {isRequired && <span className="text-error">*</span>}
        </label>
      )}
      <div className="relative mt-1 rounded-md shadow-sm">
        {StartIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <StartIcon className="w-5 h-5 text-brand-400" aria-hidden="true" />
          </div>
        )}
        <input
          ref={ref}
          name={name}
          type="text"
          autoComplete="off"
          className={clsx(
            'block w-full px-4 py-2 text-brand-700 placeholder-brand-400 border border-brand-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm',
            error &&
              'text-error-dark pr-10 placeholder-error border-error focus:ring-error-dark focus:border-error-dark',
            StartIcon && 'pl-10',
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
        {EndIcon && !error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <EndIcon className="w-5 h-5" aria-hidden="true" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-error" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  )
)
