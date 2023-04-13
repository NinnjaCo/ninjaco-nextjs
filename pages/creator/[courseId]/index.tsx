import { FunnelIcon } from '@heroicons/react/24/outline'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '../../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import Chip from '@/components/shared/chip'
import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'
import Image from 'next/image'
import MissionCard from '@/components/creator/missionCard'

export default function Course({ user }: { user: User }) {
  return (
    <>
      <Head>
        <title>NinjaCo | Course</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full">
        <CreatorMenu isOnCoursePage={true} isOnGamesPage={false} creator={user} />
        <div className="flex gap-4 px-6 my-12 w-full md:flex-row flex-col">
          <div className="w-52 h-32 relative">
            <Image
              className="bg-brand-100 border-2 border-brand-200 rounded-xl w-52 h-32"
              src="https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png"
              style={{
                objectFit: 'contain',
              }}
              fill
              alt="PP"
              priority
            />
          </div>
          <div className="flex flex-col gap-9 w-full">
            <div className="flex justify-between gap-6 items-center">
              <div className=" text-brand font-semibold text-xl md:text-3xl">Robotics 101</div>
              <button className="text-xs  md:text-base font-semibold btn btn-secondary bg-secondary rounded-lg md:rounded-xl text-brand-700 border-brand-700 hover:bg-secondary-800 h-fit">
                Edit Course
              </button>
            </div>
            <div className=" text-brand-500 font-medium text-xs md:text-base w-full">
              This course will lorem ipsum lorem ipsum lorem ipsumThis course will lorem ipsum lorem
              ipsum lorem ipsum
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-2 justify-between px-6 my-6 border-b-2 py-6 border-brand-50">
          <div className="flex flex-col gap-4 border-r-0 md:border-r-2 mr-0 md:mr-12 border-brand-50">
            <div className="flex gap-3 items-center">
              <div className=" text-brand font-medium text-xs md:text-base">Course type:</div>
              <div className="text-brand font-semibold text-sm md:text-lg">ARDUINO</div>
            </div>
            <div className="flex gap-3 items-center w-full flex-wrap">
              <div className=" text-brand font-medium text-xs md:text-base">Age range:</div>
              <Chip text="7+" />
            </div>
            <div className="flex gap-3 items-center w-full flex-wrap">
              <div className=" text-brand font-medium text-xs md:text-base">Course tags:</div>
              <Chip text="Basics" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center w-full flex-wrap">
              <div className=" text-brand font-medium text-xs md:text-base">
                Course prerequisites:
              </div>
              <Chip text="Basic Computer Knowledge" />
            </div>
            <div className="flex gap-3 items-center w-full flex-wrap">
              <div className=" text-brand font-medium text-xs md:text-base">Course objectives:</div>
              <Chip text="Learn about different types of encryption/decryption" />
            </div>
          </div>
        </div>
        <div className="flex flex-col px-6 pb-12 pt-6 gap-6">
          <div className="flex justify-between gap-10">
            <div className="font-semibold text-2xl">Missions</div>
            <button className=" text-xs md:text-base font-semibold btn btn-secondary bg-secondary rounded-lg md:rounded-xl text-brand-700 border-brand-700 hover:bg-secondary-800 h-fit">
              Add Mission
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-brand font-medium text-xs">10 missions</div>
            <button className="btn btn-secondary bg-brand-300 rounded-lg text-brand-700 border-brand-700 hover:bg-brand hover:text-white py-1 px-4 h-fit flex gap-3">
              <FunnelIcon className="w-4 h-4" />
              Filter
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-8 items-center place-items-center">
            <MissionCard
              image="https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png"
              name="hello"
              levels="7"
            />
            <MissionCard
              image="https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png"
              name="hello"
              levels="7"
            />
            <MissionCard
              image="https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png"
              name="hello"
              levels="7"
            />
            <MissionCard
              image="https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png"
              name="hello"
              levels="7"
            />
            <MissionCard
              image="https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png"
              name="hello"
              levels="7"
            />
            <MissionCard
              image="https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png"
              name="hello"
              levels="7"
            />
            <MissionCard
              image="https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png"
              name="hello"
              levels="7"
            />
            <MissionCard
              image="https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png"
              name="hello"
              levels="7"
            />
          </div>
        </div>
      </main>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const { query, req, res } = context

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination:
          (query.redirectTo as string | undefined) || '/auth/signup?error=Token%20Expired',
        permanent: false,
      },
    }
  }

  const response = await new UserApi(session).findOne(session.id)
  if (!response || !response.payload) {
    return {
      props: {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
      },
    }
  }

  return {
    props: {
      user: response.payload,
    },
  }
}
