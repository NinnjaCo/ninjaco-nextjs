import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/20/solid'
import { Input } from '@/components/forms/input'
import Head from 'next/head'
import React from 'react'
import SideMenu from '@/components/admin/sideMenu'

export default function Profile() {
  return (
    <>
      <Head>
        <title>Ninja Co | Profile</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex h-full">
        <SideMenu higlightProfile={true} />
        <div className="flex flex-col w-full h-full gap-6 md:gap-12 py-8 px-4">
          <div className="flex w-full justify-between items-center">
            <div className="text-brand text-lg md:text-xl lg:text-2xl font-semibold">
              Raghid Khoury
            </div>
            <button className="btn btn-secondary px-4 sm:pr-6 py-2 hover:bg-brand-500 hover:text-white">
              SAVE
            </button>
          </div>
          <div className="bg-brand-50 p-4 rounded w-full flex flex-col gap-4">
            <div className="hidden md:block text-brand font-semibold text-sm md:text-base">
              Profile
            </div>
            <div className="flex flex-col md:flex-row flex-wrap w-full gap-2 md:gap-4">
              <div className="flex-1 flex-shrink">
                <Input label={'First Name'} placeholder="John" StartIcon={UserIcon} name={''} />
              </div>
              <div className="flex-1 flex-shrink">
                <Input label={'Last Name'} placeholder="Smith" StartIcon={UserIcon} name={''} />
              </div>
            </div>
            <div className="flex flex-col md:flex-row flex-wrap w-full gap-4">
              <div className="flex-1 flex-shrink">
                <Input
                  label="Date Of Birth"
                  placeholder={'DD/MM/YYYY'}
                  StartIcon={UserIcon}
                  name={''}
                />
              </div>
              <div className="flex-1 flex-shrink">
                <Input label="Email" placeholder={'Email'} StartIcon={EnvelopeIcon} name={''} />
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
                  label={'Password'}
                  placeholder="Password"
                  StartIcon={LockClosedIcon}
                  name={''}
                />
              </div>
              <div className="flex-1 flex-shrink">
                <Input
                  label={'Confirm Password'}
                  placeholder="Confirm Password"
                  StartIcon={LockClosedIcon}
                  name={''}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
