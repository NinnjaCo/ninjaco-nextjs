import Footer from '@/components/layout/footer'
import Menu from '@/components/layout/menu'

import Head from 'next/head'
import useTranslation from '@/hooks/useTranslation'

export default function Home() {
  const t = useTranslation()
  const collectInfo = [
    {
      title: t.Copyright.collect1,
    },
    {
      title: t.Copyright.collect2,
    },
    {
      title: t.Copyright.collect3,
    },
    {
      title: t.Copyright.collect4,
    },
  ]

  const useInfo = [
    {
      title: t.Copyright.use1,
    },
    {
      title: t.Copyright.use2,
    },
    {
      title: t.Copyright.use3,
    },
    {
      title: t.Copyright.use4,
    },
  ]
  const shareInfo = [
    {
      title: t.Copyright.share1,
    },
    {
      title: t.Copyright.share2,
    },
    {
      title: t.Copyright.share3,
    },
  ]
  const rightsArr = [
    {
      title: t.Copyright.right1,
    },
    {
      title: t.Copyright.right2,
    },
    {
      title: t.Copyright.right3,
    },
    {
      title: t.Copyright.right4,
    },
    {
      title: t.Copyright.right5,
    },
    {
      title: t.Copyright.right6,
    },
  ]

  return (
    <>
      <Head>
        <title>{t.Copyright.headTitle}</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Menu
        menuOption={{
          isSticky: false,
          logoToUse: 'dark',
          startBackgroundDark: false,
          startButtonDark: true,
          startTextWhite: false,
          startWithBottomBorder: true,
        }}
      />
      <div className="text-brand">
        <div className="mt-12 md:mt-24 lg:mt-32 ml-8 md:ml-12 lg:ml-16 text-4xl / font-bold">
          {t.Copyright.privacy}
        </div>
        <div className="m-8 md:m-12 lg:m-12 ml-8 md:ml-12 lg:ml-16 text-lg font-bold">
          {t.Copyright.updated}
        </div>
        <div className="mx-12 md:mx-12 lg:mx-16 text-s md:text-base">
          {t.Copyright.agreement}
          <div className="my-8">
            {t.Copyright.collectInformation}
            <br></br>
            <div className=" md:ml-8">
              {collectInfo.map((item, index) => (
                <ul className="mb-2 ml-4" key={index}>
                  {item.title}
                </ul>
              ))}
            </div>
          </div>
          <div className="my-8">
            {t.Copyright.useInformation}
            <br></br>
            <div className=" md:ml-8">
              {useInfo.map((item, index) => (
                <ul className="mb-2 ml-4" key={index}>
                  {item.title}
                </ul>
              ))}
            </div>
          </div>
          <div className="my-8">
            {t.Copyright.shareInformation}
            <br></br>
            <div className=" md:ml-8">
              {shareInfo.map((item, index) => (
                <ul className="mb-2 ml-4" key={index}>
                  {item.title}
                </ul>
              ))}
            </div>
          </div>
          <div className="my-8">
            {t.Copyright.rights}
            <br></br>
            <div className=" md:ml-8">
              {rightsArr.map((item, index) => (
                <ul className="mb-2 ml-4" key={index}>
                  {item.title}
                </ul>
              ))}
            </div>
          </div>
          <div className="my-8">{t.Copyright.security}</div>
          <div className="my-8">{t.Copyright.childrenPrivacy}</div>
          <div className="my-8">{t.Copyright.changes}</div>
          <div className="mt-8 pb-16">{t.Copyright.questions}</div>
        </div>
      </div>
      <Footer></Footer>
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
