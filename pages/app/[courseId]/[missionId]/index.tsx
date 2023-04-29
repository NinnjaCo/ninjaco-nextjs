import { Category } from '@/models/crud/category.model'
import { CategoryApi } from '@/utils/api/category/category.api'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { ClockIcon } from '@heroicons/react/24/outline'
import { Course } from '@/models/crud/course.model'
import { CourseEnrollment } from '@/models/crud/course-enrollment.model'
import { CourseEnrollmentAPI } from '@/utils/api/courseEnrollment/course-enrollment.api'
import { Level } from '@/models/crud/level.model'
import { LevelEnrollment } from '@/models/crud/level-enrollment.model'
import { LevelEnrollmentApi } from '@/utils/api/levelEnrollment/level-enrollment.api'
import { Mission } from '@/models/crud/mission.model'
import { MissionEnrollment } from '@/models/crud/mission-enrollment.model'
import { MissionEnrollmentApi } from '@/utils/api/missionEnrollment/mission-enrollment.api'
import { User } from '@/models/crud'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getReadableDateFromISO } from '@/utils/shared'
import { getServerSession } from 'next-auth'
import { useMemo } from 'react'
import { useSession } from 'next-auth/react'
import Chip from '@/components/shared/chip'
import Head from 'next/head'
import ImageCard from '@/components/creator/imageCard'
import Link from 'next/link'
import UserMenu from '@/components/user/userMenu'
import clsx from 'clsx'
import router from 'next/router'
import useTranslation from '@/hooks/useTranslation'

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

const getAFieldInMission = (mission: Mission | MissionEnrollment, field: string) => {
  if (getTypeOfMission(mission) === MissionType.mission) {
    mission = mission as Mission
    return mission[field]
  } else {
    mission = mission as MissionEnrollment
    return mission.mission[field]
  }
}

interface LevelComponent {
  level: Level
  locked: boolean
  completed: boolean
}

