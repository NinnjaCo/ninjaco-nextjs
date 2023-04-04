import '@/pages/globals.css'
import { Quicksand } from 'next/font/google'
import { TranslationsProvider } from '@/contexts/TranslationContext'
import type { AppProps } from 'next/app'

// TODO: add cookies script
// TODO: add session manager
// TODO: add Reactquery provider and hydration
// TODO: add progress bar on top using NPProgress

const quick_sand = Quicksand({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TranslationsProvider initialLocale={pageProps.initialLocale}>
      <main className={`${quick_sand.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </TranslationsProvider>
  )
}