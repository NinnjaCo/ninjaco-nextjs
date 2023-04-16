/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { Course } from '@/models/crud/course.model'
import { CourseApi } from '@/utils/api/course/course.api'
import { GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { authOptions } from '../api/auth/[...nextauth]'
import { getReadableDateFromISO } from '@/utils/shared'
import { getServerSession } from 'next-auth'
import { useMemo } from 'react'
import Head from 'next/head'
import SideMenu from '@/components/admin/sideMenu'
import Table from '@/components/table'

const AdminCoursesView: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        width: 200,
        minWidth: 140,
        headerClassName: 'bg-brand-200',
      },
      {
        field: 'title',
        headerName: 'Title',
        width: 180,
        minWidth: 140,
        headerClassName: 'bg-brand-200',
        flex: 1,
      },
      {
        field: 'usersEnrolled',
        headerName: 'Users Enrolled',
        width: 140,
        minWidth: 140,
        headerClassName: 'bg-brand-200',
        flex: 1,
      },
      {
        field: 'numberOfMissions',
        headerName: 'Number of Missions',
        width: 180,
        minWidth: 180,
        headerClassName: 'bg-brand-200',
        flex: 1,
      },
      {
        field: 'numberOfLevels',
        headerName: 'Number of Levels',
        width: 180,
        minWidth: 180,
        headerClassName: 'bg-brand-200',
        flex: 1,
      },
      {
        field: 'createdAt',
        headerName: 'Created At',
        type: 'date',
        renderCell: (params) => getReadableDateFromISO(params.value as string),
        width: 160,
        minWidth: 160,
        headerClassName: 'bg-brand-200',
        flex: 1,
      },
      {
        field: 'updatedAt',
        headerName: 'Updated At',
        type: 'date',
        renderCell: (params) => getReadableDateFromISO(params.value as string),
        width: 160,
        minWidth: 160,
        headerClassName: 'bg-brand-200',
        flex: 1,
      },
    ],
    []
  )

  const rows: GridRowsProp = useMemo(
    () =>
      courses.map((course) => {
        let numberOfMissions = 0
        let numberOfLevels = 0
        course.missions?.forEach((mission) => {
          numberOfMissions += 1
          numberOfLevels += mission.levels?.length
        })

        return {
          id: course._id,
          title: course.title,
          usersEnrolled: 10,
          numberOfMissions: numberOfMissions,
          numberOfLevels: numberOfLevels,
          createdAt: new Date(course.createdAt),
          updatedAt: new Date(course.updatedAt),
        }
      }),
    [courses]
  )

  return (
    <>
      <Head>
        <title>NinjaCo | Admin View Courses</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="flex w-full h-screen overflow-hidden">
        <SideMenu higlightCourses={true} />
        <div className="flex flex-col flex-grow w-3/4 h-full gap-4 py-8 px-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-2">
              <p className="text-brand-700 text-xl md:text-2xl lg:text-3xl font-semibold">
                Courses
              </p>
              <div className="text-sm text-brand  ">{courses.length} entries found</div>
            </div>
          </div>
          <Table columns={columns} rows={rows} width={'100%'} height={900} className="mr-4" />
        </div>
      </main>
    </>
  )
}

export default AdminCoursesView

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

  const api = new CourseApi(session)
  try {
    const response = await api.find()
    const courses = response.payload
    return {
      props: { courses },
    }
  } catch (error) {
    return {
      props: { courses: [] },
    }
  }
}
