import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { animated, useSpring } from 'react-spring'
import { useMeasure } from 'react-use'
import React, { FC } from 'react'
import clsx from 'clsx'

type AlertProps = React.ComponentPropsWithRef<'div'> & {
  variant: 'success' | 'info' | 'warning' | 'error'
  message: string
  className?: string
  open: boolean
  close?: () => void
}

export const Alert: FC<AlertProps> = ({
  variant = 'info',
  message = '',
  className,
  open,
  close,
  ...others
}) => {
  const [ref, { height }] = useMeasure<HTMLDivElement>()

  /**
   * @param {number} keys set to contentHeight so transition can be recalculated
   */

  const styles = useSpring({
    from: { scale: 0, opacity: 0, height: 0 },
    to: async (next) => {
      if (open) {
        await next({ height: height, config: { duration: 100 } })
        await next({ scale: 1, opacity: 1, config: { duration: 300 } })
      } else {
        await next({ scale: 0, opacity: 0, config: { duration: 200 } })
        await next({ height: 0, config: { duration: 50 } })
      }
    },
  })

  return (
    <animated.div
      {...others}
      className={clsx(
        'rounded-md h-0 scale-0 opacity-0',
        variant === 'info' && 'bg-brand-50',
        variant === 'success' && 'bg-success-light',
        variant === 'warning' && 'bg-warning-light',
        variant === 'error' && 'bg-error-light',
        className
      )}
      style={styles}
    >
      <div ref={ref}>
        <div className="p-4">
          <div className="flex items-center text-center align-middle justify-center">
            <div className="flex-shrink-0">
              {variant === 'info' && (
                <InformationCircleIcon className="w-5 h-5 text-brand" aria-hidden="true" />
              )}
              {variant === 'success' && (
                <CheckCircleIcon className="w-5 h-5 text-success-dark" aria-hidden="true" />
              )}
              {variant === 'warning' && (
                <ExclamationCircleIcon className="w-5 h-5 text-warning-dark" aria-hidden="true" />
              )}
              {variant === 'error' && (
                <CheckCircleIcon className="w-5 h-5 text-error-dark" aria-hidden="true" />
              )}
            </div>
            <div className="ml-3">
              <p
                className={clsx(
                  'text-sm font-medium text-justify align-middle',
                  variant === 'info' && 'text-brand-700',
                  variant === 'success' && 'text-success-dark',
                  variant === 'warning' && 'text-warning-dark',
                  variant === 'error' && 'text-error-dark'
                )}
              >
                {message}
              </p>
            </div>
            {close && (
              <div className="pl-3 ml-auto">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => close()}
                    type="button"
                    className={clsx(
                      'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                      variant === 'info' &&
                        'bg-brand-100 text-brand hover:bg-brand-300 focus:ring-offset-brand-400 focus:ring-brand-500',
                      variant === 'success' &&
                        'bg-success-light text-success-dark  hover:bg-success  focus:ring-offset-success-light focus:ring-success',
                      variant === 'warning' &&
                        'bg-warning-light text-warning-dark hover:bg-warning focus:ring-offset-warning-light focus:ring-warning',
                      variant === 'error' &&
                        'bg-error-light text-error-dark hover:bg-error focus:ring-offset-error-light focus:ring-error'
                    )}
                  >
                    <span className="sr-only">Dismiss</span>
                    <XMarkIcon className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </animated.div>
  )
}

export default Alert
