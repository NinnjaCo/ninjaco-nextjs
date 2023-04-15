import { Course } from '@/models/crud/course.model'
import { CourseApi } from '@/utils/api/course/course.api'
import { FunnelIcon } from '@heroicons/react/24/outline'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '../../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import Chip from '@/components/shared/chip'
import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'
import Image from 'next/image'
import ImageCard from '@/components/creator/imageCard'
import Link from 'next/link'
import MissionCard from '@/components/creator/missionCard'

export default function CourseView({ user, course }: { user: User; course: Course }) {
  return (
    <>
      <Head>
        <title>NinjaCo | View Course</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full">
        <CreatorMenu isOnCoursePage={true} isOnGamesPage={false} creator={user} />
        <div className="flex gap-4 px-6 my-12 w-full md:flex-row flex-col">
          <ImageCard image={course.image} />
          <div className="flex flex-col gap-9 w-full">
            <div className="flex justify-between gap-6 items-center">
              <div className=" text-brand font-semibold text-xl md:text-3xl">{course.title}</div>
              <Link
                className="text-xs  md:text-base font-semibold btn btn-secondary bg-secondary rounded-lg md:rounded-xl text-brand-700 border-brand-700 hover:bg-secondary-800 h-fit"
                href={`/creator/${course._id}/edit`}
              >
                Edit Course
              </Link>
            </div>
            <div className=" text-brand-500 font-medium text-xs md:text-base w-full">
              {course.description}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-2 justify-between px-6 my-6 border-b-2 py-6 border-brand-50">
          <div className="flex flex-col gap-4 border-r-0 md:border-r-2 mr-0 md:mr-12 border-brand-50">
            <div className="flex gap-3 items-center">
              <div className=" text-brand font-medium text-xs md:text-base">Course type:</div>
              <div className="text-brand font-semibold text-sm md:text-lg">{course.type}</div>
            </div>
            <div className="flex gap-3 items-center w-full flex-wrap">
              <div className=" text-brand font-medium text-xs md:text-base">Age range:</div>
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
                Course prerequisites:
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
              <div className=" text-brand font-medium text-xs md:text-base">Course objectives:</div>
              {course.objectives?.length !== 0 ? (
                course?.objectives?.map((objective, index) => <Chip text={objective} key={index} />)
              ) : (
                <Chip text="None" />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col px-6 pb-12 pt-6 gap-6">
          <div className="flex justify-between gap-10">
            <div className="font-semibold text-2xl">Missions</div>
            <Link
              className=" text-xs md:text-base font-semibold btn btn-secondary bg-secondary rounded-lg md:rounded-xl text-brand-700 border-brand-700 hover:bg-secondary-800 h-fit"
              href={`/creator/${course._id}/create`}
            >
              Add Mission
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-brand font-medium text-xs">{course.missions.length} missions</div>
            <button className="btn btn-secondary bg-brand-300 rounded-lg text-brand-700 border-brand-300 hover:bg-brand hover:text-white py-1 px-4 h-fit flex gap-3">
              <FunnelIcon className="w-4 h-4" />
              Filter
            </button>
          </div>
          {course.missions.length !== 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-8 items-center place-items-center">
              {course.missions.map((mission, index) => (
                <Link href={`/creator/${course._id}/${mission._id}`} key={index}>
                  <MissionCard mission={mission} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-brand font-medium text-lg">No missions yet</div>
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
