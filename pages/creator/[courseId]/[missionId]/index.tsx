import { Category } from '@/models/crud/category.model'
import { CategoryApi } from '@/utils/api/category/category.api'
import { Course } from '@/models/crud/course.model'
import { CourseApi } from '@/utils/api/course/course.api'
import { Mission } from '@/models/crud/mission.model'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import Chip from '@/components/shared/chip'
import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

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
            <Image
              className="bg-brand-100 border-2 border-brand-200 rounded-xl w-52 h-32"
              src={mission.image}
              style={{
                objectFit: 'contain',
              }}
              fill
              alt="PP"
              priority
            />
          </div>
          <div className="flex flex-col gap-9 w-full">
            <div className="flex justify-between gap-6 items-center">
              <div className=" text-brand font-semibold text-xl md:text-3xl">{mission.title}</div>
              <button className="text-xs  md:text-base font-semibold btn btn-secondary bg-secondary rounded-lg md:rounded-xl text-brand-700 border-brand-700 hover:bg-secondary-800 h-fit">
                Edit Mission
              </button>
            </div>
            <div className=" text-brand-500 font-medium text-xs md:text-base w-full">
              {mission.description}
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center w-full flex-wrap px-6 my-8">
          <div className=" text-brand font-medium text-xs md:text-base">Mission Category:</div>
          <Chip text={missionCategory.categoryName} />
        </div>
        <div className="flex flex-col px-6 pb-12 gap-6">
          <div className="flex justify-between gap-10">
            <div className="font-semibold text-2xl">Levels</div>
            <Link
              className=" text-xs md:text-base font-semibold btn btn-secondary bg-secondary rounded-lg md:rounded-xl text-brand-700 border-brand-700 hover:bg-secondary-800 h-fit"
              href={`/creator/${course._id}/${mission._id}/create`}
            >
              Add level
            </Link>
          </div>

          {mission.levels.length !== 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-11 xl:grid-cols-12 w-full gap-8 items-center place-items-center">
              {mission.levels.map((level, index) => (
                <div
                  className={`rounded-full w-10 h-10 flex justify-center items-center text-center p-8 text-2xl font-semibold text-brand-800 ${
                    level.levelNumber % 2 === 0 ? 'bg-secondary-300' : 'bg-brand-300'
                  }`}
                  key={index}
                >
                  {level.levelNumber}
                </div>
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

  const response = await new UserApi(session).findOne(session.id)
  if (!response || !response.payload) {
    return {
      props: {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
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
  const mission = course.payload.missions.find((mission) => mission._id === missionId)

  if (!mission) {
    return {
      props: {
        redirect: {
          destination: '/creator/' + courseId,
          permanent: false,
        },
      },
    }
  }

  const missionCategory = await new CategoryApi(session).findOne(mission.categoryId)

  return {
    props: {
      user: response.payload,
      mission: mission,
      course: course.payload,
      missionCategory: missionCategory.payload,
    },
  }
}
