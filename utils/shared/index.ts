export const getReadableDateFromISO = (date: string) => {
  const dateObj = new Date(date)
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  return `${day}/${month}/${year}`
}

export const addErrorParamToUrl = (url: string, error: string) => {
  // replace all spaces with %20
  error = error.replace(/ /g, '+')
  console.log('error', error)
  return `${url}?error=${error}`
}
