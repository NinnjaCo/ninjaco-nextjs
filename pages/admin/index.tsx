import Head from 'next/head'
import Image from 'next/image'
import MenuSection from '@/components/admin/menuSection'
import React, { Fragment } from 'react'
import leaderboard from '@/images/leaderboard_icon.svg'
import profile_photo from '@/images/profile_photo.svg'
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
        {/* statistics */}
        <div className="flex flex-col w-full h-full">
          <div className="flex gap-3 pt-5 items-start pl-24">
            <Image src={statistics} alt="image" />
            <div className="text-brand-700 font-semibold text-3xl"> Statistics </div>
          </div>
          <div className=" bg-brand-50 ml-24 md:w-5/6 h-full md:h-3/4 rounded-2xl flex flex-wrap gap-32 md:gap-28 lg:gap-5 justify-around pt-10 relative">
            <div className="h-32 relative">
              <Image src={total_users} alt="image" className="w-full h-full" />
              <div className="text-brand-100 font-semibold text-xl absolute top-3 left-12">
                2560
              </div>
            </div>
            <div className="h-32 relative">
              <Image src={total_courses} alt="image" className="w-full h-full" />
              <div className="text-brand-100 font-semibold text-xl absolute top-3 left-12">10</div>
            </div>
            <div className="h-32 relative">
              <Image src={total_creators} alt="image" className="w-full h-full" />
              <div className="text-brand-100 font-semibold text-xl absolute top-3 left-12">20</div>
            </div>
          </div>
          {/* leaderboard */}

          <div className="flex gap-3 items-start pl-24  mt-14">
            <Image src={leaderboard} alt="image" />
            <div className="text-brand-700 font-semibold text-3xl"> Leaderboard </div>
          </div>
          <div className="relative overflow-x-auto h-fit">
            <table className="w-5/6 ml-24 text-sm text-left text-brand rounded-t-2xl">
              <thead className="text-brand w-max uppercase bg-brand-200 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Profile photo
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-brand-50">
                  <th scope="row" className="px-6 py-4  text-brand">
                    <Image src={profile_photo} alt="image" />
                  </th>
                  <td className="px-6 py-4">Raghid</td>
                  <td className="px-6 py-4">Raghidkhoury123@gmail.com</td>
                  <td className="px-6 py-4">27</td>
                  <td className="px-6 py-4">65</td>
                </tr>
                <tr className="bg-brand-50">
                  <th scope="row" className="px-6 py-4  text-brand">
                    <Image src={profile_photo} alt="image" />
                  </th>
                  <td className="px-6 py-4">Tony</td>
                  <td className="px-6 py-4">Tonybousleiman123@gmail.com</td>
                  <td className="px-6 py-4">25</td>
                  <td className="px-6 py-4">70</td>
                </tr>
                <tr className="bg-brand-50">
                  <th scope="row" className="px-6 py-4  text-brand">
                    <Image src={profile_photo} alt="image" />
                  </th>
                  <td className="px-6 py-4">Charbel</td>
                  <td className="px-6 py-4">Charbelfayad123@gmail.com</td>
                  <td className="px-6 py-4">45</td>
                  <td className="px-6 py-4">98</td>
                </tr>
                <tr className="bg-brand-50">
                  <th scope="row" className="px-6 py-4  text-brand">
                    <Image src={profile_photo} alt="image" />
                  </th>
                  <td className="px-6 py-4">Ahmad</td>
                  <td className="px-6 py-4">Ahmadissa123@gmail.com</td>
                  <td className="px-6 py-4">65</td>
                  <td className="px-6 py-4">87</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  )
}
