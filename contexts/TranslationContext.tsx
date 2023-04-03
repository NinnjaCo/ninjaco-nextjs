import { Locale, WebsiteTranslations, getTranslations, isLocale } from '@/locales'
import { createContext, useMemo } from 'react'
import { useRouter } from 'next/router'

const TranslationsContext = createContext<WebsiteTranslations | undefined>(undefined)

const TranslationsProvider: React.FC<{ initialLocale: Locale; children }> = ({
  initialLocale,
  children,
}) => {
  const router = useRouter()
  const { locale } = router
  const localeToBeUsed = locale && isLocale(locale) ? locale : initialLocale
  const translations: WebsiteTranslations = useMemo(() => {
    return getTranslations(localeToBeUsed)
  }, [localeToBeUsed])

  return (
    <TranslationsContext.Provider value={translations}>{children}</TranslationsContext.Provider>
  )
}

export { TranslationsContext, TranslationsProvider }
