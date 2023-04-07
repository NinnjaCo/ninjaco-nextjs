import Head from 'next/head'
import Image from 'next/image'
import MenuSection from '@/components/admin/menuSection'
import React from 'react'
import leaderboard from '@/images/leaderboard_icon.svg'
import statistics from '@/images/statistics.svg'
import total_courses from '@/images/total_courses.svg'
import total_creators from '@/images/total_creators.svg'
import total_users from '@/images/total_users.svg'

export default function AdminDashboard() {
  return (
    <>
      <Head>
        <title>Ninja Co | Admin Dashboard</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex h-screen">
        <MenuSection />
        <div className="flex flex-col w-full">
          <div className="flex gap-3 pt-5 items-start pl-24">
            <Image src={statistics} alt="image" />
            <div className="text-brand-700 font-semibold text-3xl"> Statistics </div>
          </div>
          <div className=" bg-brand-50 ml-24 w-5/6 h-full md:h-2/3 lg:h-2/6 rounded-2xl flex flex-wrap gap-5 justify-around pt-10 relative">
            <div>
              <Image src={total_users} alt="image" />
              <div className="ml-14 text-brand-100 font-semibold text-xl -mt-[134px]">2560</div>
            </div>
            <div>
              <Image src={total_courses} alt="image" />
              <div className="ml-14 text-brand-100 font-semibold text-xl -mt-[134px]">10</div>
            </div>
            <div>
              <Image src={total_creators} alt="image" />
              <div className="ml-14 text-brand-100 font-semibold text-xl -mt-[134px]">210</div>
            </div>
          </div>
          <div className="flex gap-3 items-start pl-24  mt-5">
            <Image src={leaderboard} alt="image" />
            <div className="text-brand-700 font-semibold text-3xl"> Leaderboard </div>
          </div>
        </div>
      </main>
    </>
  )
}
