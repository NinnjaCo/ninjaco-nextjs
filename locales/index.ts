import englishTranslations from '@/locales/en'
import frenchTranslations from '@/locales/fr'

export type translationElement = JSX.Element | string

export interface WebsiteTranslations {
  
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