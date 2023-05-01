import '@/components/nextNProgress'
import '@/pages/globals.css'
import 'prismjs/themes/prism.css'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Caveat, Quicksand } from 'next/font/google'
import { Hydrate } from 'react-query/hydration'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { TranslationsProvider } from '@/contexts/TranslationContext'
import { useMemo, useRef } from 'react'
import Blockly from 'blockly/core'
import Head from 'next/head'
import NextNProgress from '@/components/nextNProgress'
import PageLayout from '@/components/layout/pageLayout'
import SessionManager from '@/components/auth/sessionManager'
import locale from 'blockly/msg/en'
import socialGraphImage from '@/images/socialGraphCardImage.png'
import type { AppProps } from 'next/app'

// TODO: add cookies script
// TODO: add Reactquery provider and hydration
// TODO: add progress bar on top using NPProgress

Blockly.setLocale(locale)

const quick_sand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
})

export const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
})

export default function App({ Component, pageProps }: AppProps) {
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
      <Head>
        {/* Open Graph */}
        <meta property="og:title" content="NinjaCo" />
        <meta property="og:description" content="Empower your child's education" />
        <meta property="og:image" content={socialGraphImage.src} />
        <meta property="og:url" content="https://ninja-co.live" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NinjaCo" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ninjaco" />
        <meta name="twitter:creator" content="@ninjaco" />
        <meta name="twitter:title" content="NinjaCo" />
        <meta name="twitter:description" content="Empower your child's education" />
        <meta name="twitter:image" content={socialGraphImage.src} />
        <meta name="twitter:image:alt" content="NinjaCo" />
      </Head>
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
                <main className={`${quick_sand.variable} font-quicksand ${caveat.variable}`}>
                  <PageLayout>
                    <Component {...pageProps} />
                  </PageLayout>
                </main>
              </TranslationsProvider>
            </LocalizationProvider>
          </Hydrate>
        </QueryClientProvider>
      </SessionManager>
    </>
  )
}
