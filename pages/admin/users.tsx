import { ISODateString } from 'next-auth'

import { User } from '@/models/crud/user.model'
import { UserApi } from '@/utils/api/user'
import { date } from 'yup'
import { getSession, useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import MenuSection from '@/components/admin/menuSection'
import React, { Fragment, useEffect } from 'react'
import dayjs from 'dayjs'
import filter_logo from '@/images/filter_logo.svg'
import format from 'date-fns/format'
import pen_logo from '@/images/pen_logo.svg'

const AdminUserView: React.FC<{ users: User[] }> = ({ users }) => {
  //   const api = new UserApi(session.data)
  //   const users = api.find()
  // use the same approach but in useEffect
  console.log(users[0].firstName)

  function newDate(d: string): React.ReactNode {
    const date = new Date(d)
    const formattedDate = format(date, 'dd/MM/yyyy')

    return formattedDate
  }

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
            <div className="mt-10 mr-24 btn w-32 h-10 rounded-xl border-x-2 border-y-2 border-brand text-lg font-semibold text-brand   ">
              Add user
            </div>
          </div>
          <div className="ml-24 mt-1 text-sm text-brand  "> 1234 entries found</div>
          <div className="ml-24 mt-10 mb-2 btn w-32 h-8 rounded-lg border-x-1 border-y-1 bg-brand-200 border-brand text-lg font-semibold text-brand flex gap-2 max-w-fit">
            {/* add filter_logo image */}
            <Image src={filter_logo} alt={'filter'}></Image>
            Filter
          </div>
          <div className="  max-w-fit relative overflow-x-auto mb-16 flex ">
            <table className=" mx-24 text-sm text-left text-brand rounded-t-2xl  ">
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
                {users.map((user, index) => (
                  <>
                    <tr className="bg-brand-50">
                      <td className="px-6 py-4 text-xs">{users[index]._id}</td>
                      <td className="px-6 py-4">{users[index].firstName}</td>
                      <td className="px-6 py-4">{users[index].lastName}</td>
                      <td className="px-6 py-4">{users[index].email}</td>
                      <td className="px-6 py-4">{newDate(users[index].dateOfBirth)}</td>
                      <td className="px-6 py-4">{newDate(users[index].createdAt)}</td>
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
