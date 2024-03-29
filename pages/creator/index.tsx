import { Course } from '@/models/crud/course.model'
import { CourseApi } from '@/utils/api/course/course.api'
import { FunnelIcon } from '@heroicons/react/24/outline'
import { User } from '@/models/crud'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { useState } from 'react'
import CourseCard from '@/components/creator/courseCard'
import CreatorMenu from '@/components/creator/creatorMenu'
import Filter from '@/components/creator/filter'
import Head from 'next/head'
import Link from 'next/link'
import dayjs from 'dayjs'
import useTranslation from '@/hooks/useTranslation'

export default function Home({ user, courses }: { user: User; courses: Course[] }) {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses)
  const t = useTranslation()
  return (
    <>
      <Head>
        <title>NinjaCo | Courses</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="relative h-screen w-full">
        <CreatorMenu isOnCoursePage={true} isOnGamesPage={false} creator={user} />
        <div className="flex flex-row mt-7 justify-between">
          <div className="flex flex-col mx-6 gap-6 w-full">
            <div className="flex w-full justify-between items-center">
              <div className="text-brand-700 font-semibold text-xl lg:text-2xl">
                {t.Creator.viewCourses.courses}
              </div>
              <div className="text-brand-700 font-semibold">
                <Link className="btn btn-cta" href="/creator/create">
                  {t.Creator.viewCourses.createCourse}
                </Link>
              </div>
            </div>
            <div className="flex gap-10 justify-start items-center">
              <div className="text-base text-brand">
                {courses.length} {t.Creator.viewCourses.entries}
              </div>
              <Filter
                filterFields={[
                  {
                    name: 'Newest',
                    setter: setFilteredCourses,
                    previousStateModifier: () => {
                      return [
                        ...courses.sort((a, b) =>
                          dayjs(a.createdAt).isAfter(b.createdAt) ? -1 : 1
                        ),
                      ]
                    },
                  },
                  {
                    name: 'Recently Updated',
                    previousStateModifier: () => {
                      return [
                        ...courses.sort((a, b) =>
                          dayjs(a.updatedAt).isAfter(b.updatedAt) ? -1 : 1
                        ),
                      ]
                    },
                    setter: setFilteredCourses,
                  },
                  {
                    name: 'Oldest',
                    previousStateModifier: () => {
                      return [
                        ...courses.sort((a, b) =>
                          dayjs(a.createdAt).isAfter(b.createdAt) ? 1 : -1
                        ),
                      ]
                    },
                    setter: setFilteredCourses,
                  },
                  {
                    name: 'Name (A-Z)',
                    previousStateModifier: () => {
                      return [...courses.sort((a, b) => a.title.localeCompare(b.title))]
                    },
                    setter: setFilteredCourses,
                  },
                  {
                    name: 'Name (Z-A)',
                    previousStateModifier: () => {
                      return [...courses.sort((a, b) => b.title.localeCompare(a.title))]
                    },
                    setter: setFilteredCourses,
                  },
                  {
                    name: 'Number of Missions',
                    previousStateModifier: () => {
                      return [
                        ...courses.sort((a, b) => (a.missions.length > b.missions.length ? -1 : 1)),
                      ]
                    },
                    setter: setFilteredCourses,
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-8 items-center mt-7 p-10 place-items-center">
          {filteredCourses.map((course, index) => (
            <Link href={`/creator/${course._id}`} key={course._id}>
              <CourseCard course={course} />
            </Link>
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

  const coursesResponse = await new CourseApi(session).find()
  if (!coursesResponse || !coursesResponse.payload) {
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
      courses: coursesResponse.payload,
    },
  }
}
