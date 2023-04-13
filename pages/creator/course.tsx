import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'
import Image from 'next/image'

export default function Course({ user }: { user: User }) {
  return (
    <>
      <Head>
        <title>NinjaCo | Course</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative h-screen w-full">
        <CreatorMenu
          {...{
            isOnCoursePage: true,
            creator: user,
          }}
        />
        {/* image description and button */}
        <div className="flex  items-center ml-7 mt-10 justify-between">
          <div className="flex justify-start gap-5">
            <Image
              src="https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/intro_robotics_electronics.png"
              alt="course img "
              width={100}
              height={100}
              className="rounded-xl md:block hidden"
            />
            <div className="flex flex-col gap-9">
              <div className=" text-brand font-semibold text-base md:text-xl">Robotics 101</div>
              <div className=" text-brand font-medium text-xs md:text-sm">
                This course will lorem ipsum lorem ipsum lorem <br />
                ipsumThis course will lorem ipsum lorem ipsum lorem ipsum
              </div>
            </div>
          </div>

          <button className=" text-sm md:text-base font-semibold  mr-6 md:mr-12 px-2 md:px-6 py-1 md:py-2 btn btn-secondary bg-secondary rounded-xl text-brand-700 border-brand-700 hover:bg-secondary-800 h-fit">
            Edit Course
          </button>
        </div>
        {/* course type, age range, course tags, course prerequisites, course objectives */}
        <div className="flex justify-between ml-7 mt-10 gap-10">
          <div className="flex flex-col gap-5 ">
            <div className="flex gap-3 items-center">
              <div className=" text-brand font-medium text-xs md:text-sm">Course type:</div>
              <div className="text-brand-800 font-semibold text-sm md:text-base">ARDUINO</div>
            </div>
            <div className="flex gap-3 items-center">
              <div className=" text-brand font-medium text-xs md:text-sm">Age range:</div>
              <div className="text-brand-800 font-semibold text-sm md:text-base">7+</div>
            </div>
            <div className="flex gap-3 items-center">
              <div className=" text-brand font-medium text-xs md:text-sm">Course tags:</div>
              <div className="bg-brand-100 px-2  rounded-xl w-fit h-fit text-xs">basics</div>
            </div>
          </div>
          <div className="flex flex-col gap-5 mr-80">
            <div className="flex flex-col gap-2">
              <div className=" text-brand font-medium text-xs md:text-sm">
                Course prerequisites:
              </div>
              <div className="bg-brand-100 px-2  rounded-xl w-fit h-fit text-xs">
                Basic Computer Knowledge
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className=" text-brand font-medium text-xs md:text-sm">Course objectives:</div>
              <div className="bg-brand-100 px-2  rounded-xl w-fit h-fit text-xs">
                Learn about different types of encryption/decryption
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const { query, req, res } = context

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

  return {
    props: {
      user: response.payload,
    },
  }
}
