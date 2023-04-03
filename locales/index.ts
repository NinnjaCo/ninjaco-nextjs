import englishTranslations from '@/locales/en'
import frenchTranslations from '@/locales/fr'

export type translationElement = JSX.Element | string

export interface WebsiteTranslations {
  Menu: {
    about: translationElement
    aboutDescription: translationElement
    courses: translationElement
    coursesDescription: translationElement
    startCoding: translationElement
    signIn: translationElement
    register: translationElement
  }
  fourOhFour: {
    headTitle: translationElement
    title: translationElement
    goBackHome: translationElement
  }
}

// Create locale type support en | fr
export type Locale = 'en' | 'fr'

export const getTranslations = (locale: Locale) => {
  switch (locale) {
    case 'en':
      return englishTranslations
    case 'fr':
      return frenchTranslations
    default:
      return englishTranslations
  }
}

export const isLocale = (locale: string): locale is Locale => {
  return locale === 'en' || locale === 'fr'
}
