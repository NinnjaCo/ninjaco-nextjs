import {
  BaseSingleInputFieldProps,
  DatePicker,
  DesktopDatePicker,
  FieldSection,
} from '@mui/x-date-pickers'
import { CalendarIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { CircularProgress, TextField } from '@mui/material'
import { Control, Controller, useFormContext } from 'react-hook-form'
import { Input } from './input'
import clsx from 'clsx'
import dayjs, { Dayjs } from 'dayjs'

interface DatePickerProps {
  control: Control<any>
  name: string
  placeholder: string
  label: string
  error: string | undefined
}
const DatePickerWithHookForm: React.FC<DatePickerProps> = ({
  control,
  placeholder,
  name,
  label,
  error,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-brand-500">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="w-full relative">
            <DesktopDatePicker
              onChange={(event) => {
                field.onChange(event)
              }}
              // use || null, because otherwise this component will be uncontrolled, thus we needed to provide a default value
              value={field.value || null}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  sx: {
                    border: '1px solid',
                  },
                  className: clsx(
                    'w-full text-brand-300 placeholder-brand-400 border border-brand-300 rounded-md focus:outline-none focus:ring-brand focus:border-brand sm:text-sm',
                    {
                      'border-error-dark text-error placeholder-error': error,
                    }
                  ),
                  inputProps: {
                    className:
                      'text-brand-500 font-normal font-sans focus:outline-none hover:outline-none',
                    style: { padding: '0.5rem 0rem' },
                  },
                },
                nextIconButton: {
                  className: 'text-brand-500',
                },
                previousIconButton: {
                  className: 'text-brand-500',
                },
                switchViewButton: {
                  className: 'text-brand-500',
                },
                inputAdornment: {
                  position: 'start',
                },
              }}
              slots={{
                openPickerIcon: () => <CalendarIcon className="h-6 w-6s text-brand-400" />,
              }}
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

export default DatePickerWithHookForm