import Menu from '@/components/menu'
import useTranslation from '@/hooks/useTranslation'

export default function Home() {
  const t = useTranslation()
  const collectInfo = [
    {
      title: t.Copyright.collect1,
      //   description: t.Copyright.collect1description,
    },
    {
      title: t.Copyright.collect2,
      //   description: t.Copyright.collect2description,
    },
    {
      title: t.Copyright.collect3,
      //   description: t.Copyright.collect3description,
    },
    {
      title: t.Copyright.collect4,
      //   description: t.Copyright.collect4description,
    },
  ]
  return (
    <>
      <Menu isBackgroundLight={true} />
      <div className="mt-44 mx-12 text-2xl / font-semibold">Privacy Policy</div>
      <div className="m-16 text-lg font-semibold"> Last updated: 03 MARCH 2023 </div>
      <p className="whitespace-pre-line m-16 text-base">
        <strong>
          This privacy policy outlines how NinjaCo collects, uses, and protects your personal
          information. <br></br> By using our website, you agree to the terms of this policy.
        </strong>
        <div className="mt-12">
          {t.Copyright.collectInformation}
          <br></br>
          <div className="ml-8">
            {collectInfo.map((item, index) => (
              <ul key={index}>{item.title}</ul>
            ))}
          </div>
        </div>
        How We Use Your Information We use your personal information for the following purposes:TO
        Provide Our Services: We use your information to provide our website and services to you,
        such as processing your orders, responding to your inquiries, and customizing our content
        for you.To Improve Our Website: use your information to improve our website and services,
        such as by analyzing website usage usage and measuring the effectiveness of our marketing
        campaigns. To Communicate with You: your information to communicate with you about our
        website and services, such as sending you emails about your account or promotions.To
        Advertise to You: We may use your information to show you advertisements that are relevant
        to your interests Sharing Your Information We do not sell, trade, or rent your personal
        information to third parties. We may share your information with the following types of
        third parties:Service Providers: We may share your information with our service providers,
        such as payment processors, hosting providers, and shipping providers, in order to provide
        you with our services.Business Partners: We may share your information with our business
        partners, such as advertisers and marketing agencies, in order to show you relevant
        advertisements.Law Enforcement: We may share your information with law enforcement agencies
        or other third parties if required by law or to protect our rights or property.Your Rights
        You have the following rights regarding your personal information:Access: You have the right
        to access the personal information we have collected about you.Correction: You have the
        right to correct any inaccurate or incomplete personal information we have collected about
        you.Deletion: You have the right to request that we delete your personal
        information.Restriction: You have the right to request that we restrict the processing of
        your personal information.Objection: You have the right to object to the processing of your
        personal information.Portability: You have the right to receive a copy of your personal
        information in a structured, machine-readable format. Security: We take reasonable measures
        to protect your personal information from unauthorized access, disclosure, or destruction.
        However, we cannot guarantee the security of your information as no method of transmission
        over the internet is 100% secure. Children's Privacy: We do not knowingly collect personal
        information from children under the age of 13.Changes to This Policy: We may update this
        policy from time to time. Any changes will be posted on our website and will become
        effective immediately.If you have any questions or concerns about this policy, please
        contact us.
      </p>
    </>
  )
}
