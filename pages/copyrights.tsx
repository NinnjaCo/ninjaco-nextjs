import Menu from '@/components/menu'
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

  return (
    <>
      <Menu isBackgroundLight={true} />
      <div className="mt-24 md:mt-44 lg:mt-80 ml-8 md:ml-12 lg:ml-16 text-4xl / font-bold">
        {t.Copyright.privacy}
      </div>
      <div className="m-8 md:m-12 lg:m-12 ml-8 md:ml-12 lg:ml-16 text-lg font-bold">
        {t.Copyright.updated}
      </div>
      <p className="mx-12 md:mx-12 lg:mx-16 text-s md:text-base">
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
        {/* How We Use Your Information We use your personal information for the following purposes:TO
        Provide Our Services: We use your information to provide our website and services to you,
        such as processing your orders, responding to your inquiries, and customizing our content,
        for you.To Improve Our Website: use your information to improve our website and services,
        such as by analyzing website usage usage and measuring the effectiveness of our marketing
        campaigns. */}
        {/* To Communicate with You: your information to communicate with you about our website and
        services, such as sending you emails about your account or promotions. */}
        {/* To Advertise to You: We may use your information to show you advertisements that are
        relevant to your interests */}
        {/* Sharing Your Information We do not sell, trade, or rent your personal information to third
        parties.We may share your information with the following types of third parties:
        */}
        {/* Service Providers: We may share your information with our service providers, such as payment
        processors, hosting providers, and shipping providers, in order to provide you with our
        services. */}
        {/* Business Partners: We may share your information with our business partners, such as
        advertisers and marketing agencies, in order to show you relevant advertisements. */}
        {/* Law Enforcement: We may share your information with law enforcement agencies or other third
        parties if required by law or to protect our rights or property. */}
        Your Rights You have the following rights regarding your personal information:Access: You
        have the right to access the personal information we have collected about you.Correction:
        You have the right to correct any inaccurate or incomplete personal information we have
        collected about you.Deletion: You have the right to request that we delete your personal
        information.Restriction: You have the right to request that we restrict the processing of
        your personal information.Objection: You have the right to object to the processing of your
        personal information.Portability: You have the right to receive a copy of your personal
        information in a structured, machine-readable format. Security: We take reasonable measures
        to protect your personal information from unauthorized access, disclosure, or destruction.
        However, we cannot guarantee the security of your information as no method of transmission
        over the internet is 100% secure. Children&apos;s Privacy: We do not knowingly collect
        personal information from children under the age of 13.Changes to This Policy: We may update
        this policy from time to time. Any changes will be posted on our website and will become
        effective immediately.If you have any questions or concerns about this policy, please
        contact us.
      </p>
    </>
  )
}
