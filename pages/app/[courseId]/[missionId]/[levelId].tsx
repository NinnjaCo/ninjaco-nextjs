import { CourseEnrollment } from '@/models/crud/course-enrollment.model'
import { CourseEnrollmentAPI } from '@/utils/api/courseEnrollment/course-enrollment.api'
import { CourseType } from '@/models/crud/course.model'
import { Feedback } from '@/models/crud/feedback.model'
import { FeedbackApi } from '@/utils/api/feedback/feedback.api'
import { FeedbackDialog } from '@/components/user/level/feedback'
import { LevelEnrollment } from '@/models/crud/level-enrollment.model'
import { MissionEnrollment } from '@/models/crud/mission-enrollment.model'
import { User } from '@/models/crud'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { title } from 'process'
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
}: // feedback,
{
  user: User
  level: LevelEnrollment
  mission: MissionEnrollment
  course: CourseEnrollment
  // feedback: Feedback
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
        <div className="grid lg:hidden items-center h-screen grid-cols-1 justify-items-center py-24 px-8 relative flex-auto">
          <h1 className="self-end divide-x-2 divide-brand text-sm ">
            <span className="px-2 font-bold">Please use a desktop to play</span>
          </h1>
          <Link
            href={`/app/${course.course._id}/${mission._id}`}
            className="self-start my-4 text-sm btn btn-brand"
          >
            {t.Creator.games.createGame.goBack}
          </Link>
        </div>
        {course.course.type === CourseType.HTML ? (
          <HtmlLevel
            course={course.course}
            level={level.level}
            mission={mission.mission}
            user={user}
          />
        ) : (
          <ArduinoLevel course={course.course} level={level.level} mission={mission.mission} />
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

  const course = await new CourseEnrollmentAPI(session).findByCourseId(courseId)

  // if no course or no course payload or course is not of type enrollment
  if (!course || !course.payload || !('course' in course.payload)) {
    return {
      redirect: {
        destination: '/app',
        permanent: false,
      },
    }
  }

  const typedCourse = course.payload as CourseEnrollment

  const mission = typedCourse.missions.find((mission) => mission.mission === missionId)

  // If they are here, then they shouldve already started the mission
  if (!mission) {
    return {
      redirect: {
        destination: '/app/' + courseId,
        permanent: false,
      },
    }
  }

  const level = mission.levels.find((level) => level.level === levelId)

  // If they are here, then they shouldve already started the level
  if (!level) {
    return {
      redirect: {
        destination: '/app/' + courseId + '/' + missionId,
        permanent: false,
      },
    }
  }

  const actuallMissionInfo = typedCourse.course.missions.find(
    (mission) => mission._id === missionId
  )

  if (!actuallMissionInfo) {
    return {
      redirect: {
        destination: '/app/' + courseId,
        permanent: false,
      },
    }
  }

  mission.mission = actuallMissionInfo

  const actualLevelInfo = typedCourse.course.missions
    .find((mission) => mission._id === missionId)
    ?.levels.find((level) => level._id === levelId)

  if (!actualLevelInfo) {
    return {
      redirect: {
        destination: '/app/' + courseId,
        permanent: false,
      },
    }
  }

  level.level = actualLevelInfo
  return {
    props: {
      user: session.user,
      level: level,
      mission: mission,
      course: typedCourse,
    },
  }
}
