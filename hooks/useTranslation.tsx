import { TranslationsContext } from '@/contexts/translationContext'
import { WebsiteTranslations } from '@/locales'
import { useContext } from 'react'

const useTranslation = (): WebsiteTranslations => {
  const ctx = useContext(TranslationsContext)

  if (ctx === undefined) {
    return {} as WebsiteTranslations
  }
  return ctx
}

export default useTranslation
