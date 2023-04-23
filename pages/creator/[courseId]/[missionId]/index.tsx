import { Category } from '@/models/crud/category.model'
import { CategoryApi } from '@/utils/api/category/category.api'
import { Course } from '@/models/crud/course.model'
import { CourseApi } from '@/utils/api/course/course.api'
import { Mission } from '@/models/crud/mission.model'
import { User } from '@/models/crud'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import Chip from '@/components/shared/chip'
import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'
import ImageCard from '@/components/creator/imageCard'
import Link from 'next/link'
import clsx from 'clsx'
import useTranslation from '@/hooks/useTranslation'

export default function MissionPage({
  user,
  mission,
  course,
  missionCategory,
}: {
  user: User
  mission: Mission
  course: Course
  missionCategory: Category
}) {
  const t = useTranslation()
  return (
    <>
      <Head>
        <title>NinjaCo | Mission</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full">
        <CreatorMenu isOnCoursePage={true} isOnGamesPage={false} creator={user} />
        <div className="flex gap-4 px-6 my-12 w-full md:flex-row flex-col">
          <div className="w-52 h-32 relative">
            <ImageCard image={mission.image} />
          </div>
          <div className="flex flex-col gap-9 w-full">
            <div className="flex justify-between gap-6 items-start md:items-center md:flex-row flex-col">
              <div className=" text-brand font-semibold text-xl md:text-3xl">{mission.title}</div>
              <Link
                className="btn btn-cta text-xs md:text-sm"
                href={`/creator/${course._id}/${mission._id}/edit`}
              >
                {t.Creator.viewMissionPage.editMission}
              </Link>
            </div>
            <div className=" text-brand-500 font-medium text-xs md:text-base w-full">
              {mission.description}
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center w-full flex-wrap px-6 my-8">
          <div className=" text-brand font-medium text-xs md:text-base">
            {t.Creator.viewMissionPage.missionCategory}
          </div>
          <Chip text={missionCategory.categoryName} />
        </div>
        <div className="flex flex-col px-6 pb-12 gap-6">
          <div className="flex justify-between gap-10">
            <div className="font-semibold text-2xl">{t.Creator.viewMissionPage.levels}</div>
            <Link
              className="btn btn-cta text-xs md:text-sm"
              href={`/creator/${course._id}/${mission._id}/create`}
            >
              {t.Creator.viewMissionPage.addLevel}
            </Link>
          </div>

          {mission.levels.length !== 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-11 xl:grid-cols-12 w-full gap-8 items-center place-items-center">
              {mission.levels.map((level, index) => (
                <Link
                  className={clsx(
                    'rounded-full w-16 h-16 flex justify-center items-center text-center text-2xl font-semibold text-brand shadow-inner',
                    {
                      'bg-brand-300 shadow-brand-400 hover:bg-brand': level.levelNumber % 2 === 0,
                      'bg-secondary-300 shadow-secondary-900 hover:bg-secondary':
                        level.levelNumber % 2 !== 0,
                    }
                  )}
                  key={index}
                  href={`/creator/${course._id}/${mission._id}/${level._id}`}
                >
                  {level.levelNumber}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-brand-500 font-medium text-xs md:text-base w-full">
              No levels yet
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

  const course = await new CourseApi(session).findOne(courseId)

  if (!course || !course.payload) {
    return {
      redirect: {
        destination: '/creator',
        permanent: false,
      },
    }
  }
  const mission = course.payload.missions.find((mission) => mission._id === missionId)

  if (!mission) {
    return {
      redirect: {
        destination: '/creator/' + courseId,
        permanent: false,
      },
    }
  }

  const missionCategory = await new CategoryApi(session).findOne(mission.categoryId)

  return {
    props: {
      user: session.user,
      mission: mission,
      course: course.payload,
      missionCategory: missionCategory.payload,
    },
  }
}
