import { AuthError, ErrorMessage } from '@/models/shared'
import { AxiosError } from 'axios'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError).response !== undefined
}

export function unWrapAxiosError<T>(error: AxiosError<T>): T | undefined {
  return error.response?.data
}

export function unWrapAuthError(error: AuthError | undefined): ErrorMessage[] {
  if (typeof error?.message.flatMap !== 'undefined') {
    return error?.message?.flatMap((x) => x.messages)
  }
  // Don't handle non-api responses since they might contain "non frontend"  info
  return [{ id: 'internal', message: 'Something Went Wrong' }]
}

export function isError(error: unknown): error is Error {
  return (error as Error).message !== undefined
}
