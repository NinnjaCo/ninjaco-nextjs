/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import * as yup from 'yup'
import { AdminAlertDialog } from '@/components/admin/dialog'
import { Alert } from '@/components/shared/alert'
import { AuthError } from '@/models/shared'
import { AxiosError } from 'axios'
import { ChevronRightIcon, PencilIcon } from '@heroicons/react/24/solid'
import { EmailEnum } from '@/utils/api/email/email.api'
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
import { useEmailApi } from '@/utils/api/email/email.api'
import { useForm } from 'react-hook-form'
import { useQuery, useQueryClient } from 'react-query'
import { useSession } from 'next-auth/react'
import { yupResolver } from '@hookform/resolvers/yup'
import DatePickerWithHookForm from '@/components/forms/datePickerWithHookForm'
import Head from 'next/head'
import Link from 'next/link'
import SideMenu from '@/components/admin/sideMenu'
import Table from '@/components/table'
import clsx from 'clsx'
import useTranslation from '@/hooks/useTranslation'

type AddCreatorFormDataType = {
  firstName: string
  lastName: string
  dateOfBirth: Date
  email: string
  password: string
  passwordConfirmation: string
}

const AddCreatorFormSchema = yup
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
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const emailApi = useEmailApi(session)
  const t = useTranslation()

  const { data: users } = useQuery<User[], Error>(
    ['users', session],
    async () => {
      const res = await new UserApi(session).find()
      return res.payload.filter((user) => user.role.role === RoleEnum.CREATOR)
    },
    {
      initialData: serverUsers,
      enabled: !!session,
      onError: (error) => {
        if (isAxiosError(error)) {
          const errors = unWrapAuthError(error as AxiosError<AuthError> | undefined)
          setAlertData({
            message: errors[0].message || (t.Admin.Creators.somethingWentWrong as string),
            variant: 'error',
            open: true,
          })
        }
      },
    }
  )
  const [openCreatorAddDialog, setOpenCreatorAddDialog] = React.useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddCreatorFormDataType>({
    resolver: yupResolver(AddCreatorFormSchema),
  })

  const onSubmitHandler = async (data: AddCreatorFormDataType) => {
    try {
      closeAlert()

      await new UserApi(session).create({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth.toISOString(),
        email: data.email,
        password: data.password,
        role: RoleEnum.CREATOR,
        isVerified: true,
      })

      setOpenCreatorAddDialog(false)
      queryClient.invalidateQueries('users')
      setAlertData({
        message: t.Admin.Creators.createdSuccessfully as string,
        variant: 'success',
        open: true,
      })
    } catch (error) {
      setOpenCreatorAddDialog(false)
      if (isAxiosError<AuthError>(error)) {
        const errors = unWrapAuthError(error)
        setAlertData({
          message: errors[0].message || (t.Admin.Creators.somethingWentWrong as string),
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
    dialogType: 'resetPassword' | 'delete'
  }>({
    open: false,
    title: '',
    detailsRows: [],
    backButtonText: '',
    confirmButtonText: '',
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
        try {
          if (resetPasswordState.password.length < 8) {
            setAlertData({
              message: t.Admin.Creators.resetPassword as string,
              variant: 'error',
              open: true,
            })
            return
          }

          await new UserApi(session).update(resetPasswordState.rowParams.row.id, {
            password: resetPasswordState.password,
          })

          if (resetPasswordState.notifyUser) {
            // send email to user
            await emailApi.sendEmail({
              emailType: EmailEnum.RESET,
              receiverEmail: resetPasswordState.rowParams.row.email,
              message: t.Admin.Creators.resetPasswordsent as string,
            })
          }

          queryClient.invalidateQueries('users')
          setAlertData({
            message: t.Admin.Creators.resetPasswordSuccessfully as string,
            variant: 'success',
            open: true,
          })
        } catch (error) {
          if (isAxiosError<AuthError>(error)) {
            const errors = unWrapAuthError(error)
            setAlertData({
              message: errors[0].message || (t.Admin.Creators.somethingWentWrong as string),
              variant: 'error',
              open: true,
            })
          } else {
            setAlertData({
              message: t.Admin.Creators.errorResetingPassword as string,
              variant: 'error',
              open: true,
            })
          }
        }
        break
      }
      case 'delete': {
        try {
          await new UserApi(session).delete(deleteUserState.rowParams.row.id)
          if (deleteUserState.notifyUser) {
            // send email to user
            await emailApi.sendEmail({
              emailType: EmailEnum.DELETE,
              receiverEmail: deleteUserState.rowParams.row.email,
              message: deleteUserState.message,
            })
          }

          queryClient.invalidateQueries('users')
          setAlertData({
            message: t.Admin.Creators.userDeletedSuccessfully as string,
            variant: 'success',
            open: true,
          })
        } catch (error) {
          if (isAxiosError<AuthError>(error)) {
            const errors = unWrapAuthError(error)
            setAlertData({
              message: errors[0].message || (t.Admin.Creators.somethingWentWrong as string),
              variant: 'error',
              open: true,
            })
          } else {
            setAlertData({
              message: t.Admin.Creators.errorUpdatingProfile as string,
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
    resetPasswordState,
    session,
    queryClient,
    t,
    emailApi,
    deleteUserState,
  ])

  const getDialogBody = useCallback(() => {
    switch (alertDiaglogState.dialogType) {
      case 'resetPassword':
        return (
          <div className="flex flex-col" key="1">
            <div className="flex items-center my-4">
              <input
                name={t.Admin.Creators.notifyUser as string}
                type="checkbox"
                id="notify-user"
                checked={resetPasswordState.notifyUser}
                onChange={(e) => {
                  setResetPasswordState({ ...resetPasswordState, notifyUser: e.target.checked })
                }}
                className="w-4 h-4 accent-brand-500 bg-brand-100 border-brand-300 rounded focus:ring-brand-500 dark:focus:ring-brand-600 focus:ring-2"
              />
              <label htmlFor="notify-user" className="ml-2 block text-sm text-brand">
                {t.Admin.Creators.notifyByEmail as string}
              </label>
            </div>
            <label htmlFor="message" className="mb-2 text-sm font-medium text-brand">
              {t.Admin.Creators.newPassword as string}
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
                name={t.Admin.Creators.notifyUser as string}
                type="checkbox"
                id="notify-user"
                checked={deleteUserState.notifyUser}
                onChange={(e) => {
                  setDeleteUserState({ ...deleteUserState, notifyUser: e.target.checked })
                }}
                className="w-4 h-4 accent-brand-500 bg-brand-100 border-brand-300 rounded focus:ring-brand-500 dark:focus:ring-brand-600 focus:ring-2"
              />
              <label htmlFor="notify-user" className="ml-2 block text-sm text-brand">
                {t.Admin.Creators.notifyByEmail as string}
              </label>
            </div>
            <label htmlFor="message" className="mb-2 text-sm font-medium text-brand">
              {t.Admin.Creators.message as string}
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
  }, [alertDiaglogState, resetPasswordState, deleteUserState, t])

  const editActions = useMemo(
    () => [
      {
        id: 1,
        text: t.Admin.Creators.resetPass as string,
        onClick: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
          setAlertDialogState({
            title: t.Admin.Creators.resetPass as string,
            detailsRows: [
              {
                label: 'ID',
                value: params.row.id,
              },
              {
                label: t.Admin.Creators.name as string,
                value: `${params.row.firstName} ${params.row.lastName}`,
              },
              {
                label: 'Email',
                value: params.row.email,
              },
            ],
            backButtonText: t.Admin.Creators.cancel as string,
            confirmButtonText: t.Admin.Creators.reset as string,
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
        text: t.Admin.Creators.delete as string,
        textClassName: 'text-red-500',
        onClick: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
          setAlertDialogState({
            title: t.Admin.Creators.deleteUser as string,
            detailsRows: [
              {
                label: 'ID',
                value: params.row.id,
              },
              {
                label: t.Admin.Creators.name as string,
                value: `${params.row.firstName} ${params.row.lastName}`,
              },
              {
                label: 'Email',
                value: params.row.email,
              },
            ],
            backButtonText: t.Admin.Creators.cancel as string,
            confirmButtonText: t.Admin.Creators.delete as string,
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
    [deleteUserState, resetPasswordState, t]
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
        headerName: t.Admin.Creators.firstName as string,
        width: 140,
        minWidth: 140,
        headerClassName: 'bg-brand-200',
      },
      {
        field: t.Admin.Creators.lastName as string,
        headerName: 'Last Name',
        width: 140,
        minWidth: 140,
        headerClassName: 'bg-brand-200',
      },
      {
        field: 'dob',
        headerName: t.Admin.Creators.dateOfBirth as string,
        width: 140,
        renderCell: (params) => getReadableDateFromISO(params.value as string),
        minWidth: 140,
        type: 'date',
        headerClassName: 'bg-brand-200',
      },
      {
        field: 'createdAt',
        headerName: t.Admin.Creators.createdAt as string,
        type: 'date',
        renderCell: (params) => getReadableDateFromISO(params.value as string),
        width: 160,
        minWidth: 160,
        headerClassName: 'bg-brand-200',
        flex: 1,
      },
      {
        field: 'updatedAt',
        headerName: t.Admin.Creators.updatedAt as string,
        type: 'date',
        renderCell: (params) => getReadableDateFromISO(params.value as string),
        width: 160,
        minWidth: 160,
        headerClassName: 'bg-brand-200',
        flex: 1,
      },
      {
        field: 'action',
        headerName: t.Admin.Creators.action as string,
        width: 70,
        renderCell: (params) => (
          <Popover>
            {() => (
              <>
                <Popover.Button
                  className="group flex items-center text-brand-500 bg-brand-300 w-8 h-8 justify-center rounded hover:bg-brand-500 hover:text-brand-300"
                  role="button"
                  tabIndex={0}
                  aria-label={t.Admin.Creators.editUser as string}
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
    [editActions, t]
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
        <title>NinjaCo | Admin View Creators</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <AdminAlertDialog
        title={t.Admin.Creators.addCreators as string}
        open={openCreatorAddDialog}
        confirm={() => {}} // Confirmation is done inside the form body
        close={() => setOpenCreatorAddDialog(false)}
        backButtonText="Cancel"
        backButtonClassName="bg-brand-200 text-brand-500 hover:bg-brand-300 hover:text-brand hidden"
        confirmButtonText="Add User"
        confirmButtonClassName="bg-brand-500 text-brand-50 hover:bg-brand-700 hidden"
      >
        <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col gap-4" id="form">
          <Input
            {...register('firstName')}
            label={t.Admin.Creators.firstName as string}
            placeholder="John"
            StartIcon={UserIcon}
            error={errors.firstName?.message}
            isRequired={true}
          />
          <Input
            {...register('lastName')}
            label={t.Admin.Creators.lastName as string}
            placeholder="Smith"
            StartIcon={UserIcon}
            error={errors.lastName?.message}
            isRequired={true}
          />
          <DatePickerWithHookForm
            control={control}
            name={register('dateOfBirth').name} // we only need the "name" prop
            label={t.Admin.Creators.dateOfBirth as string}
            error={errors.dateOfBirth?.message}
            isRequired={true}
          />
          <Input
            {...register('email')}
            label="Email"
            placeholder="Email"
            StartIcon={EnvelopeIcon}
            error={errors.email?.message}
            isRequired={true}
          />
          <Input
            {...register('password')}
            type="password"
            label={t.Admin.Creators.password as string}
            placeholder={t.Admin.Creators.password as string}
            StartIcon={LockClosedIcon}
            error={errors.password?.message}
            isRequired={true}
          />
          <Input
            {...register('passwordConfirmation')}
            type="password"
            label={t.Admin.Creators.confirmPassword as string}
            placeholder={t.Admin.Creators.confirmPassword as string}
            StartIcon={LockClosedIcon}
            error={errors.passwordConfirmation?.message}
            isRequired={true}
          />
          <button
            type="submit"
            form="form"
            value="Submit"
            className="w-full btn bg-brand-200 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
          >
            {t.Admin.Creators.addCreators as string}
          </button>
          <button
            onClick={() => setOpenCreatorAddDialog(false)}
            className="w-full btn bg-brand-50 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
          >
            {t.Admin.Creators.cancel as string}
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
        <SideMenu higlightCreators={true} />
        <div className="flex flex-col flex-grow w-3/4 h-full gap-4 py-8 px-4">
          <div className="flex items-center justify-between w-full flex-wrap">
            <div className="flex flex-col gap-2">
              <p className="text-brand-700 text-xl md:text-2xl lg:text-3xl font-semibold">
                {t.Admin.Creators.creators as string}
              </p>
              <div className="text-sm text-brand ">
                {(users ?? serverUsers).length} {t.Admin.Creators.entriesFound as string}
              </div>
            </div>
            <Link href="/creator">
              <button className="btn btn-secondary gap-2 text-brand rounded-lg hover:bg-brand-500 hover:text-white py-2 px-4">
                Go To Creator Panel
              </button>
            </Link>
            <button
              className="btn btn-brand gap-2 text-white rounded-lg hover:bg-brand-400 hover:text-white py-2 px-4"
              onClick={() => {
                setOpenCreatorAddDialog(true)
              }}
            >
              {t.Admin.Creators.addCreators as string}
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
  try {
    const response = await api.find()
    const users = response.payload.filter((user) => user.role.role === RoleEnum.CREATOR)
    return {
      props: { serverUsers: users },
    }
  } catch (error) {
    return {
      props: { serverUsers: [] },
    }
  }
}
