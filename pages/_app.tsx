import '@/pages/globals.css'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { Quicksand } from 'next/font/google'
import { TranslationsProvider } from '@/contexts/TranslationContext'
import SessionManager from '@/components/auth/sessionManager'
import type { AppProps } from 'next/app'

// TODO: add cookies script
// TODO: add Reactquery provider and hydration
// TODO: add progress bar on top using NPProgress

const quick_sand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TranslationsProvider initialLocale={pageProps.initialLocale}>
        <SessionManager serverSession={pageProps.session}>
          <main className={`${quick_sand.variable} font-quicksand`}>
            <Component {...pageProps} />
          </main>
        </SessionManager>
      </TranslationsProvider>
    </LocalizationProvider>
  )
}
