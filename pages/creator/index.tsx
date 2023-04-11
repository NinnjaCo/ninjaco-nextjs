import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import CoursesComponent from '@/components/creator/coursesComponent'
import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'
import Image from 'next/image'
import filter from '@/images/filter.svg'

export default function Home({ user }: { user: User }) {
  return (
    <>
      <Head>
        <title>NinjaCo | Creator Dashboard</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative h-screen w-full">
        <CreatorMenu
          {...{
            isOnCoursePage: true,
            creator: user,
          }}
        />

        <div className="flex flex-row mt-32 justify-between">
          <div className="flex flex-col ml-14 gap-6">
            <div className="text-brand-700 font-semibold  text-base md:text-xl lg:text-2xl ">
              Courses
            </div>
            <div className="flex flex-row gap-10 justify-center">
              <div className="text-sm md:text-base lg:text-lg text-brand"> 210 enties</div>

              <button className="bg-brand-200 flex items-center  pl-2 gap-3 hover:bg-brand-400 text-sm md:text-base lg:text-lg font-semibold w-20 md:w-24 lg:w-28 rounded-md text-brand-500 border-x-2 border-y-2 border-brand-700">
                <Image src={filter} alt="Hero Image " width={17}></Image>
                Filter
              </button>
            </div>
          </div>
          <div className="text-brand-700 font-semibold text-3xl mr-12 ">
            <button className="bg-secondary hover:bg-secondary-300 text-base md:text-lg lg:text-xl font-semibold w-28 h-8 md:w-32 md:h-9 lg:w-40 lg:h-10 rounded-xl text-brand-700 border-x-2 border-y-2 border-brand-700">
              Create course
            </button>
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
