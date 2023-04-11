/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import * as yup from 'yup'
import { AdminAlertDialog } from '@/components/admin/dialog'
import { Alert } from '@/components/shared/alert'
import { AuthError } from '@/models/shared'
import { AxiosError } from 'axios'
import { ChevronRightIcon, PencilIcon } from '@heroicons/react/24/solid'
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline'
import {
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridTreeNodeWithRender,
} from '@mui/x-data-grid'
import { Input } from '@/components/forms/input'
import { Popover, Transition } from '@headlessui/react'
import { RoleEnum } from '@/models/crud/role.model'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '../api/auth/[...nextauth]'
import { getReadableDateFromISO } from '@/utils/shared'
import { getServerSession } from 'next-auth'
import { isAxiosError, unWrapAuthError } from '@/utils/errors'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useQueryClient } from 'react-query'
import { useSession } from 'next-auth/react'
import { yupResolver } from '@hookform/resolvers/yup'
import DatePickerWithHookForm from '@/components/forms/datePickerWithHookForm'
import Head from 'next/head'
import SideMenu from '@/components/admin/sideMenu'
import Table from '@/components/table'
import clsx from 'clsx'

type AddUserFormDataType = {
  firstName: string
  lastName: string
  dateOfBirth: Date
  email: string
  password: string
  passwordConfirmation: string
}

const AddUserFormSchema = yup
  .object()
  .shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup
      .string()
      .required('Last Name is required')
      .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
    dateOfBirth: yup
      .date()
      .max(new Date(), 'Date of Birth cannot be in the future')
      .required('Date of Birth is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Password Confirmation is required'),
  })
  .required()

