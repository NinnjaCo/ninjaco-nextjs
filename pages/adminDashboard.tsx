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
        {/* <div className="flex gap-3 pl-96 pt-24 items-start ">
          <Image src={statistics} alt="image" />
          <div className="text-brand-700 font-bold text-3xl"> Statistics </div>
        </div>
        <div className=" bg-brand-50 h-72 w-[1300px] ml-96 rounded-2xl mt-2 flex gap-16 justify-around pt-10">
          <div>
            <Image src={total_users} alt="image" />
            <div className="-mt-[184px] ml-20 text-brand-100 font-semibold text-3xl">2560</div>
          </div>
          <div>
            <Image src={total_courses} alt="image" />
            <div className="-mt-[184px] ml-20 text-brand-100 font-semibold text-3xl">10</div>
          </div>
          <div>
            <Image src={total_creators} alt="image" />
            <div className="-mt-[184px] ml-20 text-brand-100 font-semibold text-3xl">210</div>
          </div>
        </div>
        <div className="flex gap-3 items-start pl-96 mt-8">
          <Image src={leaderboard} alt="image" />
          <div className="text-brand-700 font-bold text-3xl"> Leaderboard </div>
        </div> */}
      </main>
    </>
  )
}
