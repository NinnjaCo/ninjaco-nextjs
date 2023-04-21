import { AlertDialog } from '@/components/shared/alertDialog'
import { CheckCircleIcon, PrinterIcon } from '@heroicons/react/24/solid'
import { Course } from '@/models/crud/course.model'
import { CourseEnrollment } from '@/models/crud/course-enrollment.model'
import { CourseEnrollmentAPI } from '@/utils/api/courseEnrollment/course-enrollment.api'
import { Mission } from '@/models/crud/mission.model'
import { MissionEnrollment } from '@/models/crud/mission-enrollment.model'
import { MissionEnrollmentApi } from '@/utils/api/missionEnrollment/mission-enrollment.api'
import { User } from '@/models/crud'
import { authOptions } from '../../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import Chip from '@/components/shared/chip'
import Filter from '@/components/creator/filter'
import Head from 'next/head'
import ImageCard from '@/components/creator/imageCard'
import Link from 'next/link'
import MissionCard from '@/components/creator/missionCard'
import MissionEnrollmentCard from '@/components/user/mission/enrollmentMissionCard'
import React from 'react'
import UserMenu from '@/components/user/userMenu'
import dayjs from 'dayjs'
import router from 'next/router'
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

enum MissionType {
  enrollment = 'enrollment',
  mission = 'mission',
}

const getTypeOfMission = (mission: MissionEnrollment | Mission): MissionType => {
  if ((mission as MissionEnrollment).mission) {
    return MissionType.enrollment
  } else {
    return MissionType.mission
  }
}

