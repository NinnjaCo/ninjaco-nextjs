import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/20/solid'
import { Input } from '@/components/forms/input'

import Head from 'next/head'
import MenuSection from '@/components/admin/menuSection'
import React from 'react'

export default function Profile() {
  return (
    <>
      <Head>
        <title>Ninja Co | Profile</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex h-screen ">
        <MenuSection />
        <div className="flex flex-col w-full">
          {/* name and save button */}
          <div className="flex mt-10 w-5/6 justify-between items-center">
            <div className="text-brand-700 pl-16 text-lg md:text-xl lg:text-2xl font-semibold">
              Raghid Khoury
            </div>
            <div className="btn rounded-xl text-xs md:text-sm px-3 md:px-5 lg:px-8 py-2 md:py-3 border-2 border-brand">
              <p> Save</p>
            </div>
          </div>
          {/* profile */}
          <div className="bg-brand-50 mt-7 mx-16 py-5 h-max w-fit flex flex-col gap-4 md:gap-0">
            <div className="hidden md:block text-brand-700 text-sm md:text-base pl-3">Profile</div>
            {/* first name last name */}

            <div className="flex flex-row  gap-2 md:gap-44 lg:gap-80 px-3 md:xl-5">
              <Input
                label={'First Name'}
                placeholder="John"
                StartIcon={UserIcon}
                name={''}
                className="w-20 h-10"
              />
              <Input label={'Last Name'} placeholder="Smith" StartIcon={UserIcon} name={''} />
            </div>
            <div className="flex flex-row  gap-2 md:gap-44 lg:gap-80 px-3 md:xl-5">
              <Input
                label="Date Of Birth"
                placeholder={'DD/MM/YYYY'}
                StartIcon={UserIcon}
                name={''}
              />
              <Input label="Email" placeholder={'Email'} StartIcon={EnvelopeIcon} name={''} />
            </div>
          </div>
          <div className="bg-brand-50 mt-7 mx-16 py-5 h-max w-fit flex flex-col gap-4 md:gap-0">
            <div className=" hidden md:block text-brand-700 text-sm md:text-base pl-3">
              Change Password
            </div>
            <div className="flex flex-row gap-2 md:gap-44 lg:gap-80 px-3 md:xl-5">
              <Input
                type="password"
                label={'Password'}
                placeholder={'Password'}
                StartIcon={LockClosedIcon}
                name={''}
              />
              <Input
                type="password"
                label={'Confirm Password'}
                placeholder={'Confirm Password'}
                StartIcon={LockClosedIcon}
                name={''}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
