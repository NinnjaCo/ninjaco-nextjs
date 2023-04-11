import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { use } from 'react'
import CoursesComponent from '@/components/creator/coursesComponent'
import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'

export default function Home({ user }: { user: User }) {
  return (
    <>
      <Head>
        <title>NinjaCo | Creator Dashboard</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full">
        <CreatorMenu isOnCoursePage={false} creator={user} />

        <div className="grid grid-cols-5 gap-4 ">
          <div>
            <CoursesComponent
              image={
                'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png'
              }
              name={'Robotics 101'}
              mission={'12'}
              age={'7 - 12'}
            />
          </div>
          <div>
            <CoursesComponent
              image={
                'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png'
              }
              name={'Robotics 101'}
              mission={'12'}
              age={'7 - 12'}
            />
          </div>
          <div>
            <CoursesComponent
              image={
                'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png'
              }
              name={'Robotics 101'}
              mission={'12'}
              age={'7 - 12'}
            />
          </div>
          <div>
            <CoursesComponent
              image={
                'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png'
              }
              name={'Robotics 101'}
              mission={'12'}
              age={'7 - 12'}
            />
          </div>
          <div>
            <CoursesComponent
              image={
                'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png'
              }
              name={'Robotics 101'}
              mission={'12'}
              age={'7 - 12'}
            />
          </div>
          <div>
            <CoursesComponent
              image={
                'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png'
              }
              name={'Robotics 101'}
              mission={'12'}
              age={'7 - 12'}
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
