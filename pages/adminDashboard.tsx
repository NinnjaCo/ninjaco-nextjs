import Head from 'next/head'
import MenuSection from '@/components/admin/menuSection'
import React from 'react'

export default function AdminDashboard() {
  return (
    <>
      <Head>
        <title>Ninja Co | Admin Dashboard</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div>
          <MenuSection />
        </div>
      </main>
    </>
  )
}
