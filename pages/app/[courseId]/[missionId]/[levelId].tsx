import { Course, CourseType } from '@/models/crud/course.model'
import { CourseApi } from '@/utils/api/course/course.api'
import { Level } from '@/models/crud/level.model'
import { Mission } from '@/models/crud/mission.model'
import { User } from '@/models/crud'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import ArduinoLevel from '@/components/user/level/arduinoLevel'
import Head from 'next/head'
import HtmlLevel from '@/components/user/level/htmlLevel'
import Link from 'next/link'
import React from 'react'
import UserMenu from '@/components/user/userMenu'
import useTranslation from '@/hooks/useTranslation'

const PlayLevel = ({
  user,
  level,
  mission,
  course,
}: {
  user: User
  level: Level
  mission: Mission
  course: Course
}) => {
  const t = useTranslation()
  const router = useRouter()
  const session = useSession()

  return (
    <>
      <Head>
        <title>NinjaCo | Play Level</title>
        <meta name="description" content="Create Level" />
      </Head>
      <main className="w-full relative h-screen flex flex-col">
        <UserMenu user={user} isOnCoursePage={true} isOnGamesPage={false} />
        <div className="grid md:hidden items-center h-screen grid-cols-1 justify-items-center py-24 px-8 relative flex-auto">
          <h1 className="self-end divide-x-2 divide-brand text-sm ">
            <span className="px-2 font-bold">{t.Creator.games.createGame.mobileError}</span>
          </h1>
          <Link
            href={`/app/${course._id}/${mission._id}`}
            className="self-start my-4 text-sm btn btn-brand"
          >
            {t.Creator.games.createGame.goBack}
          </Link>
        </div>
        {course.type === CourseType.HTML ? (
          <HtmlLevel course={course} level={level} mission={mission} />
        ) : (
          <ArduinoLevel course={course} level={level} mission={mission} />
        )}
      </main>
    </>
  )
}

export default PlayLevel

export const getServerSideProps = async (context) => {
  const { req, res, query } = context

  const { courseId, missionId, levelId } = query

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

  const level = mission.levels.find((level) => level._id === levelId)

  if (!level) {
    return {
      redirect: {
        destination: '/creator/' + courseId + '/' + missionId,
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: session.user,
      level: level,
      mission: mission,
      course: course.payload,
    },
  }
}
