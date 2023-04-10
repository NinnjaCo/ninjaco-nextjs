import { NextURL } from 'next/dist/server/web/next-url'

export const getReadableDateFromISO = (date: string) => {
  const dateObj = new Date(date)
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  return `${day}/${month}/${year}`
}

export const addErrorParamToUrl = (url: NextURL, error: string | undefined) => {
  if (!error) {
    return url
  }
  url.searchParams.set('error', error)
  return url
}

export const getLevelFromPoints = (points: number | undefined) => {
  if (!points) {
    return 1
  }

  return Math.floor((25 + Math.sqrt(625 + 100 * points)) / 50)
}
