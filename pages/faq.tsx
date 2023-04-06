import FAQComponent from '@/components/faqComponent'
import Footer from '@/components/layout/footer'
import Head from 'next/head'
import Menu from '@/components/layout/menu'
import useTranslation from '@/hooks/useTranslation'

export default function FAP_page() {
  const t = useTranslation()
  const faq = [
    {
      question: t.Faq.question1 as string,
      answer: t.Faq.answer1 as string,
    },
    {
      question: t.Faq.question2 as string,
      answer: t.Faq.answer2 as string,
    },
    {
      question: t.Faq.question3 as string,
      answer: t.Faq.answer3 as string,
    },
    {
      question: t.Faq.question4 as string,
      answer: t.Faq.answer4 as string,
    },
  ]
  return (
    <>
      <Head>
        <title>{t.LandingPage.headTitle}</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
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
        <div className="mt-32 px-7 md:px-14 font-bold text-lg md:text-xl lg:text-2xl text-brand">
          <h1>{t.Faq.headTitle}</h1>
        </div>
        <div className="px-7 md:px-14 mt-14 mb-24 flex flex-col gap-10">
          {/* map through faq array and display the three component */}
          {faq.map((item, index) => (
            <FAQComponent key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {},
  }
}
