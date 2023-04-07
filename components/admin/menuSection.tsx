import Image from 'next/image'
import React from 'react'
import creators from '@/images/creators.svg'
import dashboard_logo from '@/images/dashboard_logo.svg'
import logo_white from '@/images/logo_white.svg'
import logout from '@/images/logout.svg'
import open_book from '@/images/open_book.svg'
import profile_icon from '@/images/profile_icon.svg'
import user_group from '@/images/user_group.svg'

const MenuSection = () => {
  return (
    <div className="bg-brand w-72 h-screen ">
      <div className="absolute top-8 left-16">
        <Image src={logo_white} alt="Hero Image" width={150} height={50}></Image>
      </div>

      <div className="flex flex-col gap-3 pt-64 pl-16 ">
        <div className="bg-brand-300 w-52 h-[2px] opacity-25 -ml-5" />
        <div className="flex gap-5 mb-4">
          <Image src={dashboard_logo} alt="dash logo"></Image>
          <button className="text-brand-300 font-semibold"> DASHBOARD</button>
        </div>
        <div className="bg-brand-300 w-52 h-[2px] opacity-25 -ml-5" />
        <div className="flex gap-5 mb-4">
          <Image src={open_book} alt="open_book"></Image>
          <button className="text-brand-300 font-semibold"> COURSES</button>
        </div>
        <div className="bg-brand-300 w-52 h-[2px] opacity-25 -ml-5" />
        <div className="flex gap-5 mb-4">
          <Image src={user_group} alt="user group"></Image>
          <button className="text-brand-300 font-semibold"> USERS</button>
        </div>
        <div className="bg-brand-300 w-52 h-[2px] opacity-25 -ml-5" />
        <div className="flex gap-5 mb-4">
          <Image src={creators} alt="creators"></Image>
          <button className="text-brand-300 font-semibold"> CREATORS</button>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-64 pl-16 ">
        <div className="bg-brand-300 w-52 h-[2px] opacity-25 -ml-5" />
        <div className="flex gap-5 mb-4">
          <Image src={profile_icon} alt="dash logo"></Image>
          <button className="text-brand-300 font-semibold"> PROFILE</button>
        </div>
        <div className="bg-brand-300 w-52 h-[2px] opacity-25 -ml-5" />
        <div className="flex gap-5 mb-4">
          <Image src={logout} alt="open_book"></Image>
          <button className="text-brand-300 font-semibold"> LOGOUT</button>
        </div>
      </div>
    </div>
  )
}

export default MenuSection
