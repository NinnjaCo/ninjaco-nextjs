import { FunnelIcon } from '@heroicons/react/24/outline'
import { PencilIcon } from '@heroicons/react/24/solid'
import { User } from '@/models/crud/user.model'
import { UserApi } from '@/utils/api/user'
import { getReadableDateFromISO } from '@/utils/shared'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import React from 'react'
import SideMenu from '@/components/admin/sideMenu'

const AdminUserView: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <>
      <Head>
        <title>NinjaCo | Admin View Users</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex w-full h-screen overflow-hidden">
        <SideMenu higlightUsers={true} />
        <div className="flex flex-col flex-grow w-3/4 h-full gap-12 py-8 px-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-2">
              <p className="text-brand-700 text-xl md:text-2xl lg:text-3xl font-semibold">Users</p>
              <div className="text-sm text-brand  ">{users.length} entries found</div>
            </div>
            <button className="btn btn-secondary gap-2 text-brand rounded-lg hover:bg-brand-400 hover:text-white py-2">
              Add user
            </button>
          </div>
          <button className="hidden md:flex btn max-w-fit gap-2 text-brand bg-brand-200 rounded-md hover:bg-brand-400 py-2">
            <FunnelIcon className="h-4 font-bold" />
            Filter
          </button>
          <div className="w-full overflow-scroll">
            <table className="text-[0.5rem] md:text-xs text-left text-brand w-full rounded-t-2xl">
              <thead className="text-brand uppercase bg-brand-200 ">
                <tr>
                  <th scope="col" className="pl-4 py-3">
                    ID
                  </th>
                  <th scope="col" className="pl-4 py-3">
                    First Name
                  </th>
                  <th scope="col" className="pl-4 py-3">
                    Last Name
                  </th>
                  <th scope="col" className="pl-4 py-3">
                    Email
                  </th>
                  <th scope="col" className="pl-4 py-3">
                    Date of Birth
                  </th>
                  <th scope="col" className="pl-4 py-3">
                    Created At
                  </th>
                  <th scope="col" className="pl-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr className="bg-brand-50" key={index}>
                    <td className="pl-4 py-4">{user._id}</td>
                    <td className="pl-4 py-4">{user.firstName}</td>
                    <td className="pl-4 py-4">{user.lastName}</td>
                    <td className="pl-4 py-4">{user.email}</td>
                    <td className="pl-4 py-4">{getReadableDateFromISO(user.dateOfBirth)}</td>
                    <td className="pl-4 py-4">{getReadableDateFromISO(user.createdAt)}</td>
                    <td className="pl-4 py-4">
                      <button className="bg-brand-200 rounded w-6 h-6 flex items-center justify-center">
                        <PencilIcon className="h-3 font-bold text-brand" />
                      </button>
                    </td>
                  </tr>
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
  const response = await api.find()
  return {
    props: { users: response.payload },
  }
}
