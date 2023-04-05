import FAQComponent from '@/components/faqComponent'
import Head from 'next/head'
import Menu from '@/components/menu'
import useTranslation from '@/hooks/useTranslation'

export default function FAP_page() {
  const t = useTranslation()
  const faq = [
    {
      question: 'Should i have previous knowledge in programming?',
      answer:
        'No, you do not need to have previous knowledge in programming to learn coding using visual blocks. This approach is designed to be beginner-friendly and accessible to students with no prior coding experience.',
    },
    {
      question: 'Do i need hardware parts?',
      answer:
        'Well depends, for Arduino courses you will need some Arduino parts depending on the course However for other type of courses, you do not need any external hardware parts!',
    },
    {
      question: 'Should i install any other software to connect to the Arduino?',
      answer:
        'No, you do not need to install any additional software to connect to the Arduino if the website or platform you are using provides a built-in feature to connect and program the Arduino with visual blocks. The website or platform should have instructions on how to connect the Arduino and run your code directly without requiring any external software.',
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
        <Menu isBackgroundLight={false} />
        <div className="mt-44 ml-14  font-mono text-lg md:text-xl lg:text-2xl font-bold text-brand">
          <h1>Frequently Asked Questions</h1>
        </div>
        <div className="mt-10 flex flex-col gap-10">
          {/* map through faq array and display the three component */}
          {faq.map((item, index) => (
            <FAQComponent key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </main>
    </>
  )
}
