import * as React from 'react'
import * as qs from 'qs'
import { GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { PencilIcon } from '@heroicons/react/24/solid'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { getReadableDateFromISO } from '@/utils/shared'
import { getSession } from 'next-auth/react'
import { useMemo } from 'react'
import Head from 'next/head'
import SideMenu from '@/components/admin/sideMenu'
import Table from '@/components/table'

const AdminUserView: React.FC<{ users: User[] }> = ({ users }) => {
  const clickEditButtonOnUserId = (params) => {
    console.log(params.row.id)
  }
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        width: 260,
        minWidth: 140,
        headerClassName: 'bg-brand-200',
      },
      {
        field: 'email',
        headerName: 'Email',
        width: 200,
        minWidth: 140,
        headerClassName: 'bg-brand-200',
      },
      {
        field: 'firstName',
        headerName: 'First Name',
        width: 140,
        minWidth: 140,
        headerClassName: 'bg-brand-200',
      },
      {
        field: 'lastName',
        headerName: 'Last Name',
        width: 140,
        minWidth: 140,
        headerClassName: 'bg-brand-200',
      },
      {
        field: 'dob',
        headerName: 'Date of Birth',
        width: 140,
        minWidth: 140,
        headerClassName: 'bg-brand-200',
      },
      {
        field: 'createdAt',
        headerName: 'Created At',
        width: 160,
        minWidth: 160,
        headerClassName: 'bg-brand-200',
        flex: 1,
      },
      {
        field: 'updatedAt',
        headerName: 'Updated At',
        width: 160,
        minWidth: 160,
        headerClassName: 'bg-brand-200',
        flex: 1,
      },
      {
        field: 'action',
        headerName: 'Action',
        width: 70,
        renderCell: (params) => (
          <button
            className="bg-brand-200 z-10 rounded w-6 h-6 flex items-center justify-center"
            onClick={() => {
              clickEditButtonOnUserId(params)
            }}
            tabIndex={-1}
          >
            <PencilIcon className="h-3 font-bold text-brand" />
          </button>
        ),
        headerClassName: 'bg-brand-200',
        sortable: false,
        filterable: false,
        hideable: false,
        minWidth: 70,
        flex: 1,
      },
    ],
    []
  )

  const rows: GridRowsProp = useMemo(
    () =>
      users.map((user) => ({
        id: user._id,
        email: user.email,
        dob: getReadableDateFromISO(user.dateOfBirth),
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: getReadableDateFromISO(user.createdAt),
        updatedAt: getReadableDateFromISO(user.updatedAt),
        action: user._id,
      })),
    [users]
  )

  return (
    <>
      <Head>
        <title>NinjaCo | Admin View Creators</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex w-full h-screen overflow-hidden">
        <SideMenu higlightCreators={true} />
        <div className="flex flex-col flex-grow w-3/4 h-full gap-12 py-8 px-4">
          <div className="flex items-center justify-between w-full flex-wrap">
            <div className="flex flex-col gap-2">
              <p className="text-brand-700 text-xl md:text-2xl lg:text-3xl font-semibold">
                Creators
              </p>
              <div className="text-sm text-brand  ">{users.length} entries found</div>
            </div>
            <button className="btn btn-secondary gap-2 text-brand rounded-lg hover:bg-brand-400 hover:text-white py-2 px-4">
              Add Creator
            </button>
          </div>
          <Table
            columns={columns}
            rows={rows}
            width={'100%'}
            height={700}
            className="mr-4 relative"
          />
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

  const creators = response.payload.filter((user) => user.role.role === 'creator')

  return {
    props: { users: creators },
  }
}
