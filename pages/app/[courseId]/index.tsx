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
import Alert from '@/components/shared/alert'
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
  const [alertData, setAlertData] = React.useState<{
    message: string
    variant: 'success' | 'info' | 'warning' | 'error'
    open: boolean
  }>({
    message: '',
    variant: 'info',
    open: false,
  })
  const closeAlert = () => {
    setAlertData({ ...alertData, open: false })
  }

  const preventClickOnMission = () => {
    // render the alert

    setAlertData({
      message: t.User.viewCoursePage.enrollCourseToUnlock as string,
      variant: 'error',
      open: true,
    })

    // remove the alert after 3 seconds
    setTimeout(() => {
      setAlertData({ ...alertData, open: false })
    }, 3000)
  }

  const session = useSession()

  const [openDropCourse, setOpenCourse] = React.useState(false)

  const performDropCourse = async () => {
    await new CourseEnrollmentAPI(session.data).delete(getAFieldInCourse(course, '_id'))
    router.push('/app')
  }

  const renderMissionCard = (mission: MissionEnrollment | Mission) => {
    const courseId = getAFieldInCourse(course, '_id')

    if (getTypeOfCourse(course) === CourseType.enrollment) {
      if (getTypeOfMission(mission) === MissionType.enrollment) {
        mission = mission as MissionEnrollment
        return (
          <Link href={`/app/${courseId}/${mission.mission._id}`}>
            <MissionEnrollmentCard mission={mission} />
          </Link>
        )
      } else {
        mission = mission as Mission
        return (
          <Link href={`/app/${courseId}/${mission._id}`}>
            <MissionCard mission={mission} />
          </Link>
        )
      }
    } else {
      mission = mission as Mission
      return (
        <button
          onClick={() => {
            preventClickOnMission()
          }}
        >
          <MissionCard mission={mission} />
        </button>
      )
    }
  }

  const getAFieldInCourse = (course: Course | CourseEnrollment, field: string) => {
    if (getTypeOfCourse(course) === CourseType.course) {
      course = course as Course
      return course[field]
    } else {
      course = course as CourseEnrollment
      return course.course[field]
    }
  }

  const enrollInCourse = async () => {
    try {
      await new CourseEnrollmentAPI(session.data).create({
        courseId: getAFieldInCourse(course, '_id'),
        userId: user._id,
      })
      router.reload()
    } catch (e) {
      console.log(e)
      setAlertData({
        ...alertData,
        message: 'Something went wrong, please try again later',
        variant: 'error',
        open: true,
      })
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
          <ImageCard image={getAFieldInCourse(course, 'image')} />

          <div className="flex flex-col gap-9 w-full">
            <div className="flex justify-between gap-6 items-start md:items-center flex-col md:flex-row">
              <div className=" text-brand font-semibold text-xl md:text-3xl">
                {getAFieldInCourse(course, 'title')}
              </div>
              {/* if the course is a Course, put the enroll button, if it is en enrollment course print hello, if completed put the completed button */}

              <div>
                {getTypeOfCourse(course) === CourseType.course ? (
                  <button
                    className="btn btn-cta text-xs md:text-sm"
                    onClick={() => {
                      enrollInCourse()
                    }}
                  >
                    {t.User.viewCoursePage.enrollCourse}
                  </button>
                ) : getTypeOfCourse(course) === CourseType.enrollment &&
                  (course as CourseEnrollment).completed === false ? (
                  <button
                    className="btn btn-cta bg-error hover:bg-error-dark"
                    onClick={() => setOpenCourse(true)}
                  >
                    {t.User.viewCoursePage.dropCourse}
                  </button>
                ) : (
                  <div className="flex flex-col gap-3 bg-teal-50 rounded-lg px-3 py-2">
                    <div className="flex gap-2 items-center">
                      <CheckCircleIcon className=" h-6 w-6 ml-2 text-teal-600" />
                      <div className=" text-teal-600 font-bold text-xs md:text-base py-2 rounded-md">
                        {t.User.viewCoursePage.courseCompleted}
                      </div>
                    </div>
                    <div className=" flex items-center justify-end gap-2">
                      <PrinterIcon className=" h-5 w-5 ml-2 text-brand" />
                      <Link
                        href={`/app/${getAFieldInCourse(course, '_id')}/certificate`}
                        className=" text-brand font-semibold text-xs md:text-base py-2 rounded-md underline"
                      >
                        {t.User.viewCoursePage.printCertificate}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className=" text-brand-500 font-medium text-xs md:text-base w-full">
              {getAFieldInCourse(course, 'description')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-2 justify-between px-6 my-6 border-b-2 py-6 border-brand-50">
          <div className="flex flex-col gap-4 border-r-0 md:border-r-2 mr-0 md:mr-12 border-brand-50">
            <div className="flex gap-3 items-center text-brand font-medium text-xs md:text-base">
              {t.User.viewCoursePage.courseType}:
              <div className=" text-brand font-medium text-xs md:text-base"></div>
              <div className="text-brand font-semibold text-sm md:text-lg">
                {getAFieldInCourse(course, 'type')}
              </div>
            </div>
            <div className="flex gap-3 items-center w-full flex-wrap">
              <div className=" text-brand font-medium text-xs md:text-base">
                {t.User.viewCoursePage.ageRange}:
              </div>
              {getAFieldInCourse(course, 'ageRange')?.length !== 0 ? (
                getAFieldInCourse(course, 'ageRange').map((age, index) => (
                  <Chip text={age} key={index} />
                ))
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
              {getAFieldInCourse(course, 'preRequisites')?.length !== 0 ? (
                getAFieldInCourse(course, 'preRequisites')?.map((prerequisite, index) => (
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
              {getAFieldInCourse(course, 'objectives')?.length !== 0 ? (
                getAFieldInCourse(course, 'objectives')?.map((objective, index) => (
                  <Chip text={objective} key={index} />
                ))
              ) : (
                <Chip text="None" />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col px-6 pb-12 pt-6 gap-6">
          <div className="flex justify-between flex-col md:flex-row">
            <div className="font-semibold text-2xl">{t.User.viewCoursePage.missions}</div>
            <Alert
              message={alertData.message}
              variant={alertData.variant}
              open={alertData.open}
              close={closeAlert}
            />
          </div>

          <div className="flex gap-4 items-center">
            <div className="text-brand font-medium text-xs">{missions.length ?? 0} missions</div>
            <Filter
              filterFields={[
                {
                  name: t.User.viewCoursePage.newest as string,
                  setter: setFilteredMissions,
                  previousStateModifier: () => {
                    return [
                      ...missions.sort((a, b) => {
                        {
                          const missionAType = getTypeOfMission(a)
                          const missionBType = getTypeOfMission(b)

                          const missionACreatedAt =
                            missionAType === MissionType.enrollment
                              ? (a as MissionEnrollment).mission.createdAt
                              : (a as Mission).createdAt

                          const missionBCreatedAt =
                            missionBType === MissionType.enrollment
                              ? (b as MissionEnrollment).mission.createdAt
                              : (b as Mission).createdAt

                          return dayjs(missionACreatedAt).isAfter(missionBCreatedAt) ? -1 : 1
                        }
                      }),
                    ]
                  },
                },
                {
                  name: t.User.viewCoursePage.oldest as string,
                  previousStateModifier: () => {
                    return [
                      ...missions.sort((a, b) => {
                        {
                          const missionAType = getTypeOfMission(a)
                          const missionBType = getTypeOfMission(b)

                          const missionACreatedAt =
                            missionAType === MissionType.enrollment
                              ? (a as MissionEnrollment).mission.createdAt
                              : (a as Mission).createdAt

                          const missionBCreatedAt =
                            missionBType === MissionType.enrollment
                              ? (b as MissionEnrollment).mission.createdAt
                              : (b as Mission).createdAt

                          return dayjs(missionACreatedAt).isAfter(missionBCreatedAt) ? 1 : -1
                        }
                      }),
                    ]
                  },
                  setter: setFilteredMissions,
                },
                {
                  name: t.User.viewCoursePage.recentlyUpdated as string,
                  previousStateModifier: () => {
                    return [
                      ...missions.sort((a, b) => {
                        {
                          const missionAType = getTypeOfMission(a)
                          const missionBType = getTypeOfMission(b)

                          const missionAUdpatedAt =
                            missionAType === MissionType.enrollment
                              ? (a as MissionEnrollment).mission.updatedAt
                              : (a as Mission).updatedAt

                          const missionBUdpatedAt =
                            missionBType === MissionType.enrollment
                              ? (b as MissionEnrollment).mission.updatedAt
                              : (b as Mission).updatedAt

                          return dayjs(missionAUdpatedAt).isAfter(missionBUdpatedAt) ? -1 : 1
                        }
                      }),
                    ]
                  },
                  setter: setFilteredMissions,
                },
                {
                  name: t.User.viewCoursePage.nameAZ as string,
                  previousStateModifier: () => {
                    return [
                      ...missions.sort((a, b) => {
                        {
                          const missionAType = getTypeOfMission(a)
                          const missionBType = getTypeOfMission(b)

                          const missionAtitle =
                            missionAType === MissionType.enrollment
                              ? (a as MissionEnrollment).mission.title
                              : (a as Mission).title

                          const missionBtitle =
                            missionBType === MissionType.enrollment
                              ? (b as MissionEnrollment).mission.title
                              : (b as Mission).title

                          return missionAtitle.localeCompare(missionBtitle)
                        }
                      }),
                    ]
                  },
                  setter: setFilteredMissions,
                },
                {
                  name: t.User.viewCoursePage.nameZA as string,
                  previousStateModifier: () => {
                    return [
                      ...missions.sort((a, b) => {
                        {
                          const missionAType = getTypeOfMission(a)
                          const missionBType = getTypeOfMission(b)

                          const missionAtitle =
                            missionAType === MissionType.enrollment
                              ? (a as MissionEnrollment).mission.title
                              : (a as Mission).title

                          const missionBtitle =
                            missionBType === MissionType.enrollment
                              ? (b as MissionEnrollment).mission.title
                              : (b as Mission).title

                          return missionBtitle.localeCompare(missionAtitle)
                        }
                      }),
                    ]
                  },
                  setter: setFilteredMissions,
                },
                {
                  name: t.User.viewCoursePage.numberOfmissions as string,
                  previousStateModifier: () => {
                    return [
                      ...missions.sort((a, b) => {
                        {
                          const missionAType = getTypeOfMission(a)
                          const missionBType = getTypeOfMission(b)

                          const missionALevels =
                            missionAType === MissionType.enrollment
                              ? (a as MissionEnrollment).mission.levels
                              : (a as Mission).levels

                          const missionBLevels =
                            missionBType === MissionType.enrollment
                              ? (b as MissionEnrollment).mission.levels
                              : (b as Mission).levels

                          return missionALevels.length > missionBLevels.length ? -1 : 1
                        }
                      }),
                    ]
                  },
                  setter: setFilteredMissions,
                },
                {
                  name: t.User.viewCoursePage.completed as string,
                  previousStateModifier: () => {
                    return [
                      ...missions.filter((misison) => {
                        const missionType = getTypeOfMission(misison)

                        if (missionType === MissionType.enrollment) {
                          misison = misison as MissionEnrollment

                          if (misison.completed) {
                            return misison
                          }
                        }
                      }),
                    ]
                  },
                  setter: setFilteredMissions,
                },
                {
                  name: t.User.viewCoursePage.notCompleted as string,
                  previousStateModifier: () => {
                    return [
                      ...missions.filter((misison) => {
                        const missionType = getTypeOfMission(misison)

                        if (missionType === MissionType.enrollment) {
                          misison = misison as MissionEnrollment

                          if (!misison.completed) {
                            return misison
                          }
                        } else {
                          return misison
                        }
                      }),
                    ]
                  },
                  setter: setFilteredMissions,
                },
              ]}
            />
          </div>
          {filteredMissions.length !== 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-8 items-start place-items-center">
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

  const course = await new CourseEnrollmentAPI(session).findByCourseId(courseId)

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

  const missions = await new MissionEnrollmentApi(courseId, session).findAll()

  if (!missions || !missions.payload) {
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
      missions: missions.payload,
    },
  }
}
