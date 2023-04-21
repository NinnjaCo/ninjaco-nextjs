import { Course } from '@/models/crud/course.model'
import { CourseEnrollment } from '@/models/crud/course-enrollment.model'
import { CourseEnrollmentAPI } from '@/utils/api/courseEnrollment/course-enrollment.api'
import { GameEnrollmentAPI } from '@/utils/api/game-enrollment/game-enrollment.api'
import { User } from '@/models/crud'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import CourseCard from '@/components/creator/courseCard'
import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import enrollmentCourseCard from '@/components/user/course/enrollmentCourseCard'

enum CourseType {
  enrollment = 'enrollment',
  course = 'course',
}
const getTypeOfCourse = (course: CourseEnrollment | Course): CourseType => {
  if ((course as CourseEnrollment).course) {
    return CourseType.enrollment
  } else {
    return CourseType.course
  }
}

export default function MainApp({
  user,
  courses,
}: {
  user: User
  courses: (CourseEnrollment | Course)[]
}) {
  //  fix routesss !!!!!!
  const renderCourseCard = (course: CourseEnrollment | Course) => {
    if (getTypeOfCourse(course) === CourseType.enrollment) {
      course = course as CourseEnrollment
      return (
        <Link href={`/app/courses/${course.course._id}`}>
          <enrollmentCourseCard course={course} />
        </Link>
      )
    } else {
      course = course as Course
      return (
        <Link href={`/app/courses/${course._id}`}>
          <CourseCard course={course} />
        </Link>
      )
    }
  }
  return (
    <>
      <Head>
        <title>User courses page</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative h-screen w-full">
        <CreatorMenu isOnCoursePage={false} isOnGamesPage={true} creator={user} />
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

  const courseEnrollmentResponse = await new CourseEnrollmentAPI(session).findAll(session.user._id)
  if (!courseEnrollmentResponse || !courseEnrollmentResponse.payload) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: session.user,
      games: courseEnrollmentResponse.payload,
    },
  }
}
