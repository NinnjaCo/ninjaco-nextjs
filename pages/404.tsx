import Head from 'next/head'
import Link from 'next/link'
import Menu from '@/components/menu'
import useTranslation from '@/hooks/useTranslation'

export default function FourOhFour(): React.ReactElement {
  const t = useTranslation()
  return (
    <>
      <Head>
        <title>{t.fourOhFour.headTitle}</title>
      </Head>

      <div className="h-screen flex flex-col">
        <Menu isBackgroundLight={false} />
        <div className="grid items-center h-screen grid-cols-1 justify-items-center pt-24 pb-20 relative flex-auto">
          <h1 className="self-end divide-x-2 divide-black">
            <span className="px-2 font-bold">404</span>
            <span className="px-2">{t.fourOhFour.title}</span>
          </h1>
          <Link href="/" className="self-start my-4 text-sm btn btn-brand">
            {t.fourOhFour.goBackHome}
          </Link>
        </div>
      </div>
    </>
  )
}

export const getStaticProps = async () => {
  return {
    props: {
      // force the browser to reload the page
      // instead of relying on next navigation
      hardLinks: true,
    },
  }
}
