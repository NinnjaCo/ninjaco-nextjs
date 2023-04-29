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
        <title>NinjaCo | Courses</title>
        <meta name="description" content="Explore all courses offered by NinjaCo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative h-screen w-full">
        <UserMenu isOnCoursePage={true} isOnGamesPage={false} user={user}></UserMenu>
        <div className="flex flex-row mt-7 justify-between">
          <div className="flex flex-col mx-6 gap-3 w-full">
            <div className="flex w-full justify-between items-center">
              <div className="text-brand-700 font-semibold text-xl lg:text-2xl">
                {t.Creator.viewCourses.courses}
              </div>
              <div className="text-brand-700 font-semibold w-44 md:w-80 h-fit animate-floatSlow">
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
                    previousStateModifier: () => {
                      return [
                        ...courses.sort((a: any, b: any) => {
                          const courseAType = getTypeOfCourse(a)
                          const courseBType = getTypeOfCourse(b)

                          const aCreatedAt =
                            courseAType === CourseType.course ? a.createdAt : a.course.createdAt
                          const bCreatedAt =
                            courseBType === CourseType.course ? b.createdAt : b.course.createdAt

                          return dayjs(aCreatedAt).isAfter(bCreatedAt) ? -1 : 1
                        }),
                      ]
                    },
                  },
                  {
                    name: t.Creator.games.viewGames.filter.recentlyUpdated as string,
                    previousStateModifier: () => {
                      return [
                        ...courses.sort((a: any, b: any) => {
                          const courseAType = getTypeOfCourse(a)
                          const courseBType = getTypeOfCourse(b)

                          const aUpdatedAt =
                            courseAType === CourseType.course ? a.updatedAt : a.course.updatedAt
                          const bUpdatedAt =
                            courseBType === CourseType.course ? b.updatedAt : b.course.updatedAt

                          return dayjs(aUpdatedAt).isAfter(bUpdatedAt) ? 1 : -1
                        }),
                      ]
                    },
                    setter: setFilteredCourses,
                  },
                  {
                    name: t.Creator.games.viewGames.filter.NameAZ as string,
                    previousStateModifier: () => {
                      return [
                        ...courses.sort((a: any, b: any) => {
                          const courseAType = getTypeOfCourse(a)
                          const courseBType = getTypeOfCourse(b)

                          const aTitle =
                            courseAType === CourseType.course ? a.title : a.course.title
                          const bTitle =
                            courseBType === CourseType.course ? b.title : b.course.title

                          return aTitle.localeCompare(bTitle)
                        }),
                      ]
                    },
                    setter: setFilteredCourses,
                  },
                  {
                    name: 'HTML',
                    previousStateModifier: () => {
                      return courses.filter((course) => {
                        const courseType = getTypeOfCourse(course)
                        if (courseType === CourseType.course) {
                          course = course as Course
                          return course.type === 'HTML'
                        } else {
                          course = course as CourseEnrollment
                          return course.course.type === 'HTML'
                        }
                      })
                    },
                    setter: setFilteredCourses,
                  },
                  {
                    name: 'ARDUINO',
                    previousStateModifier: () => {
                      const filterd = courses.filter((course) => {
                        const courseType = getTypeOfCourse(course)
                        if (courseType === CourseType.course) {
                          course = course as Course
                          return course.type === 'ARDUINO'
                        } else {
                          course = course as CourseEnrollment
                          return course.course.type === 'ARDUINO'
                        }
                      })
                      return filterd
                    },
                    setter: setFilteredCourses,
                  },
                  {
                    name: t.Filter.completed as string,
                    previousStateModifier: () => {
                      return [
                        ...courses.filter((course) => {
                          const courseType = getTypeOfCourse(course)

                          if (courseType === CourseType.enrollment) {
                            course = course as CourseEnrollment

                            if (course.completed) {
                              return course
                            }
                          }
                        }),
                      ]
                    },
                    setter: setFilteredCourses,
                  },
                  {
                    name: t.Filter.notCompleted as string,
                    previousStateModifier: () => {
                      return [
                        ...courses.filter((course) => {
                          const courseType = getTypeOfCourse(course)

                          if (courseType === CourseType.enrollment) {
                            course = course as CourseEnrollment

                            if (!course.completed) {
                              return course
                            }
                          } else {
                            return course
                          }
                        }),
                      ]
                    },
                    setter: setFilteredCourses,
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-8 items-center mt-7 p-10 place-items-center ">
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

  const courseEnrollmentResponse = await new CourseEnrollmentAPI(session).findAll()
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
