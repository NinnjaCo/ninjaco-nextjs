import { TranslationsContext } from '@/contexts/TranslationContext'
import { WebsiteTranslations } from '@/locales'
import { useContext } from 'react'
import englishTranslations from '@/locales/en'

const useTranslation = (): WebsiteTranslations => {
  const ctx = useContext(TranslationsContext)

  if (ctx === undefined) {
    return englishTranslations
  }
  return ctx
}

export default useTranslation
