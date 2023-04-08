import Head from 'next/head'
import Image from 'next/image'
import MenuSection from '@/components/admin/menuSection'
import React, { Fragment, useEffect } from 'react'
import filter_logo from '@/images/filter_logo.svg'

import { User } from '@/models/crud/user.model'
import { UserApi } from '@/utils/api/user'
import { getSession, useSession } from 'next-auth/react'
import pen_logo from '@/images/pen_logo.svg'

const AdminUserView: React.FC<{ users: User[] }> = ({ users }) => {
  //   const api = new UserApi(session.data)
  //   const users = api.find()
  // use the same approach but in useEffect
  console.log(users[0].firstName)

  return (
    <>
      <Head>
        <title>Ninja Co | Admin Users View</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className=" flex h-screen">
        <MenuSection />
        {/* leaderboard */}

        <div className="flex flex-col ">
          <div className="flex justify justify-between">
            <div className="text-brand-700 text-3xl font-semibold ml-24 mt-10">users</div>
            <div className="mt-10 mr-14 btn w-32 h-10 rounded-xl border-x-2 border-y-2 border-brand text-lg font-semibold text-brand   ">
              Add user
            </div>
          </div>
          <div className="ml-24 mt-1 text-sm text-brand "> 1234 entries found</div>
          <div className="ml-24 mt-10 mb-2 btn w-32 h-8 rounded-lg border-x-1 border-y-1 bg-brand-200 border-brand text-lg font-semibold text-brand flex gap-2 max-w-fit">
            {/* add filter_logo image */}
            <Image src={filter_logo} alt={'filter'}></Image>
            Filter
          </div>
          <div className="relative overflow-x-auto h-fit mb-16">
            <table className="w-5/6 ml-24 text-sm text-left text-brand rounded-t-2xl ">
              <thead className="text-brand w-max uppercase bg-brand-200 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    First Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Last Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date of Birth
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {/* <tr className="bg-brand-50">
                  <td className="px-6 py-4">2</td>

                  <td className="px-6 py-4">{users[0].firstName}</td>
                  <td className="px-6 py-4">khoury</td>
                  <td className="px-6 py-4">raghid@gmail.commmm</td>
                  <td className="px-6 py-4">1/1/1000</td>
                  <td className="px-6 py-4">20/2/2003</td>
                  <td className="px-6 py-4">
                    <button className="bg-brand-200 rounded-full w-6 h-6">
                      <Image className="rounded" src={pen_logo} alt={'pen logo'}></Image>
                    </button>
                  </td>
                </tr> */}
                {/* create a loop that fill the table using the user information */}
                {/* map over the users array and return a tr for each user */}
                {users.map((user, index) => (
                  <>
                    <div key={index}></div>
                    <tr className="bg-brand-50">
                      <td className="px-6 py-4 text-xs">{users[index]._id}</td>
                      <td className="px-6 py-4">{users[index].firstName}</td>
                      <td className="px-6 py-4">{users[index].lastName}</td>
                      <td className="px-6 py-4">{users[index].email}</td>
                      <td className="px-6 py-4">{users[index].dateOfBirth}</td>
                      <td className="px-6 py-4">{users[index].createdAt}</td>
                      <td className="px-6 py-4">
                        <button className="bg-brand-200 rounded-full w-6 h-6">
                          <Image className="rounded" src={pen_logo} alt={'pen logo'}></Image>
                        </button>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  )
}

export default AdminUserView

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
  console.log(users)
  return {
    props: { users: users.payload },
  }
}
