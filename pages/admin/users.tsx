import { FunnelIcon } from '@heroicons/react/24/outline'
import { User } from '@/models/crud/user.model'
import { UserApi } from '@/utils/api/user'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import SideMenu from '@/components/admin/sideMenu'
import filter_logo from '@/images/filter_logo.svg'
import pen_logo from '@/images/pen_logo.svg'
import profile_photo from '@/images/profile_photo.svg'

const AdminUserView: React.FC<{ users: User[] }> = ({ users }) => {
  //   const api = new UserApi(session.data)
  //   const users = api.find()
  // use the same approach but in useEffect
  console.log(users[0].firstName)

  const getReadableDateFromISO = (date: string) => {
    const dateObj = new Date(date)
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth() + 1
    const day = dateObj.getDate()
    return `${day}/${month}/${year}`
  }

  return (
    <>
      <Head>
        <title>NinjaCo | Admin View Users</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex h-full">
        <SideMenu higlightUsers={true} />
        <div className="flex flex-col w-full h-full gap-6 py-8 px-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-2">
              <p className="text-brand-700 text-xl md:text-2xl lg:text-3xl font-semibold">Users</p>
              <div className="text-sm text-brand  ">{users.length} entries found</div>
            </div>
            <button className="btn btn-secondary gap-2 text-brand rounded-lg hover:bg-brand-400 hover:text-white py-2">
              Add user
            </button>
          </div>
          <button className="btn max-w-fit flex gap-2 text-brand bg-brand-200 rounded-md hover:bg-brand-400 py-2">
            <FunnelIcon className="h-4 font-bold" />
            Filter
          </button>
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
                <tr className="bg-brand-50">
                  <td className="pl-4 py-2 text-brand w-32">
                    <Image src={profile_photo} alt="image" className="w-8" />
                  </td>
                  <td className="pl-4 py-2">Raghid</td>
                  <td className="pl-4 py-2">Raghidkhoury123@gmail.com</td>
                  <td className="pl-4 py-2">27</td>
                  <td className="pl-4 py-2">65</td>
                </tr>
                <tr className="bg-brand-50">
                  <td className="pl-4 py-2 text-brand w-32">
                    <Image src={profile_photo} alt="image" className="w-8" />
                  </td>
                  <td className="pl-4 py-2">Raghid</td>
                  <td className="pl-4 py-2">Raghidkhoury123@gmail.com</td>
                  <td className="pl-4 py-2">27</td>
                  <td className="pl-4 py-2">65</td>
                </tr>
                <tr className="bg-brand-50">
                  <td className="pl-4 py-2 text-brand w-32">
                    <Image src={profile_photo} alt="image" className="w-8" />
                  </td>
                  <td className="pl-4 py-2">Raghid</td>
                  <td className="pl-4 py-2">Raghidkhoury123@gmail.com</td>
                  <td className="pl-4 py-2">27</td>
                  <td className="pl-4 py-2">65</td>
                </tr>
                <tr className="bg-brand-50">
                  <td className="pl-4 py-2 text-brand w-32">
                    <Image src={profile_photo} alt="image" className="w-8" />
                  </td>
                  <td className="pl-4 py-2">Raghid</td>
                  <td className="pl-4 py-2">Raghidkhoury123@gmail.com</td>
                  <td className="pl-4 py-2">27</td>
                  <td className="pl-4 py-2">65</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* <div className="relative overflow-auto flex ">
            <table className="text-sm text-left text-brand rounded-t-2xl  ">
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
                      <td className="px-6 py-4">
                        {getReadableDateFromISO(users[index].dateOfBirth)}
                      </td>
                      <td className="px-6 py-4">
                        {getReadableDateFromISO(users[index].createdAt)}
                      </td>
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
          </div> */}
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
