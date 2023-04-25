import { CourseEnrollment } from '@/models/crud/course-enrollment.model'
import { CourseEnrollmentAPI } from '@/utils/api/courseEnrollment/course-enrollment.api'
import { User } from '@/models/crud'
import { authOptions } from '../../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import logo_black from '@/images/logo_black.svg'
import useDidMount from '@/hooks/useDidMount'
import useTranslation from '@/hooks/useTranslation'

export default function UserCourseView({ user, course }: { user: User; course: CourseEnrollment }) {
  const t = useTranslation()

  // only run on first render, (not twice on server and client)
  useDidMount(() => {
    window.print()
  })

  return (
    <>
      <Head>
        <title>Certificate | NinjaCo | {course.course.title}</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full h-screen">
        <div className="w-full h-full border-[50px]  p-10 border-secondary relative">
          <div className="absolute w-full h-full  background-zigzag3d-pattern top-0 left-0"></div>
          <div className="w-36 md:w-36 lg:w-52 h-24 absolute top-10 left-12 cursor-pointer">
            <Image src={logo_black} alt="Hero Image" fill priority></Image>
          </div>
          <div className="w-full flex flex-col gap-6 items-center justify-center h-full">
            <div className="text-center w-full text-3xl md:text-4xl lg:text-5xl font-medium font-serif">
              Certificate of Completion
            </div>
            <div className="text-center w-full text-xl  font-serif">This is to certify that</div>
            <div className="text-center w-full text-6xl lg:text-7xl font-caveat">
              {user.firstName + ' ' + user.lastName}
            </div>
            <div className="w-1/12 h-1 bg-secondary"></div>
            <div className="text-center w-full text-xl font-serif">
              has successfully completed the course
            </div>
            <div className="text-center w-full text-3xl md:text-4xl lg:text-5xl font-semibold font-serif">
              {course.course.title}
            </div>
            <div className="w-1/6 h-1 bg-secondary"></div>
          </div>
          <div className="w-full flex justify-between items-start">
            <div className="font-serif flex flex-col items-start text-2xs">
              <p>Automatically issued on:</p>
              <p>{new Date().toDateString()}</p>
            </div>
            <div>
              <div className="w-20 md:w-24 lg:w-32 aspect-video max-w-md absolute bottom-12 right-10">
                <Image src="/images/signature.png" alt="signature" className="w-full h-full" fill />
              </div>
              <p>Issued by NinjaCo</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const { query, req, res } = context
  const { courseId } = query

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

  const course = await new CourseEnrollmentAPI(session).findByCourseId(courseId)

  if (!course || !course.payload || !('completed' in course.payload) || !course.payload.completed) {
    return {
      props: {
        redirect: {
          destination: '/app',
          permanent: false,
        },
      },
    }
  }

  return {
    props: {
      user: session.user,
      course: course.payload,
    },
  }
}