export default function UserMissionPage({
  user,
  mission,
  course,
  missionCategory,
}: {
  user: User
  mission: Mission | MissionEnrollment
  course: CourseEnrollment
  missionCategory: Category
}) {
  const session = useSession()
  const t = useTranslation()

  const startMission = async () => {
    const missionType = getTypeOfMission(mission)
    if (missionType === MissionType.enrollment) {
      return
    }

    const typedMission = mission as Mission
    try {
      // start the mission
      await new MissionEnrollmentApi(course.course._id, session.data).create({
        missionId: typedMission._id,
      })

      // start the first level since the mission is started
      await new LevelEnrollmentApi(course.course._id, typedMission._id, session.data).create({
        levelId: typedMission.levels[0]._id,
      })

      router.push(`/app/${course.course._id}/${typedMission._id}/${typedMission.levels[0]._id}`)
    } catch (e) {
      console.log(e)
    }
  }

  const levels: LevelComponent[] = useMemo(() => {
    const missionType = getTypeOfMission(mission)
    const levels = getAFieldInMission(mission, 'levels')

    if (missionType === MissionType.mission) {
      return levels.map((level) => {
        return {
          level,
          locked: true,
          completed: false,
        }
      })
    }

    // Here we are sure that the mission is of type enrollment
    const levelsWhoThisUserHaveProgressIn = (mission as MissionEnrollment).levels

    return levels.map((level: Level) => {
      const levelEnrollment = levelsWhoThisUserHaveProgressIn.find(
        (levelEnrollment) => (levelEnrollment.level as unknown as string) === level._id
      )

      if (levelEnrollment) {
        if (levelEnrollment.completed) {
          return {
            level,
            locked: false,
            completed: true,
          }
        }

        return {
          level,
          locked: false,
          completed: false,
        }
      }

      return {
        level,
        locked: true,
        completed: false,
      }
    })
  }, [mission])

  const clickOnLevel = (level: LevelComponent) => {
    // they have not started the mission yet
    if (getTypeOfMission(mission) === MissionType.mission) return
    const missionEnrollment = mission as MissionEnrollment
    if (level.locked) return
    if (level.completed) return
    router.push(`/app/${course.course._id}/${missionEnrollment.mission._id}/${level.level._id}`)
  }
  return (
    <>
      <Head>
        <title>NinjaCo | Mission</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full">
        <UserMenu isOnCoursePage={true} isOnGamesPage={false} user={user} />
        <div className="flex gap-4 px-6 my-12 w-full md:flex-row flex-col">
          <div className="w-52 h-32 relative">
            <ImageCard image={getAFieldInMission(mission, 'image')} />
          </div>
          <div className="flex flex-col gap-9 w-full">
            <div className="flex justify-between gap-6 items-start md:items-center flex-col md:flex-row">
              <div className=" text-brand font-semibold text-xl md:text-3xl">
                {getAFieldInMission(mission, 'title')}
              </div>
              <div>
                {getTypeOfMission(mission) === MissionType.mission ? (
                  <button
                    className="btn btn-cta text-xs md:text-sm"
                    onClick={() => {
                      startMission()
                    }}
                  >
                    {t.User.viewMissionPage.startMission}
                  </button>
                ) : getTypeOfMission(mission) === MissionType.enrollment &&
                  (mission as MissionEnrollment).completed ? (
                  <div className="flex flex-col gap-3 bg-success-light rounded-lg px-3 py-2">
                    <div className=" flex gap-2 items-center">
                      <CheckCircleIcon className=" h-6 w-6 ml-2 text-success-dark" />
                      <div className=" text-success-dark font-bold text-xs md:text-base py-2 rounded-md">
                        {t.User.viewMissionPage.completed}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 bg-brand-200 rounded-lg px-3 py-2">
                    <div className=" flex gap-2 items-center">
                      <ClockIcon className=" h-4 w-4 ml-2 text-brand"></ClockIcon>
                      <div className=" text-brand font-bold text-xs py-2 rounded-md">
                        {t.User.viewMissionPage.startedAt}{' '}
                        {getReadableDateFromISO((mission as MissionEnrollment).startedAt)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className=" text-brand-500 font-medium text-xs md:text-base w-full">
              {getAFieldInMission(mission, 'description')}
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center w-full flex-wrap px-6 my-8">
          <div className=" text-brand font-medium text-xs md:text-base">
            {t.User.viewMissionPage.missionCategory}
          </div>
          <Chip text={missionCategory.categoryName} />
        </div>
        <div className="flex flex-col px-6 pb-12 gap-6">
          <div className="flex justify-between gap-10">
            <div className="font-semibold text-2xl">{t.Creator.viewMissionPage.levels}</div>
          </div>

          {levels.length !== 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-11 xl:grid-cols-12 w-full items-center place-items-center">
              {levels.map((level, index) => (
                <button
                  className={clsx(
                    'rounded-full w-16 h-16 flex justify-center items-center text-center text-2xl font-semibold text-brand shadow-inner relative',
                    {
                      'bg-brand-300 shadow-brand-400 hover:bg-brand-400':
                        level.level.levelNumber % 2 === 0 && !level.locked,
                      'bg-secondary-300 shadow-secondary-900 hover:bg-secondary':
                        level.level.levelNumber % 2 !== 0 && !level.locked,
                      'bg-gray-400 shadow-none text-brand-800 cursor-not-allowed hover:bg-gray-400':
                        level.locked && level.level.levelNumber % 2 === 0,
                      'bg-gray-300 shadow-none text-brand-800 cursor-not-allowed hover:bg-gray-300':
                        level.locked && level.level.levelNumber % 2 !== 0,
                    }
                  )}
                  key={index}
                  onClick={() => {
                    clickOnLevel(level)
                  }}
                >
                  {level.completed ? (
                    <div className="bg-success-dark stroke-2 rounded-full w-6 h-6 flex items-center justify-center text-white absolute top-1 right-1 text-xs">
                      ✓
                    </div>
                  ) : null}
                  {level.level.levelNumber}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-brand-500 font-medium text-xs md:text-base w-full">
              {t.User.htmlLevel.nolevel}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const { query, req, res } = context

  const { courseId, missionId } = query

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
      redirect: {
        destination: '/app',
        permanent: false,
      },
    }
  }

  if (!('course' in course.payload)) {
    // not an enrollment course
    return {
      redirect: {
        destination: '/app',
        permanent: false,
      },
    }
  }

  const mission = await new MissionEnrollmentApi(courseId, session).findMissionById(missionId)

  if (!mission || !mission.payload) {
    return {
      redirect: {
        destination: '/app',
        permanent: false,
      },
    }
  }

  const missionCategory = await new CategoryApi(session).findOne(
    getAFieldInMission(mission.payload, 'categoryId')
  )

  if (!missionCategory || !missionCategory.payload) {
    return {
      redirect: {
        destination: '/app',
        permanent: false,
      },
    }
  }

  const missionType = getTypeOfMission(mission.payload)
  const actualLevels = []

  return {
    props: {
      user: session.user,
      mission: mission.payload,
      course: course.payload,
      missionCategory: missionCategory.payload,
    },
  }
}
