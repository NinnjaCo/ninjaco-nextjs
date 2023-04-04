import Courses from '../public/images/courses.svg'
import Head from 'next/head'
import HeroImage from '@/components/heroImage'
import Image from 'next/image'
import Lego1 from '../public/images/Lego1.svg'
import Lego2 from '../public/images/lego2.svg'
import Menu from '@/components/menu'
import Vector from '../public/images/Vector.svg'
import logo_rev from '../public/images/logo_rev.svg'
import twemoji_trophy from '../public/images/twemoji_trophy.svg'
import twemoji_video from '../public/images/twemoji_video-game.svg'
import useTranslation from '@/hooks/useTranslation'

export default function Home() {
  const t = useTranslation()

  return (
    <>
      <Head>
        <title>{t.LandingPage.headTitle}</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full">
        <Menu isBackgroundLight={true} />
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

        <div className="flex flex-row justify-center" />
        {/* grey background */}
        <div className="mt-[400px] md:mt-[140px] lg:mt-[140px] ml-56 md:ml-52 lg:ml-64 relative w-[250px] md:w-[600px] lg:w-[865px] h-[850px] md:h-[450px] lg:h-[450px] bg-indigo-100 rounded-[65px] shadow-xl z-0">
          {/* align first 4 elements using flex */}
          <div className="flex flex-row">
            <div className=" hidden lg:flex absolute top-10 left-10">
              <Image src={Lego1} alt="--" />
            </div>
            <p className="absolute hidden md:flex lg:flex md:top-12 lg:top-12 md:left-32 lg:left-52 text-3xl font-semibold text-brand-700 h-fit w-fit ">
              Why choose our platform?
            </p>
            <div className="absolute hidden md:flex lg:flex top-3 md:left-[305px] lg:left-96">
              <Image src={Vector} alt="--" />
            </div>
            <div className="hidden lg:flex absolute left-[675px]">
              <Image src={logo_rev} alt="--" />
            </div>
          </div>

          <div className="hidden lg:flex absolute top-32 left-3">
            <Image src={Lego2} alt="--" />
          </div>

          {/* here i am gonna do flex row, and 3 flex col in it */}
          <div className="flex flex-wrap gap-14 items-center mt-40 justify-center">
            {/* first flex col */}
            <div className="flex flex-col items-center gap-1">
              {/* space intentialy */}
              <div>
                <Image src={Courses} alt="--" width="90" height="45" />
              </div>
              <div className=" text-xl font-semibold text-brand z-20">
                <p> Courses</p>
              </div>
              <div className=" text-xs font-semibold text-brand z-20">
                All kind of courses
                <br />
                tailored by experts
              </div>
            </div>

            {/* second flex col */}
            <div className="flex flex-col items-center gap-1">
              {/* space intentialy */}
              <div>
                <Image src={twemoji_video} alt="--" width="80" height="40" />
              </div>

              <div className=" text-xl font-semibold text-brand z-20 ">
                <p> Playful forms</p>
              </div>

              <div className="text-xs font-semibold text-brand z-20 ">
                We motivate children to
                <br />
                study using visual
                <br />
                programming blocks
              </div>
            </div>

            {/* third flex col */}
            <div className="flex flex-col items-center gap-1 ">
              {/* space intentialy */}
              <div className="mt-2">
                <Image src={twemoji_trophy} alt="--" width="70" height="35" />
              </div>

              <div className=" text-xl font-semibold text-brand z-20">
                <p> Points System</p>
              </div>

              <div className=" text-xs font-semibold text-brand z-20">
                Keep track of your
                <br />
                points and compete with
                <br />
                others
              </div>
            </div>
            <div className="absolute md:right-[248px] lg:right-14 bottom-12 md:bottom-8 lg:bottom-12 btn bg-brand-500 text-white text-xs flex flex-row gap-2 max-w-fit rounded-2xl">
              <p>Join Now</p>
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
      </main>
    </>
  )
}
