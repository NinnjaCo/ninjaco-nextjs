/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { AdminAlertDialog } from '@/components/admin/dialog'
import { Alert } from '@/components/shared/alert'
import { AuthError } from '@/models/shared'
import { ChevronRightIcon, PencilIcon } from '@heroicons/react/24/solid'
import {
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridTreeNodeWithRender,
} from '@mui/x-data-grid'
import { Popover, Transition } from '@headlessui/react'
import { RoleEnum } from '@/models/crud/role.model'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '../api/auth/[...nextauth]'
import { getReadableDateFromISO } from '@/utils/shared'
import { getServerSession } from 'next-auth'
import { isAxiosError, unWrapAuthError } from '@/utils/errors'
import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import SideMenu from '@/components/admin/sideMenu'
import Table from '@/components/table'
import clsx from 'clsx'

const AdminUserView: React.FC<{ users: User[] }> = ({ users }) => {
  const session = useSession()
  const router = useRouter()
  const [alertData, setAlertData] = React.useState<{
    message: string
    variant: 'success' | 'info' | 'warning' | 'error'
    open: boolean
  }>({
    message: '',
    variant: 'info',
    open: false,
  })
  const closeAlert = () => {
    setAlertData({ ...alertData, open: false })
  }

  const [alertDiaglogState, setAlertDialogState] = React.useState<{
    open: boolean
    title: string
    detailsRows?: { label: string; value: string }[]
    backButtonText?: string
    backButtonClassName?: string
    confirmButtonText?: string
    confirmButtonClassName?: string
    dialogType: 'resetPassword' | 'delete'
  }>({
    open: false,
    title: '',
    detailsRows: [],
    backButtonText: 'Back',
    confirmButtonText: 'Confirm',
    dialogType: 'resetPassword',
  })

  const [resetPasswordState, setResetPasswordState] = React.useState<{
    password: string
    notifyUser: boolean
    rowParams: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
  }>({
    password: '',
    notifyUser: false,
    rowParams: {} as GridRenderCellParams<any, any, any, GridTreeNodeWithRender>,
  })

  const [deleteUserState, setDeleteUserState] = React.useState<{
    message: string
    notifyUser: boolean
    rowParams: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
  }>({
    message: '',
    notifyUser: false,
    rowParams: {} as GridRenderCellParams<any, any, any, GridTreeNodeWithRender>,
  })

  const preformDialogConfirmAction = useCallback(async () => {
    switch (alertDiaglogState.dialogType) {
      case 'resetPassword': {
        console.log('Reset Password', resetPasswordState)
        break
      }
      case 'delete': {
        try {
          await new UserApi(session.data).delete(resetPasswordState.rowParams.row.id)

          // reload the page
          router.reload()
          setAlertData({
            message: 'User deleted successfully',
            variant: 'success',
            open: true,
          })
        } catch (error) {
          if (isAxiosError<AuthError>(error)) {
            const errors = unWrapAuthError(error)
            setAlertData({
              message: errors[0].message || 'Something went wrong',
              variant: 'error',
              open: true,
            })
          } else {
            setAlertData({
              message: 'Error updating profile',
              variant: 'error',
              open: true,
            })
          }
        }
        break
      }
    }
  }, [alertDiaglogState.dialogType, resetPasswordState, router, session.data])

  const getDialogBody = useCallback(() => {
    switch (alertDiaglogState.dialogType) {
      case 'resetPassword':
        return (
          <div className="flex flex-col" key="1">
            <div className="flex items-center mt-4">
              <input
                name="notify-user"
                type="checkbox"
                id="notify-user"
                checked={resetPasswordState.notifyUser}
                onChange={(e) => {
                  setResetPasswordState({ ...resetPasswordState, notifyUser: e.target.checked })
                }}
                className="w-4 h-4 accent-brand-500 bg-brand-100 border-brand-300 rounded focus:ring-brand-500 dark:focus:ring-brand-600 focus:ring-2"
              />
              <label htmlFor="notify-user" className="ml-2 block text-sm text-brand">
                Notify them by sending an email
              </label>
            </div>
            <label htmlFor="message" className="mb-2 text-sm font-medium text-brand">
              New Password
            </label>
            <input
              id="password"
              className="block w-full px-4 py-2 text-brand-700 placeholder-brand-400 border border-brand-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Write your message here..."
              onChange={(e) => {
                setResetPasswordState({ ...resetPasswordState, password: e.target.value })
              }}
              value={resetPasswordState.password}
            ></input>
          </div>
        )
      case 'delete':
        return (
          <div className="flex flex-col" key="1">
            <div className="flex items-center mt-4">
              <input
                name="notify-user"
                type="checkbox"
                id="notify-user"
                checked={deleteUserState.notifyUser}
                onChange={(e) => {
                  setDeleteUserState({ ...deleteUserState, notifyUser: e.target.checked })
                }}
                className="w-4 h-4 accent-brand-500 bg-brand-100 border-brand-300 rounded focus:ring-brand-500 dark:focus:ring-brand-600 focus:ring-2"
              />
              <label htmlFor="notify-user" className="ml-2 block text-sm text-brand">
                Notify them by sending an email
              </label>
            </div>
            <label htmlFor="message" className="mb-2 text-sm font-medium text-brand">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="block p-2.5 w-full text-sm text-brand-500 bg-gray-50 rounded-lg border border-gray-300 focus:ring-brand-500 focus:border-brand-500"
              placeholder="Write your message here..."
              onChange={(e) => {
                setDeleteUserState({ ...deleteUserState, message: e.target.value })
              }}
              value={deleteUserState.message}
            ></textarea>
          </div>
        )
    }
  }, [alertDiaglogState.dialogType, resetPasswordState, deleteUserState])

  const editActions = useMemo(
    () => [
      {
        id: 1,
        text: 'Reset Password',
        onClick: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
          setAlertDialogState({
            title: 'Reset Password',
            detailsRows: [
              {
                label: 'ID',
                value: params.row.id,
              },
              {
                label: 'Name',
                value: `${params.row.firstName} ${params.row.lastName}`,
              },
              {
                label: 'Email',
                value: params.row.email,
              },
            ],
            backButtonText: 'Cancel',
            confirmButtonText: 'Reset',
            confirmButtonClassName: 'bg-brand hover:bg-brand-500 text-white',
            open: true,
            dialogType: 'resetPassword',
          })
          setResetPasswordState({
            ...resetPasswordState,
            rowParams: params,
          })
        },
      },
      {
        id: 2,
        text: 'Delete',
        textClassName: 'text-red-500',
        onClick: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
          setAlertDialogState({
            title: 'Delete User',
            detailsRows: [
              {
                label: 'ID',
                value: params.row.id,
              },
              {
                label: 'Name',
                value: `${params.row.firstName} ${params.row.lastName}`,
              },
              {
                label: 'Email',
                value: params.row.email,
              },
            ],
            backButtonText: 'Cancel',
            confirmButtonText: 'Delete',
            confirmButtonClassName: 'bg-error-dark hover:bg-error text-white',
            open: true,
            dialogType: 'delete',
          })
          setDeleteUserState({
            ...deleteUserState,
            rowParams: params,
          })
        },
      },
    ],
    [deleteUserState, resetPasswordState]
  )

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
          <Popover>
            {() => (
              <>
                <Popover.Button
                  className="group flex items-center bg-brand-300 w-8 h-8 justify-center rounded hover:bg-brand-500"
                  role="button"
                  tabIndex={0}
                  aria-label="Edit User"
                >
                  <PencilIcon
                    className={clsx('w-4 h-4 cursor-pointer text-brand-500 hover:text-brand-300')}
                  />
                </Popover.Button>
                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute z-20 right-8">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-brand ring-opacity-5">
                      <div className="relative flex flex-col bg-brand-50">
                        {editActions.map((action) => {
                          return (
                            <button
                              key={action.id}
                              className="w-full flex justify-between px-4 py-2 items-center gap-4 text-brand hover:bg-brand-200 font-medium"
                              onClick={() => action.onClick(params)}
                            >
                              <p className={clsx(action.textClassName)}>{action.text}</p>
                              <ChevronRightIcon className="w-4 h-4" />
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        ),
        headerClassName: 'bg-brand-200',
        sortable: false,
        filterable: false,
        hideable: false,
        minWidth: 70,
        flex: 1,
      },
    ],
    [editActions]
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
      <AdminAlertDialog
        title={alertDiaglogState.title}
        detailsRows={alertDiaglogState.detailsRows}
        open={alertDiaglogState.open}
        confirm={() => {
          preformDialogConfirmAction()
          setAlertDialogState({ ...alertDiaglogState, open: false })
        }}
        close={() => setAlertDialogState({ ...alertDiaglogState, open: false })}
        backButtonText={alertDiaglogState.backButtonText}
        backButtonClassName={alertDiaglogState.backButtonClassName}
        confirmButtonText={alertDiaglogState.confirmButtonText}
        confirmButtonClassName={alertDiaglogState.confirmButtonClassName}
      >
        {getDialogBody()}
      </AdminAlertDialog>
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
          <Alert
            open={alertData.open}
            message={alertData.message}
            variant={alertData.variant}
            close={closeAlert}
          />
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
  const response = await api.find()

  const creators = response.payload.filter((user) => user.role.role === RoleEnum.CREATOR)

  return {
    props: { users: creators },
  }
}
