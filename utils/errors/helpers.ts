import { AuthError, ErrorMessage } from '@/models/shared'
import { AxiosError } from 'axios'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError).response !== undefined
}

export function unWrapAxiosError<T>(error: AxiosError<T>): T | undefined {
  return error.response?.data
}

export function unWrapAuthError(error: AxiosError<AuthError> | undefined): ErrorMessage[] {
  // this is a key value dictionary of errors ==> error?.error.response.errors
  if (error?.response?.data.error.response.errors) {
    return Object.values(error?.response?.data.error.response?.errors).map((message) => ({
      id: 'auth',
      message,
    }))
  }
  // Don't handle non-api responses since they might contain "non frontend"  info
  return [{ id: 'internal', message: 'Something went wrong, please try again later' }]
}

export function isError(error: unknown): error is Error {
  return (error as Error).message !== undefined
}
