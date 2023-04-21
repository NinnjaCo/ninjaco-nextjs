import { Course } from '@/models/crud/course.model'
import { CourseEnrollment } from '@/models/crud/course-enrollment.model'
import { CourseEnrollmentAPI } from '@/utils/api/courseEnrollment/course-enrollment.api'
import { User } from '@/models/crud'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import CourseCard from '@/components/creator/courseCard'
import CreatorMenu from '@/components/creator/creatorMenu'
import EnrollmentCourseCard from '@/components/user/course/enrollmentCourseCard'
import Filter from '@/components/creator/filter'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import UserMenu from '@/components/user/userMenu'
import dayjs from 'dayjs'
import twoBlocksWithRobot from '@/images/twoBlocksRobotAnimated.gif'
import useTranslation from '@/hooks/useTranslation'

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
  const [filteredCourses, setFilteredCourses] =
    React.useState<(CourseEnrollment | Course)[]>(courses)
  const t = useTranslation()
  //  fix routesss !!!!!!
  const renderCourseCard = (course: CourseEnrollment | Course) => {
    if (getTypeOfCourse(course) === CourseType.enrollment) {
      course = course as CourseEnrollment
      return (
        <Link href={`/app/${course.course._id}`}>
          <EnrollmentCourseCard course={course} />
        </Link>
      )
    } else {
      course = course as Course
      return (
        <Link href={`/app/${course._id}`}>
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
        {/* userMenu */}
        <UserMenu isOnCoursePage={true} isOnGamesPage={false} user={user}></UserMenu>
        <div className="flex flex-row mt-7 justify-between">
          <div className="flex flex-col mx-6 gap-3 w-full">
            <div className="flex w-full justify-between items-center">
              <div className="text-brand-700 font-semibold text-xl lg:text-2xl">
                {t.Creator.viewCourses.courses}
              </div>
              <div className="text-brand-700 font-semibold w-44 md:w-80 h-fit">
                <Image
                  src={twoBlocksWithRobot}
                  alt="Animated Robot"
                  className="w-44 md:w-80 h-fit"
                  sizes="(max-width: 768px) 11rem,
                        20rem"
                  placeholder="blur"
                  blurDataURL={twoBlocksWithRobot.blurDataURL ?? twoBlocksWithRobot.src}
                />
              </div>
            </div>
            <div className="flex gap-10 justify-start items-center">
              <div className="text-base text-brand flex flex-row gap-3">
                <div>{filteredCourses.length}</div>
                <div>{t.Creator.viewCourses.entries} </div>
              </div>{' '}
              <Filter
                filterFields={[
                  {
                    name: t.Creator.games.viewGames.filter.newest as string,
                    setter: setFilteredCourses,
                    sortFunction: (a, b) => (dayjs(a.createdAt).isAfter(b.createdAt) ? -1 : 1),
                  },
                  {
                    name: t.Creator.games.viewGames.filter.recentlyUpdated as string,
                    sortFunction: (a, b) => (dayjs(a.updatedAt).isAfter(b.updatedAt) ? -1 : 1),
                    setter: setFilteredCourses,
                  },
                  {
                    name: t.Creator.games.viewGames.filter.oldest as string,
                    sortFunction: (a, b) => (dayjs(a.createdAt).isAfter(b.createdAt) ? 1 : -1),
                    setter: setFilteredCourses,
                  },
                  {
                    name: t.Creator.games.viewGames.filter.NameAZ as string,
                    sortFunction: (a, b) => (a.title > b.title ? 1 : -1),
                    setter: setFilteredCourses,
                  },
                  {
                    name: t.Creator.games.viewGames.filter.NameZA as string,
                    sortFunction: (a, b) => (a.title > b.title ? -1 : 1),
                    setter: setFilteredCourses,
                  },
                  // set a filter named course type bases on the course type (html or arduino)
                ]}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-8 items-center mt-7 px-10 place-items-center ">
          {filteredCourses.map((course, index) => (
            <div key={index}>{renderCourseCard(course)}</div>
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
      courses: courseEnrollmentResponse.payload,
    },
  }
}
