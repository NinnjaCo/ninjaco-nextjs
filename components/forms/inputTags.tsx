import { Control, Controller } from 'react-hook-form'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Input } from './input'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

interface InputTagsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  label: string
  helperText: string
  error: string | undefined
  placeholder: string
  isRequired?: boolean
  formatter?: (s) => string
}

export default function InputTags({
  name,
  helperText,
  control,
  label,
  error,
  placeholder,
  isRequired,
  formatter,
}: InputTagsProps) {
  const [inputState, setInputState] = useState('')
  const usedFormatter = formatter ? formatter : (s) => s
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-brand-500">
          {label} {isRequired && <span className="text-error">*</span>}
        </label>
      )}
      {helperText && <p className="text-xs text-brand-400">{helperText}</p>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="w-full relative flex flex-col gap-2">
            <div className="flex gap-2 w-full justify-between items-center">
              <Input
                name={field.name}
                ref={field.ref}
                value={inputState}
                placeholder={placeholder}
                onChange={(e) => {
                  setInputState(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (inputState === '') return
                    field.onChange([...field.value, usedFormatter(inputState)])
                    setInputState('')
                    e.preventDefault()
                  }
                }}
                classes={{
                  root: 'w-full',
                }}
              />
              <button
                className="btn p-2 rounded-md bg-brand-100 h-fit mt-1"
                onClick={(e) => {
                  e.preventDefault()
                  if (inputState === '') return
                  field.onChange([...field.value, usedFormatter(inputState)])
                  setInputState('')
                }}
              >
                +
              </button>
            </div>
            {field.value?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {field.value.map((tag, index) => (
                  <div
                    className="flex gap-2 items-center justify-center bg-brand-100 rounded-2xl px-4 py-1"
                    key={index}
                  >
                    <p className="text-sm">{tag}</p>
                    <button
                      className="text-brand px-1"
                      onClick={(e) => {
                        field.onChange([
                          ...field.value.slice(0, index),
                          ...field.value.slice(index + 1),
                        ])
                        e.preventDefault()
                      }}
                    >
                      <XMarkIcon className="text-brand-500 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
