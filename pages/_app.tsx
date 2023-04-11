import '@/components/nextNProgress'
import '@/pages/globals.css'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Hydrate } from 'react-query/hydration'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Quicksand } from 'next/font/google'
import { ReactQueryDevtools } from 'react-query/devtools'
import { TranslationsProvider } from '@/contexts/TranslationContext'
import { useEffect, useMemo, useRef } from 'react'
import NextNProgress from '@/components/nextNProgress'
import PageLayout from '@/components/layout/pageLayout'
import SessionManager from '@/components/auth/sessionManager'
import type { AppProps } from 'next/app'

// TODO: add cookies script
// TODO: add Reactquery provider and hydration
// TODO: add progress bar on top using NPProgress

const quick_sand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
})

export default function App({ Component, pageProps, router }: AppProps) {
  const queryClientRef = useRef<QueryClient>(new QueryClient())

  const dehydratedState = useMemo(() => {
    // If the page does not have dehydratedState then return layout
    if (!pageProps.dehydratedState) {
      return pageProps.layoutDehydratedState
    }
    // Merge the queries to include layout and pageSpecific state
    if (pageProps.layoutDehydratedState) {
      pageProps.dehydratedState.queries.push(...pageProps.layoutDehydratedState.queries)
    }
    return pageProps.dehydratedState
  }, [pageProps])

  return (
    <>
      <NextNProgress
        color="#29375B"
        startPosition={0}
        stopDelayMs={400}
        height={5}
        showOnShallow={true}
      />

      <SessionManager serverSession={pageProps.session}>
        <QueryClientProvider client={queryClientRef.current}>
          <Hydrate state={dehydratedState}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TranslationsProvider initialLocale={pageProps.initialLocale}>
                <main className={`${quick_sand.variable} font-quicksand`}>
                  <PageLayout>
                    <Component {...pageProps} />
                  </PageLayout>
                </main>
              </TranslationsProvider>
            </LocalizationProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </Hydrate>
        </QueryClientProvider>
      </SessionManager>
    </>
  )
}
