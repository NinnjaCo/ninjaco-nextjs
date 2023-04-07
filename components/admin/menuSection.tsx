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
  const dash = [
    {
      icon: dashboard_logo,
      text: 'DASHBOARD',
    },
    {
      icon: open_book,
      text: 'COURSES',
    },
    {
      icon: user_group,
      text: 'USERS',
    },
    {
      icon: creators,
      text: 'CREATORS',
    },
  ]

  const dash2 = [
    {
      icon: profile_icon,
      text: 'PROFILE',
    },
    {
      icon: logout,
      text: 'LOGOUT',
    },
  ]
  return (
    <div className=" bg-brand h-screen w-1/5 flex flex-col justify-between items-center">
      <Image src={logo_white} alt="Hero Image" width={150} height={50} className=" mt-7"></Image>

      <div className="relative flex flex-col gap-3 w-2/3 ">
        {dash.map((item) => (
          <>
            <div className="bg-brand-300 h-px opacity-25" />
            <div key={item.text} className="flex gap-3 mb-4">
              <Image src={item.icon} alt="image"></Image>
              <button className="text-brand-300 font-semibold text-sm">{item.text}</button>
            </div>
          </>
        ))}
      </div>
      <div className="relative flex flex-col gap-3 w-2/3 ">
        {dash2.map((item) => (
          <>
            <div className="bg-brand-300  h-px opacity-25" />
            <div key={item.text} className="flex gap-3 mb-4">
              <Image src={item.icon} alt="image"></Image>
              <button className="text-brand-300 font-semibold text-sm">{item.text}</button>
            </div>
          </>
        ))}
      </div>
    </div>
  )
}

export default MenuSection
