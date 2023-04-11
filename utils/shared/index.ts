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

export const getBasePointsFromLevel = (level: number) => {
  if (level <= 1) {
    return 0
  }
  return (Math.pow(50 * level - 25, 2) - 625) / 100
}

export const getLevelProgress = (points: number | undefined) => {
  if (!points) {
    return 0
  }
  const level = getLevelFromPoints(points)
  const basePoints = getBasePointsFromLevel(level)
  const nextLevelPoints = getBasePointsFromLevel(level + 1)
  const levelPoints = points - basePoints
  const levelPointsTotal = nextLevelPoints - basePoints
  return Math.floor((levelPoints / levelPointsTotal) * 100)
}
