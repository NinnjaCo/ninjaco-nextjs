import * as yup from 'yup'
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/20/solid'
import { Input } from '@/components/forms/input'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import DatePickerWithHookForm from '@/components/forms/datePickerWithHookForm'
import Head from 'next/head'
import React from 'react'
import SideMenu from '@/components/admin/sideMenu'

type AdminProfileFormDataType = {
  firstName: string
  lastName: string
  dateOfBirth: Date
  email: string
  password: string
  passwordConfirmation: string
}

export default function Profile() {
  const AdminProfileFormSchema = yup
    .object()
    .shape({
      firstName: yup.string().required('First Name is required'),
      lastName: yup.string().required('Last Name is required'),
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
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AdminProfileFormDataType>({
    resolver: yupResolver(AdminProfileFormSchema),
  })

  // Handle form submission
  const submitHandler = (data: AdminProfileFormDataType) => {
    console.log(data)
  }

  return (
    <>
      <Head>
        <title>NinjaCo | Admin Profile</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex h-full">
        <SideMenu higlightProfile={true} />
        <form
          id="form"
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col w-full h-full gap-6 md:gap-12 py-8 px-4"
        >
          <div className="flex w-full justify-between items-center">
            <div className="text-brand text-lg md:text-xl lg:text-2xl font-semibold">
              Raghid Khoury
            </div>
            <button
              type="submit"
              form="form"
              value="Submit"
              className="btn btn-secondary px-4 sm:pr-6 py-2 hover:bg-brand-500 hover:text-white"
            >
              SAVE
            </button>
          </div>
          <div className="bg-brand-50 p-4 rounded w-full flex flex-col gap-4">
            <div className="hidden md:block text-brand font-semibold text-sm md:text-base">
              Profile
            </div>
            <div className="flex flex-col md:flex-row flex-wrap w-full gap-2 md:gap-4">
              <div className="flex-1 flex-shrink">
                <Input
                  {...register('firstName')}
                  label={'First Name'}
                  placeholder="John"
                  StartIcon={UserIcon}
                  error={errors.firstName?.message}
                />
              </div>
              <div className="flex-1 flex-shrink">
                <Input
                  {...register('lastName')}
                  label={'Last Name'}
                  placeholder="Smith"
                  StartIcon={UserIcon}
                  error={errors.lastName?.message}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row flex-wrap w-full gap-4">
              <div className="flex-1 flex-shrink">
                <DatePickerWithHookForm
                  control={control}
                  name={register('dateOfBirth').name} // we only need the "name" prop
                  label="Date of Birth"
                  error={errors.dateOfBirth?.message}
                />
              </div>
              <div className="flex-1 flex-shrink">
                <Input
                  {...register('email')}
                  label="Email"
                  placeholder={'Email'}
                  StartIcon={EnvelopeIcon}
                  error={errors.email?.message}
                />
              </div>
            </div>
          </div>
          <div className="bg-brand-50 p-4 rounded w-full flex flex-col gap-4">
            <div className="hidden md:block text-brand font-semibold text-sm md:text-base">
              Change Password
            </div>
            <div className="flex flex-col md:flex-row flex-wrap w-full gap-2 md:gap-4">
              <div className="flex-1 flex-shrink">
                <Input
                  {...register('password')}
                  label={'Password'}
                  placeholder="Password"
                  type="password"
                  StartIcon={LockClosedIcon}
                  error={errors.password?.message}
                />
              </div>
              <div className="flex-1 flex-shrink">
                <Input
                  {...register('passwordConfirmation')}
                  label={'Confirm Password'}
                  type="password"
                  placeholder="Confirm Password"
                  StartIcon={LockClosedIcon}
                  error={errors.passwordConfirmation?.message}
                />
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  )
}
