import { User } from 'next-auth'
import { UserApi } from '@/utils/api/user'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import SideMenu from '@/components/admin/sideMenu'
import leaderboard from '@/images/leaderboard_icon.svg'
import profile_photo from '@/images/profile_photo.svg'
import statistics from '@/images/statistics.svg'
import total_courses from '@/images/total_courses.svg'
import total_creators from '@/images/total_creators.svg'
import total_users from '@/images/total_users.svg'

const AdminDashboard: React.FC<{ users: User[]; countUsers: number; countCreators: number }> = ({
  users,
  countUsers,
  countCreators,
}) => {
  return (
    <>
      <Head>
        <title>NinjaCo | Admin Dashboard</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex h-screen overflow-hidden">
        <SideMenu higlightDashboard={true} />
        <div className="flex flex-col w-full px-4 md:px-9 py-4 gap-4">
          {/* statistics */}
          <div className="w-full flex flex-col">
            <div className="flex gap-3 items-start w-full">
              <Image src={statistics} alt="image" />
              <div className="text-brand font-semibold text-xl">Statistics</div>
            </div>

            <div className=" bg-brand-50 p-4 rounded-2xl justify-between w-fit sm:w-full grid grid-cols-1 sm:grid-cols-3 gap-6 place-self-center sm:place-self-auto">
              <div className="h-24 md:h-auto relative">
                <Image src={total_users} alt="image" className="w-full h-full relative " priority />
                <div className="text-brand-100 font-semibold text-base md:text-lg lg:text-2xl xl:text-3xl absolute top-1 lg:top-3 xl:top-6 left-8 md:left-10 lg:left-14 xl:left-24">
                  {countUsers}
                </div>
              </div>
              <div className="h-24 md:h-auto relative">
                <Image
                  src={total_courses}
                  alt="image"
                  className="w-full h-full relative "
                  priority
                />
                <div className="text-brand-100 font-semibold text-base md:text-lg lg:text-2xl xl:text-3xl absolute top-1 lg:top-3 xl:top-6 left-8 md:left-10 lg:left-14 xl:left-24">
                  10
                </div>
              </div>
              <div className="h-24 md:h-auto relative">
                <Image
                  src={total_creators}
                  alt="image"
                  className="w-full h-full relative "
                  priority
                />
                <div className="text-brand-100 font-semibold text-base md:text-lg lg:text-2xl xl:text-3xl absolute top-1 lg:top-3 xl:top-6 left-8 md:left-10 lg:left-14 xl:left-24">
                  {countCreators}
                </div>
              </div>
            </div>
          </div>

          {/* leaderboard */}
          <div className="w-full flex flex-col overflow-auto">
            <div className="flex gap-3 items-start">
              <Image src={leaderboard} alt="image" />
              <div className="text-brand font-semibold text-xl">Leaderboard</div>
            </div>
            <div className="w-full overflow-auto pr-8 sm:pr-0">
              <table className="text-[0.5rem] md:text-xs text-left text-brand w-full">
                <thead className="text-brand uppercase bg-brand-200">
                  <tr>
                    <th scope="col" className="pl-4 py-2">
                      Profile photo
                    </th>
                    <th scope="col" className="pl-4 py-3">
                      Name
                    </th>
                    <th scope="col" className="pl-4 py-3">
                      Email
                    </th>
                    <th scope="col" className="pl-4 py-3">
                      Level
                    </th>
                    <th scope="col" className="pl-4 py-3">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr className="bg-brand-50" key={index}>
                      <td className="pl-4 py-2 text-brand w-32">
                        <Image src={profile_photo} alt="image" className="w-8" />
                      </td>
                      <td className="pl-4 py-4">{user.firstName}</td>
                      <td className="pl-4 py-4">{user.email}</td>
                      <td className="pl-4 py-4">{user.level}</td>
                      <td className="pl-4 py-4">{user.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default AdminDashboard

export const getServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }
  const api = new UserApi(session)
  const users = await api.find()

  console.log(users.payload)

  let countUsers = 0
  let countCreators = 0
  for (let i = 0; i < users.payload.length; i++) {
    if (users.payload[i].role.role === 'user') {
      countUsers = countUsers + 1
    }
    if (users.payload[i].role.role === 'creator') {
      countCreators = countCreators + 1
    }
  }

  return {
    props: { users: users.payload, countUsers, countCreators },
  }
}
