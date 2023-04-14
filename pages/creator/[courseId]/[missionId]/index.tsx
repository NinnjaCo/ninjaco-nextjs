import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import Chip from '@/components/shared/chip'
import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const levels = Array.from({ length: 7 }, (_, i) => i + 1)

export default function Course({ user }: { user: User }) {
  return (
    <>
      <Head>
        <title>NinjaCo | Mission</title>
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
              <div className=" text-brand font-semibold text-xl md:text-3xl"> How it works</div>
              <button className="text-xs  md:text-base font-semibold btn btn-secondary bg-secondary rounded-lg md:rounded-xl text-brand-700 border-brand-700 hover:bg-secondary-800 h-fit">
                Edit Mission
              </button>
            </div>
            <div className=" text-brand-500 font-medium text-xs md:text-base w-full">
              This course will lorem ipsum lorem ipsum lorem ipsumThis course will lorem ipsum lorem
              ipsum lorem ipsum
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center w-full flex-wrap px-6 my-8">
          <div className=" text-brand font-medium text-xs md:text-base">Mission Category:</div>
          <Chip text="Robotics" />
        </div>
        <div className="flex flex-col px-6 pb-12 gap-6">
          <div className="flex justify-between gap-10">
            <div className="font-semibold text-2xl">Levels</div>
            <Link
              className=" text-xs md:text-base font-semibold btn btn-secondary bg-secondary rounded-lg md:rounded-xl text-brand-700 border-brand-700 hover:bg-secondary-800 h-fit"
              href={'/creator/blabla/create'}
            >
              Add level
            </Link>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-11 xl:grid-cols-12 w-full gap-8 items-center place-items-center">
            {levels.map((level, index) => (
              <div
                className={`rounded-full w-10 h-10 flex justify-center items-center text-center p-8 text-2xl font-semibold text-brand-800 ${
                  level % 2 === 0 ? 'bg-secondary-300' : 'bg-brand-300'
                }`}
                key={level}
              >
                {level}
              </div>
            ))}
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
