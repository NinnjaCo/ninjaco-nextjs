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
    <div className="bg-brand w-72 h-screen ">
      <div className="absolute top-8 left-16">
        <Image src={logo_white} alt="Hero Image" width={150} height={50}></Image>
      </div>

      <div className="flex flex-col gap-3 pt-64 pl-16 ">
        {dash.map((item) => (
          <>
            <div className="bg-brand-300 w-52 h-[2px] opacity-25 -ml-5" />
            <div key={item.text} className="flex gap-5 mb-4">
              <Image src={item.icon} alt="image"></Image>
              <button className="text-brand-300 font-semibold">{item.text}</button>
            </div>
          </>
        ))}
      </div>
      <div className="flex flex-col gap-3 pt-64 pl-16 ">
        {dash2.map((item) => (
          <>
            <div className="bg-brand-300 w-52 h-[2px] opacity-25 -ml-5" />
            <div key={item.text} className="flex gap-5 mb-4">
              <Image src={item.icon} alt="image"></Image>
              <button className="text-brand-300 font-semibold">{item.text}</button>
            </div>
          </>
        ))}
      </div>
    </div>
  )
}

export default MenuSection
