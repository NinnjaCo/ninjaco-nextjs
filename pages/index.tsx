import Courses from '../public/images/courses.svg'
import Head from 'next/head'
import HeroImage from '@/components/heroImage'
import Image from 'next/image'
import Lego1 from '../public/images/legoYellow.svg'
import Lego2 from '../public/images/legoBlue.svg'
import Menu from '@/components/menu'
import Vector from '../public/images/aboutCircleVector.svg'
import logo_rev from '../public/images/logoPointing.svg'
import missionSection from '../public/missionSection.svg'
import ourMission from '../public/ourMission.svg'
import playStick from '../public/images/playStick.svg'
import soFar from '../public/SoFar.svg'
import trophy from '../public/images/trophy.svg'
import useTranslation from '@/hooks/useTranslation'

export default function Home() {
  const t = useTranslation()

  const whyChooseUs = [
    {
      title: t.LandingPage.About.courses,
      description: t.LandingPage.About.coursesDescription,
      image: Courses,
      alt: t.LandingPage.About.courses as string,
    },
    {
      title: t.LandingPage.About.playForms,
      description: t.LandingPage.About.playFormsDescription,
      image: playStick,
      alt: t.LandingPage.About.playForms as string,
    },
    {
      title: t.LandingPage.About.trophy,
      description: t.LandingPage.About.trophyDescription,
      image: trophy,
      alt: t.LandingPage.About.trophy as string,
    },
  ]
  const ourMissionSection = [
    {
      title: t.LandingPage.Mission.ourMission,
      description: t.LandingPage.Mission.ourMissionDescription,
      image: ourMission,
      alt: t.LandingPage.Mission.ourMission as string,
    },
    {
      title: t.LandingPage.Mission.soFar,
      description: t.LandingPage.Mission.soFarDescription,
      image: soFar,
      alt: t.LandingPage.Mission.soFar as string,
    },
  ]

  return (
    <>
      <Head>
        <title>{t.LandingPage.headTitle}</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full">
        <Menu
          menuOption={{
            logoToUse: 'dark',
            startBackgroundDark: false,
            startTextWhite: true,
          }}
        />
        {/* Hero section */}
        <div className="relative w-full mb-8 md:mb-0">
          <HeroImage />
          {/* Hero content */}
          <div className="absolute flex flex-col w-full z-0 top-[10%]">
            <div className="pl-4 md:pl-8 lg:pl-12 mt-12 md:mt-24 lg:mt-28 flex flex-col gap-8 w-full items-center md:items-start">
              <div className="font-bold text-2xl lg:text-3xl xl:text-4xl text-brand-800 leading-relaxed relative w-fit h-fit">
                {t.LandingPage.Hero.title}
                <div className="absolute -top-2 -right-1 md:-top-3 lg:-top-4 xl:-top-6 md:-right-2 lg:-right-2 xl:-right-3 w-1/3">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 171 102"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M146.103 17.8674C147.756 18.8885 149.203 19.7819 150.649 20.6753C156.642 24.5041 162.119 29.354 166.252 36.1183C171.935 45.1799 172.555 55.3902 167.905 65.4728C165.529 70.7055 162.222 74.7896 158.399 78.3632C150.856 85.2552 142.383 89.5945 133.497 93.0405C120.478 98.018 107.149 100.698 93.6131 101.592C78.9408 102.613 64.3717 101.719 49.8026 98.9114C39.2633 96.997 28.8273 93.9339 19.0113 88.3183C15.1882 86.1486 11.3651 83.3407 8.05867 80.0224C-0.517447 71.2161 -2.37733 57.5598 3.09899 45.4351C5.78548 39.4366 9.60857 34.4591 13.845 30.1198C23.971 19.7819 35.6469 13.2728 48.0461 8.55057C65.095 2.04153 82.4539 -0.638662 100.226 0.127108C112.005 0.637621 123.785 2.04153 135.15 6.12564C138.56 7.27429 141.763 9.06109 145.07 10.5926C145.896 10.9755 146.62 11.6137 147.343 12.2518C149.203 14.0386 149.1 15.5701 147.033 17.2293C146.826 17.4846 146.516 17.6122 146.103 17.8674ZM95.473 6.50852C95.473 6.38089 95.473 6.25327 95.473 6.12564C94.8531 6.12564 94.1298 5.99801 93.5098 5.99801C79.1474 6.12564 64.9917 8.6782 51.1459 13.7833C39.16 18.1227 27.6907 24.2489 17.8747 34.0762C13.9483 38.0327 10.3319 42.3721 7.74869 47.8601C2.99566 58.0703 4.54556 69.174 11.9851 76.3212C14.7749 79.0014 17.8747 81.1711 21.0778 82.9579C29.7573 87.9354 38.9533 90.6156 48.2527 92.6576C61.6852 95.5931 75.221 96.3588 88.7568 95.9759C104.669 95.4654 120.375 92.4024 135.46 86.0209C142.59 82.9579 149.41 79.2566 155.506 73.7686C159.226 70.3227 162.429 66.2386 164.495 61.0058C166.768 55.1349 166.975 49.1364 164.289 43.3931C163.255 41.2234 161.912 39.0537 160.569 37.2669C156.126 31.396 150.753 27.3119 144.76 24.1212C137.32 20.1647 129.674 17.2293 121.718 15.3149C111.179 12.6347 100.536 11.3584 89.8934 14.0386C89.3768 14.1662 88.6535 14.4215 88.2402 14.1662C87.5169 13.6557 86.5869 13.0176 86.3803 12.2518C86.1736 11.486 86.7936 10.2097 87.3102 9.5716C87.9302 8.93346 88.8601 8.6782 89.6867 8.42295C91.6499 7.52955 93.5098 7.01903 95.473 6.50852ZM128.538 10.5926C133.601 12.6347 138.56 14.5491 143.623 16.5912C138.974 12.8899 133.911 11.3584 128.538 10.5926Z"
                      fill="#FCD95B"
                    />
                  </svg>
                </div>
              </div>
              <div className="hidden md:block text-xs text-brand-800 mt-[50%] md:mt-0 w-full md:w-1/3 place-self-start md:place-self-auto">
                {t.LandingPage.Hero.description}
              </div>
              <div className="hidden btn btn-brand max-w-fit md:flex gap-2 rounded-2xl text-base mt-8 md:mt-16">
                <p>{t.LandingPage.Hero.getStarted}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Mobile Continuation of hero section */}
          <div className="block md:hidden bg-brand-500 p-6 md:bg-transparent md:p-0 text-brand-100 text-xs md:text-brand-800 w-full md:w-1/3 md:place-self-auto absolute bottom-0">
            {t.LandingPage.Hero.description}
            <div className="md:hidden btn btn-brand max-w-fit flex gap-2 rounded-2xl text-base mt-8 md:mt-16">
              <p>{t.LandingPage.Hero.getStarted}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-3 h-3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* About section */}
        <div className="w-full grid grid-cols-8 my-16">
          <div className="bg-brand-100 rounded-none md:rounded-3xl lg:rounded-[56px] shadow-lg shadow-brand-300 col-start-1 md:col-start-2 col-span-8 md:col-span-6 relative pb-12 px-6 flex flex-col gap-6 w-full z-0">
            <div className="flex flex-row w-full justify-between items-start relative">
              <div className="relative mt-4">
                <Image src={Lego1} alt="Lego Brick Yellow" className="w-32 md:w-40" />
                <Image src={Lego2} alt="Lego Brick Blue" className="absolute top-full -z-10 w-36" />
              </div>
              <p className="hidden md:block text-xl lg:text-2xl xl:text-3xl font-bold text-brand-700 h-fit w-fit relative mt-12 whitespace-nowrap">
                {t.LandingPage.About.title}
                <Image
                  src={Vector}
                  alt="Circle Platform"
                  className="absolute -bottom-[75%] -right-[1.8%] md:w-36 lg:w-44 xl:w-52"
                />
              </p>
              <Image src={logo_rev} alt="Brand Logo Pointing" className="w-28" />
            </div>
            <div className="w-full flex justify-center">
              <p className="block md:hidden text-xl sm:text-2xl font-bold text-brand-700 h-fit w-fit relative mt-4 whitespace-nowrap">
                {t.LandingPage.About.title}
                <Image
                  src={Vector}
                  alt="Circle Platform"
                  className="absolute -bottom-[75%] -right-[2%] w-36"
                />
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-0 lg:grid-cols-3 w-full divide-x-0 divide-brand-300 divide-solid lg:divide-x-2 items-center mt-12">
              {whyChooseUs.map((item, index) => (
                <div className="flex w-full" key={index}>
                  <div className="flex flex-col gap-4 items-start ml-[25%]">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      style={{
                        backgroundSize: 'cover',
                      }}
                    />
                    <div className="text-xl lg:text-2xl xl:text-3xl font-semibold text-brand z-20 inline-block whitespace-nowrap">
                      <p> {item.title}</p>
                    </div>
                    <div className=" text-xs text-brand-700 z-20 max-w-[75%]">
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full flex justify-end">
              <div className="btn btn-brand flex gap-2 max-w-fit">
                <p>{t.LandingPage.About.joinNow}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {/* Mission section */}
        <div className="flex w-full my-16">
          <div className="flex flex-col gap-12 ml-6 md:ml-12 mr-12">
            {ourMissionSection.map((item, index) => (
              <div className="flex flex-col gap-6" key={index}>
                <div className="flex items-start">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    className="w-16 md:w-28 lg:w-32 mt-0 md:mt-4 lg:mt-12"
                  ></Image>
                  <div className="flex flex-col gap-8 pl-4 md:pt-8 lg:pt-12">
                    <div className="text-xl md:text-2xl lg:text-4xl font-bold text-brand text-start mt-0 md:mt-0 lg:mt-6 whitespace-nowrap">
                      {item.title}
                    </div>
                    <p className="hidden md:block text-xs font-semibold text-brand">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="block md:hidden text-xs font-semibold text-brand">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
          <Image
            src={missionSection}
            alt="Mission Section"
            className="hidden md:block lg:block md:w-56 lg:w-80 lg:w-300 mt-2"
          ></Image>
        </div>
      </main>
    </>
  )
}
