import { ChartBarIcon } from '@heroicons/react/20/solid'
import { GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { RoleEnum } from '@/models/crud/role.model'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '../api/auth/[...nextauth]'
import { getLevelFromPoints } from '@/utils/shared'
import { getServerSession } from 'next-auth'
import Head from 'next/head'
import Image from 'next/image'
import LevelIndicator from '@/components/shared/level'
import React, { useMemo } from 'react'
import SideMenu from '@/components/admin/sideMenu'
import Table from '@/components/table'
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
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'profilePhoto',
        headerName: 'Profile Photo',
        width: 120,
        minWidth: 50,
        headerClassName: 'bg-brand-200',
        renderCell: (params) => (
          <div className="flex items-center justify-center">
            <Image src={profile_photo} alt="image" className="w-10 h-10 rounded-full" />
          </div>
        ),
        flex: 1,
        sortable: false,
        filterable: false,
      },
      {
        field: 'firstName',
        headerName: 'First Name',
        width: 120,
        minWidth: 120,
        headerClassName: 'bg-brand-200',
        flex: 1,
      },
      {
        field: 'lastName',
        headerName: 'Last Name',
        width: 120,
        minWidth: 120,
        headerClassName: 'bg-brand-200',
        flex: 1,
      },
      {
        field: 'email',
        headerName: 'Email',
        width: 200,
        minWidth: 200,
        headerClassName: 'bg-brand-200',
        flex: 1,
      },
      {
        field: 'level',
        headerName: 'Level',
        width: 120,
        minWidth: 120,
        headerClassName: 'bg-brand-200',
        renderCell: (params) => <LevelIndicator points={params.value} />,
        flex: 1,
        sortable: false,
        filterable: false,
      },
      {
        field: 'points',
        headerName: 'Points',
        width: 120,
        minWidth: 120,
        headerClassName: 'bg-brand-200',
        flex: 1,
      },
    ],
    []
  )

  const rows: GridRowsProp = useMemo(
    () =>
      users.map((user) => ({
        id: user._id, // for now send id instead of image
        profilePhoto: user._id, // for now send id instead of image
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        level: user.points,
        points: user.points || 0,
      })),
    [users]
  )

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
            <div className="flex gap-3 items-center w-full py-2">
              <Image src={statistics} alt="image" />
              <div className="text-brand font-semibold text-xl md:text-2xl">Statistics</div>
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
            <div className="flex gap-3 items-center py-2">
              <ChartBarIcon className="w-5 h-5 text-brand" />
              <div className="text-brand font-semibold text-xl md:text-2xl">Leaderboard</div>
            </div>
            <Table
              columns={columns}
              rows={rows}
              width={'100%'}
              height={600}
              includeToolbar={false}
            />
          </div>
        </div>
      </main>
    </>
  )
}

export default AdminDashboard

export const getServerSideProps = async (context) => {
  const { req, res } = context
  const session = await getServerSession(req, res, authOptions)
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

  let countUsers = 0
  let countCreators = 0
  for (let i = 0; i < users.payload.length; i++) {
    if (users.payload[i].role.role === RoleEnum.USER) {
      countUsers = countUsers + 1
    }
    if (users.payload[i].role.role === RoleEnum.CREATOR) {
      countCreators = countCreators + 1
    }
  }

  return {
    props: { users: users.payload, countUsers, countCreators },
  }
}
