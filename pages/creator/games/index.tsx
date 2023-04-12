import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '../../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { use } from 'react'
import CoursesComponent from '@/components/creator/coursesComponent'
import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'
import Image from 'next/image'

import filter from '@/images/filterIcon.svg'

export default function Home({ user }: { user: User }) {
  const courseComponent = [
    {
      image:
        'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png',
      name: 'Robotics 101',
      mission: '12',
      age: '7 - 12',
    },
    {
      image:
        'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png',
      name: 'Robotics 101',
      mission: '12',
      age: '7 - 12',
    },
    {
      image:
        'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png',
      name: 'Robotics 101',
      mission: '12',
      age: '7 - 12',
    },
    {
      image:
        'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png',
      name: 'Robotics 101',
      mission: '12',
      age: '7 - 12',
    },
    {
      image:
        'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png',
      name: 'Robotics 101',
      mission: '12',
      age: '7 - 12',
    },
    {
      image:
        'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png',
      name: 'Robotics 101',
      mission: '12',
      age: '7 - 12',
    },
    {
      image:
        'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png',
      name: 'Robotics 101',
      mission: '12',
      age: '7 - 12',
    },
    {
      image:
        'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png',
      name: 'Robotics 101',
      mission: '12',
      age: '7 - 12',
    },
    {
      image:
        'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png',
      name: 'Robotics 101',
      mission: '12',
      age: '7 - 12',
    },
  ]
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
        <div className="flex flex-row mt-7 justify-between">
          <div className="flex flex-col ml-14 gap-6">
            <div className="text-brand-700 font-semibold  text-sm md:text-base lg:text-xl ">
              Courses
            </div>
            <div className="flex flex-row gap-10 justify-center">
              <div className="text-xs md:text-sm lg:text-base text-brand"> 210 enties</div>{' '}
              <button className="bg-brand-200 flex items-center  pl-2 gap-3 hover:bg-brand-400 text-xs md:text-sm lg:text-base font-semibold w-20 md:w-24 lg:w-28 rounded-md text-brand-500 border-x-2 border-y-2 border-brand-700">
                <Image src={filter} alt="Hero Image " width={17}></Image>
                Filter
              </button>
            </div>
          </div>
          <div className="text-brand-700 font-semibold  mr-12 ">
            <button className="bg-secondary hover:bg-secondary-300 text-base lg:text-lg font-semibold w-28 h-8 md:w-32 md:h-9 lg:w-40 lg:h-10 rounded-xl text-brand-700 border-x-2 border-y-2 border-brand-700">
              Create course
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-8 items-center mt-7 px-10 place-items-center">
          {courseComponent.map((course) => (
            <CoursesComponent
              key={course.name}
              image={course.image}
              name={course.name}
              mission={course.mission}
              age={course.age}
            />
          ))}
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
