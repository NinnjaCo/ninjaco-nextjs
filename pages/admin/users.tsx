import Head from 'next/head'
import Image from 'next/image'
import MenuSection from '@/components/admin/menuSection'
import React, { Fragment } from 'react'

import pen_logo from '@/images/pen_logo.svg'

export default function AdminUserView() {
  return (
    <>
      <Head>
        <title>Ninja Co | Admin Users View</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex h-screen">
        <MenuSection />

        {/* leaderboard */}

        <div className="relative overflow-x-auto h-fit">
          <table className="w-5/6 ml-24 text-sm text-left text-brand rounded-t-2xl">
            <thead className="text-brand w-max uppercase bg-brand-200 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID
                </th>
                <th scope="col" className="px-6 py-3">
                  First Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Last Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Date of Birth
                </th>
                <th scope="col" className="px-6 py-3">
                  Createt At
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-brand-50">
                <th scope="row" className="px-6 py-4  text-brand">
                  <td className=" py-4">1</td>
                </th>

                <td className="px-6 py-4">Raghid</td>
                <td className="px-6 py-4">khoury</td>
                <td className="px-6 py-4">raghid@gmail.commmm</td>
                <td className="px-6 py-4">1/1/1000</td>
                <td className="px-6 py-4">20/2/2003</td>
                <td className="px-6 py-4">
                  <div className="btn">hello</div>
                </td>
              </tr>
              <tr className="bg-brand-50">
                <th scope="row" className="px-6 py-4  text-brand">
                  <td className=" py-4">2</td>
                </th>
                <td className="px-6 py-4">Raghid</td>
                <td className="px-6 py-4">khoury</td>
                <td className="px-6 py-4">raghid@gmail.commmm</td>
                <td className="px-6 py-4">1/1/1000</td>
                <td className="px-6 py-4">20/2/2003</td>
              </tr>
              <tr className="bg-brand-50">
                <th scope="row" className="px-6 py-4  text-brand">
                  <td className=" py-4">3</td>
                </th>
                <td className="px-6 py-4">Raghid</td>
                <td className="px-6 py-4">khoury</td>
                <td className="px-6 py-4">raghid@gmail.commmm</td>
                <td className="px-6 py-4">1/1/1000</td>
                <td className="px-6 py-4">20/2/2003</td>
              </tr>
              <tr className="bg-brand-50">
                <th scope="row" className="px-6 py-4  text-brand">
                  <td className=" py-4">4</td>
                </th>
                <td className="px-6 py-4">Raghid</td>
                <td className="px-6 py-4">khoury</td>
                <td className="px-6 py-4">raghid@gmail.commmm</td>
                <td className="px-6 py-4">1/1/1000</td>
                <td className="px-6 py-4">20/2/2003</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}