export default function UserCourseView({
  user,
  course,
  missions,
}: {
  user: User
  course: Course | CourseEnrollment
  missions: (Mission | MissionEnrollment)[]
}) {
  const [filteredMissions, setFilteredMissions] =
    useState<(Mission | MissionEnrollment)[]>(missions)

  const t = useTranslation()

  const session = useSession()

  const [openDropCourse, setOpenCourse] = React.useState(false)

  const performDropCourse = async () => {
    await new CourseEnrollmentAPI(session.data).delete(course._id)
    router.reload()
  }

  const renderMissionCard = (mission: MissionEnrollment | Mission) => {
    if (getTypeOfMission(mission) === MissionType.enrollment) {
      mission = mission as MissionEnrollment
      return (
        <Link href={`/app/missions/${mission.mission._id}`}>
          <MissionEnrollmentCard mission={mission} />
        </Link>
      )
    } else {
      mission = mission as Mission
      return (
        <Link href={`/app/games/${mission._id}`}>
          <MissionCard mission={mission} />
        </Link>
      )
    }
  }

  return (
    <>
      {
        <AlertDialog
          open={openDropCourse}
          close={() => {
            setOpenCourse(false)
          }}
          confirm={performDropCourse}
          title={t.User.viewCoursePage.dropCourseTitle as string}
          message={t.User.viewCoursePage.dropCourseMessage as string}
          confirmButtonText={t.User.viewCoursePage.drop as string}
          backButtonText={t.User.viewCoursePage.cancel as string}
        />
      }
      <Head>
        <title>NinjaCo | View Course</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full">
        <UserMenu isOnCoursePage={true} isOnGamesPage={false} user={user} />
        <div className="flex gap-4 px-6 my-12 w-full md:flex-row flex-col">
          <ImageCard
            image={
              getTypeOfCourse(course) === CourseType.course
                ? (course as Course).image
                : (course as CourseEnrollment).course.image
            }
          />
          <div className="flex flex-col gap-9 w-full">
            <div className="flex justify-between gap-6 items-center">
              <div className=" text-brand font-semibold text-xl md:text-3xl">
                {getTypeOfCourse(course) === CourseType.course
                  ? (course as Course).title
                  : (course as CourseEnrollment).course.title}
              </div>
              {/* if the course is a Course, put the enroll button, if it is en enrollment course print hello, if completed put the completed button */}

              <div>
                {getTypeOfCourse(course) === CourseType.course ? (
                  <button
                    className="text-xs md:text-base font-semibold btn btn-secondary bg-secondary
                                 rounded-lg md:rounded-xl text-brand-700 border-brand-700 hover:bg-secondary-800
                                 h-fit"
                    //on click post to the course enrollment api
                    onClick={async () => {
                      await new CourseEnrollmentAPI(session.data).create({
                        courseId: course._id,
                        userId: user._id,
                      })
                      router.reload()
                    }}
                  >
                    {t.User.viewCoursePage.enrollCourse}
                  </button>
                ) : getTypeOfCourse(course) === CourseType.enrollment &&
                  course.completed === false ? (
                  <button
                    className="text-xs  md:text-base font-semibold btn btn-secondary bg-rose-500 rounded-lg md:rounded-xl text-brand-700 border-brand-700 hover:bg-rose-400 h-fit"
                    onClick={() => setOpenCourse(true)}
                  >
                    {t.User.viewCoursePage.dropCourse}
                  </button>
                ) : (
                  <div className="flex flex-col gap-3 bg-teal-50 rounded-lg px-3 py-2">
                    <div className=" flex gap-3 items-center">
                      <CheckCircleIcon className=" h-6 w-6 ml-2 text-teal-600" />
                      <div className=" text-teal-600 font-bold text-sm md:text-base px-4 py-2 rounded-md">
                        {t.User.viewCoursePage.courseCompleted}
                      </div>
                    </div>
                    <div className=" flex items-center justify-end gap-0">
                      <PrinterIcon className=" h-5 w-5 ml-2 text-brand" />
                      <button className=" text-brand font-semibold text-sm md:text-base px-4 py-2 rounded-md underline">
                        {t.User.viewCoursePage.printCertificate}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className=" text-brand-500 font-medium text-xs md:text-base w-full">
              {getTypeOfCourse(course) === CourseType.course
                ? (course as Course).description
                : (course as CourseEnrollment).course.description}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-2 justify-between px-6 my-6 border-b-2 py-6 border-brand-50">
          <div className="flex flex-col gap-4 border-r-0 md:border-r-2 mr-0 md:mr-12 border-brand-50">
            <div className="flex gap-3 items-center text-brand font-medium text-xs md:text-base">
              {t.User.viewCoursePage.courseType}:
              <div className=" text-brand font-medium text-xs md:text-base"></div>
              <div className="text-brand font-semibold text-sm md:text-lg">
                {' '}
                {getTypeOfCourse(course) === CourseType.course
                  ? (course as Course).type
                  : (course as CourseEnrollment).course.type}
              </div>
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
            <div className="text-brand font-medium text-xs">{missions.length} missions</div>
            <Filter
              filterFields={[
                {
                  name: 'Newest',
                  setter: setFilteredMissions,
                  previousStateModifier: () => {
                    return [
                      ...course.missions.sort((a, b) =>
                        dayjs(a.createdAt).isAfter(b.createdAt) ? -1 : 1
                      ),
                    ]
                  },
                },
                {
                  name: 'Recently Updated',
                  previousStateModifier: () => {
                    return [
                      ...course.missions.sort((a, b) =>
                        dayjs(a.updatedAt).isAfter(b.updatedAt) ? -1 : 1
                      ),
                    ]
                  },
                  setter: setFilteredMissions,
                },
                {
                  name: 'Oldest',
                  previousStateModifier: () => {
                    return [
                      ...course.missions.sort((a, b) =>
                        dayjs(a.createdAt).isAfter(b.createdAt) ? 1 : -1
                      ),
                    ]
                  },
                  setter: setFilteredMissions,
                },
                {
                  name: 'Name (A-Z)',
                  previousStateModifier: () => {
                    return [...course.missions.sort((a, b) => a.title.localeCompare(b.title))]
                  },
                  setter: setFilteredMissions,
                },
                {
                  name: 'Name (Z-A)',
                  previousStateModifier: () => {
                    return [...course.missions.sort((a, b) => b.title.localeCompare(a.title))]
                  },
                  setter: setFilteredMissions,
                },
                {
                  name: 'Number of Levels (Low-High)',
                  previousStateModifier: () => {
                    return [
                      ...course.missions.sort((a, b) =>
                        a.levels.length > b.levels.length ? -1 : 1
                      ),
                    ]
                  },
                  setter: setFilteredMissions,
                },
              ]}
            />
          </div>
          {filteredMissions.length !== 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-8 items-center place-items-center">
              {filteredMissions.map((mission, index) => (
                <div key={index}> {renderMissionCard(mission)}</div>
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

  const course = await new CourseEnrollmentAPI(session).findOne(courseId)

  if (!course || !course.payload) {
    return {
      props: {
        redirect: {
          destination: '/app',
          permanent: false,
        },
      },
    }
  }

  const missions = await new MissionEnrollmentApi(course.payload._id, session).find({
    course: courseId,
  })

  return {
    props: {
      user: session.user,
      course: course.payload,
      mission: missions.payload,
    },
  }
}
