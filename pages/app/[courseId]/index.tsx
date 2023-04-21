import { Course } from '@/models/crud/course.model'
import { CourseApi } from '@/utils/api/course/course.api'
import { FunnelIcon } from '@heroicons/react/24/outline'
import { Mission } from '@/models/crud/mission.model'
import { User } from '@/models/crud'
import { authOptions } from '../../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { useState } from 'react'
import Chip from '@/components/shared/chip'
import Filter from '@/components/creator/filter'
import Head from 'next/head'
import ImageCard from '@/components/creator/imageCard'
import Link from 'next/link'
import MissionCard from '@/components/creator/missionCard'
import UserMenu from '@/components/user/userMenu'
import dayjs from 'dayjs'
import useTranslation from '@/hooks/useTranslation'

export default function UserCourseView({ user, course }: { user: User; course: Course }) {
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>(course.missions)
  const t = useTranslation()

  return (
    <>
      <Head>
        <title>NinjaCo | View Course</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full">
        <UserMenu isOnCoursePage={true} isOnGamesPage={false} user={user} />
        <div className="flex gap-4 px-6 my-12 w-full md:flex-row flex-col">
          <ImageCard image={course.image} />
          <div className="flex flex-col gap-9 w-full">
            <div className="flex justify-between gap-6 items-center">
              <div className=" text-brand font-semibold text-xl md:text-3xl">{course.title}</div>
              <Link
                className="text-xs  md:text-base font-semibold btn btn-secondary bg-secondary rounded-lg md:rounded-xl text-brand-700 border-brand-700 hover:bg-secondary-800 h-fit"
                href={`/app/${course._id}`}
              >
                {t.User.viewCoursePage.enrollCourse}
              </Link>
            </div>
            <div className=" text-brand-500 font-medium text-xs md:text-base w-full">
              {course.description}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-2 justify-between px-6 my-6 border-b-2 py-6 border-brand-50">
          <div className="flex flex-col gap-4 border-r-0 md:border-r-2 mr-0 md:mr-12 border-brand-50">
            <div className="flex gap-3 items-center text-brand font-medium text-xs md:text-base">
              {t.User.viewCoursePage.courseType}:
              <div className=" text-brand font-medium text-xs md:text-base"></div>
              <div className="text-brand font-semibold text-sm md:text-lg">{course.type}</div>
            </div>
            <div className="flex gap-3 items-center w-full flex-wrap">
              <div className=" text-brand font-medium text-xs md:text-base">
                {t.User.viewCoursePage.ageRange}:
              </div>
              {course.ageRange?.length !== 0 ? (
                course?.ageRange?.map((age, index) => <Chip text={age} key={index} />)
              ) : (
                <Chip text="Not Specified" />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center w-full flex-wrap">
              <div className=" text-brand font-medium text-xs md:text-base">
                {t.User.viewCoursePage.coursePrerequisites}:
              </div>
              {course.preRequisites?.length !== 0 ? (
                course?.preRequisites?.map((prerequisite, index) => (
                  <Chip text={prerequisite} key={index} />
                ))
              ) : (
                <Chip text="None" />
              )}
            </div>
            <div className="flex gap-3 items-center w-full flex-wrap">
              <div className=" text-brand font-medium text-xs md:text-base">
                {t.User.viewCoursePage.courseObjectives}:
              </div>
              {course.objectives?.length !== 0 ? (
                course?.objectives?.map((objective, index) => <Chip text={objective} key={index} />)
              ) : (
                <Chip text="None" />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col px-6 pb-12 pt-6 gap-6">
          <div className="font-semibold text-2xl">{t.User.viewCoursePage.missions}</div>

          <div className="flex gap-4 items-center">
            <div className="text-brand font-medium text-xs">{course.missions.length} missions</div>
            <Filter
              filterFields={[
                {
                  name: 'Newest',
                  setter: setFilteredMissions,
                  sortFunction: (a, b) => (dayjs(a.createdAt).isAfter(b.createdAt) ? -1 : 1),
                },
                {
                  name: 'Recently Updated',
                  sortFunction: (a, b) => (dayjs(a.updatedAt).isAfter(b.updatedAt) ? -1 : 1),
                  setter: setFilteredMissions,
                },
                {
                  name: 'Oldest',
                  sortFunction: (a, b) => (dayjs(a.createdAt).isAfter(b.createdAt) ? 1 : -1),
                  setter: setFilteredMissions,
                },
                {
                  name: 'Name (A-Z)',
                  sortFunction: (a, b) => (a.title > b.title ? 1 : -1),
                  setter: setFilteredMissions,
                },
                {
                  name: 'Name (Z-A)',
                  sortFunction: (a, b) => (a.title > b.title ? -1 : 1),
                  setter: setFilteredMissions,
                },
                {
                  name: 'Number of Levels (Low-High)',
                  sortFunction: (a, b) => (a.levels.length > b.levels.length ? -1 : 1),
                  setter: setFilteredMissions,
                },
              ]}
            />
          </div>
          {filteredMissions.length !== 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-8 items-center place-items-center">
              {filteredMissions.map((mission, index) => (
                <Link href={`/app/${course._id}/${mission._id}`} key={index}>
                  <MissionCard mission={mission} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-brand font-medium text-lg">{t.User.viewCoursePage.noMissions}</div>
          )}
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

  const course = await new CourseApi(session).findOne(courseId)

  if (!course || !course.payload) {
    return {
      props: {
        redirect: {
          destination: '/creator',
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
