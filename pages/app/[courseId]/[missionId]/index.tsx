import { Category } from '@/models/crud/category.model'
import { CategoryApi } from '@/utils/api/category/category.api'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { Course } from '@/models/crud/course.model'
import { CourseEnrollmentAPI } from '@/utils/api/courseEnrollment/course-enrollment.api'
import { Level } from '@/models/crud/level.model'
import { LevelEnrollment } from '@/models/crud/level-enrollment.model'
import { LevelEnrollmentApi } from '@/utils/api/levelEnrollment/level-enrollment.api'
import { Mission } from '@/models/crud/mission.model'
import { MissionEnrollment } from '@/models/crud/mission-enrollment.model'
import { MissionEnrollmentApi } from '@/utils/api/missionEnrollment/mission-enrollment.api'
import { User } from '@/models/crud'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import Chip from '@/components/shared/chip'
import Head from 'next/head'
import ImageCard from '@/components/creator/imageCard'
import UserMenu from '@/components/user/userMenu'
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

enum LevelType {
  enrollment = 'enrollment',
  level = 'level',
}

const getTypeOfLevel = (level: LevelEnrollment | Level): LevelType => {
  if ((level as LevelEnrollment).level) {
    return LevelType.enrollment
  } else {
    return LevelType.level
  }
}

const getAFieldInMission = (mission: Mission | MissionEnrollment, field: string) => {
  if (getTypeOfMission(mission) === MissionType.mission) {
    mission = mission as Mission
    console.log(mission[field])
    return mission[field]
  } else {
    mission = mission as MissionEnrollment
    console.log(mission[field])
    return mission.mission[field]
  }
}

export default function UserMissionPage({
  user,
  mission,
  course,
  missionCategory,
  levels,
}: {
  user: User
  mission: Mission | MissionEnrollment
  course: Course
  missionCategory: Category
  levels: (LevelEnrollment | Level)[]
}) {
  const session = useSession()
  const t = useTranslation()
  const startMission = async () => {
    try {
      await new MissionEnrollmentApi(course._id, session.data).create({
        missionId: getAFieldInMission(mission, '_id'),
      })
      router.reload()
    } catch (e) {
      console.log(e)
    }
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
            <div className="flex justify-between gap-6 items-center">
              <div className=" text-brand font-semibold text-xl md:text-3xl">
                {getAFieldInMission(mission, 'title')}
              </div>
              <div>
                {getTypeOfMission(mission) === MissionType.mission ? (
                  <button
                    className="text-xs whitespace-nowrap md:text-base font-semibold btn btn-secondary bg-secondary
                                 rounded-lg md:rounded-xl text-brand-700 border-brand-700 hover:bg-secondary-800
                                 h-fit"
                    onClick={() => {
                      startMission()
                    }}
                  >
                    {t.User.viewMissionPage.startMission}
                  </button>
                ) : getTypeOfMission(mission) === MissionType.enrollment &&
                  (mission as MissionEnrollment).completed === false ? (
                  <button
                    className="text-xs md:text-base font-semibold btn btn-secondary bg-rose-500 rounded-lg md:rounded-xl text-brand-700 border-brand-700 hover:bg-rose-400 h-fit"
                    // onClick={() => continue(true)}
                  >
                    {t.User.viewMissionPage.continue}
                  </button>
                ) : (
                  <div className="flex flex-col gap-3 bg-teal-50 rounded-lg px-3 py-2">
                    <div className=" flex gap-2 items-center">
                      <CheckCircleIcon className=" h-6 w-6 ml-2 text-teal-600" />
                      <div className=" text-teal-600 font-bold text-xs md:text-base py-2 rounded-md">
                        {t.User.viewMissionPage.completed}
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
          // if the mission is of type Mission, display the levels locked except the first one // if
          the mission is of type MissionEnrollment, display the levels that are of type //
          evelEnrollment as unlocked and the rest as locked
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
      props: {
        redirect: {
          destination: '/app',
          permanent: false,
        },
      },
    }
  }

  const mission = await new MissionEnrollmentApi(courseId, session).findMissionById(missionId)

  const missionCategory = await new CategoryApi(session).findOne(
    getAFieldInMission(mission.payload, 'categoryId')
  )

  const levels = await new LevelEnrollmentApi(courseId, missionId, session).findAll()

  return {
    props: {
      user: session.user,
      mission: mission,
      course: course.payload,
      missionCategory: missionCategory.payload,
      levels: levels.payload,
    },
  }
}