const AdminUserView: React.FC<{ serverUsers: User[] }> = ({ serverUsers }) => {
  const session = useSession()
  const queryClient = useQueryClient()

  const { data: users } = useQuery<User[], Error>(
    'users',
    async () => {
      const res = await new UserApi(session.data).find()
      return res.payload.filter((user) => user.role.role === RoleEnum.USER)
    },
    {
      initialData: serverUsers,
      onError: (error) => {
        if (isAxiosError(error)) {
          const errors = unWrapAuthError(error as AxiosError<AuthError> | undefined)
          setAlertData({
            message: errors[0].message || 'Something went wrong',
            variant: 'error',
            open: true,
          })
        }
      },
    }
  )

  const [openAddUserDialog, setOpenAddUserDialog] = React.useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddUserFormDataType>({
    resolver: yupResolver(AddUserFormSchema),
  })

  const onSubmitHandler = async (data: AddUserFormDataType) => {
    try {
      closeAlert()

      await new UserApi(session.data).create({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth.toISOString(),
        email: data.email,
        password: data.password,
      })

      setOpenAddUserDialog(false)
      queryClient.invalidateQueries('users')
      setAlertData({
        message: 'User Created Successfully',
        variant: 'success',
        open: true,
      })
    } catch (error) {
      setOpenAddUserDialog(false)
      if (isAxiosError<AuthError>(error)) {
        const errors = unWrapAuthError(error)
        setAlertData({
          message: errors[0].message || 'Something went wrong',
          variant: 'error',
          open: true,
        })
      }
    }
  }

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
    dialogType: 'notify' | 'resetPassword' | 'delete'
  }>({
    open: false,
    title: '',
    detailsRows: [],
    backButtonText: 'Back',
    confirmButtonText: 'Confirm',
    dialogType: 'notify',
  })

  const [notifyMessage, setNotifyMessage] = React.useState<{
    message: string
    rowParams: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
  }>({
    message: '',
    rowParams: {} as GridRenderCellParams<any, any, any, GridTreeNodeWithRender>,
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
      case 'notify': {
        // send email to user
        console.log('Notify User', notifyMessage)
        break
      }
      case 'resetPassword': {
        try {
          if (resetPasswordState.password.length < 8) {
            setAlertData({
              message: 'Password must be at least 8 characters long',
              variant: 'error',
              open: true,
            })
            return
          }

          await new UserApi(session.data).update(resetPasswordState.rowParams.row.id, {
            password: resetPasswordState.password,
          })
          if (resetPasswordState.notifyUser) {
            // send email to user
          }

          queryClient.invalidateQueries('users')
          setAlertData({
            message: 'Password reset successfully',
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
              message: 'Error resetting password',
              variant: 'error',
              open: true,
            })
          }
        }
        break
      }
      case 'delete': {
        try {
          await new UserApi(session.data).delete(deleteUserState.rowParams.row.id)

          if (deleteUserState.notifyUser) {
            // send email to user
          }

          queryClient.invalidateQueries('users')
          setAlertData({
            message: 'User deleted successfully',
            variant: 'success',
            open: true,
          })
        } catch (error) {
          console.error(error)
          if (isAxiosError<AuthError>(error)) {
            const errors = unWrapAuthError(error)
            setAlertData({
              message: errors[0].message || 'Something went wrong',
              variant: 'error',
              open: true,
            })
          } else {
            setAlertData({
              message: 'Error deleting user',
              variant: 'error',
              open: true,
            })
          }
        }
        break
      }
    }
  }, [
    alertDiaglogState.dialogType,
    deleteUserState,
    notifyMessage,
    resetPasswordState,
    queryClient,
    session.data,
  ])

  const getDialogBody = useCallback(() => {
    switch (alertDiaglogState.dialogType) {
      case 'notify':
        return (
          <div className="flex flex-col" key="1">
            <label htmlFor="message" className="mb-2 text-sm font-medium text-brand">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="block p-2.5 w-full text-sm text-brand-500 bg-gray-50 rounded-lg border border-gray-300 focus:ring-brand-500 focus:border-brand-500"
              placeholder="Write your message here..."
              onChange={(e) => {
                setNotifyMessage({ ...notifyMessage, message: e.target.value })
              }}
              value={notifyMessage.message}
            ></textarea>
          </div>
        )
      case 'resetPassword':
        return (
          <div className="flex flex-col" key="1">
            <div className="flex items-center my-4">
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
              placeholder="Password"
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
            <div className="flex items-center my-4">
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
  }, [alertDiaglogState.dialogType, notifyMessage, resetPasswordState, deleteUserState])

  const editActions = useMemo(
    () => [
      {
        id: 1,
        text: 'Notify',
        onClick: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
          setAlertDialogState({
            title: 'Notify User',
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
            confirmButtonText: 'Send',
            confirmButtonClassName: 'bg-brand hover:bg-brand-500 text-white',
            open: true,
            dialogType: 'notify',
          })
          setNotifyMessage({
            ...notifyMessage,
            rowParams: params,
          })
        },
      },
      {
        id: 2,
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
        id: 3,
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
    [deleteUserState, notifyMessage, resetPasswordState]
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
        type: 'date',
        renderCell: (params) => getReadableDateFromISO(params.value as string),
        width: 140,
        minWidth: 140,
        headerClassName: 'bg-brand-200',
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
      {
        field: 'action',
        headerName: 'Action',
        width: 70,
        renderCell: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => (
          <Popover>
            {() => (
              <>
                <Popover.Button
                  className="group flex items-center text-brand-500 bg-brand-300 w-8 h-8 justify-center rounded hover:bg-brand-500 hover:text-brand-300"
                  role="button"
                  tabIndex={0}
                  aria-label="Edit User"
                >
                  <PencilIcon className={clsx('w-4 h-4 cursor-pointer')} />
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
      (users ?? serverUsers).map((user) => ({
        id: user._id,
        email: user.email,
        dob: new Date(user.dateOfBirth),
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
        action: user._id,
      })),
    [serverUsers, users]
  )

  return (
    <>
      <Head>
        <title>NinjaCo | Admin View Users</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <AdminAlertDialog
        title="Add User"
        open={openAddUserDialog}
        confirm={() => {}} // Confirmation is done inside the form body
        close={() => setOpenAddUserDialog(false)}
        backButtonText="Cancel"
        backButtonClassName="bg-brand-200 text-brand-500 hover:bg-brand-300 hover:text-brand hidden"
        confirmButtonText="Add User"
        confirmButtonClassName="bg-brand-500 text-brand-50 hover:bg-brand-700 hidden"
      >
        <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col gap-4" id="form">
          <Input
            {...register('firstName')}
            label={'First Name'}
            placeholder="John"
            StartIcon={UserIcon}
            error={errors.firstName?.message}
          />
          <Input
            {...register('lastName')}
            label={'Last Name'}
            placeholder="Smith"
            StartIcon={UserIcon}
            error={errors.lastName?.message}
          />
          <DatePickerWithHookForm
            control={control}
            name={register('dateOfBirth').name} // we only need the "name" prop
            label={'Date of Birth'}
            error={errors.dateOfBirth?.message}
          />
          <Input
            {...register('email')}
            label="Email"
            placeholder="Email"
            StartIcon={EnvelopeIcon}
            error={errors.email?.message}
          />
          <Input
            {...register('password')}
            type="password"
            label="Password"
            placeholder="Password"
            StartIcon={LockClosedIcon}
            error={errors.password?.message}
          />
          <Input
            {...register('passwordConfirmation')}
            type="password"
            label="Confirm Password"
            placeholder="Confirm Password"
            StartIcon={LockClosedIcon}
            error={errors.passwordConfirmation?.message}
          />
          <button
            type="submit"
            form="form"
            value="Submit"
            className="w-full btn bg-brand-200 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
          >
            Add User
          </button>
          <button
            onClick={() => setOpenAddUserDialog(false)}
            className="w-full btn bg-brand-50 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
          >
            Cancel
          </button>
        </form>
      </AdminAlertDialog>

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
        <SideMenu higlightUsers={true} />
        <div className="flex flex-col flex-grow w-3/4 h-full gap-4 py-8 px-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-2">
              <p className="text-brand-700 text-xl md:text-2xl lg:text-3xl font-semibold">Users</p>
              <div className="text-sm text-brand  ">
                {(users ?? serverUsers).length} entries found
              </div>
            </div>
            <button
              className="btn btn-secondary gap-2 text-brand rounded-lg hover:bg-brand-400 hover:text-white py-2"
              onClick={() => {
                setOpenAddUserDialog(true)
              }}
            >
              Add User
            </button>
          </div>
          <Alert
            open={alertData.open}
            message={alertData.message}
            variant={alertData.variant}
            close={closeAlert}
          />
          <Table columns={columns} rows={rows} width={'100%'} height={700} className="mr-4" />
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
  const users = response.payload.filter((user) => user.role.role === RoleEnum.USER)
  return {
    props: { serverUsers: users },
  }
}
