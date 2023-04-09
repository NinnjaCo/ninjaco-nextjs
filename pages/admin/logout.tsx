import Head from 'next/head'
import Link from 'next/link'
import SideMenu from '@/components/admin/sideMenu'

export default function AdminDashboard() {
  return (
    <>
      <Head>
        <title>Ninja Co | Log Out</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex h-screen ">
        <SideMenu higlightDashboard={true} />
        <div className="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
          <div className="bg-white px-16 py-8 rounded-2xl text-center">
            <h1 className="text-lg mb-4 font-bold text-brand-700">
              Are you sure you want to logout?
            </h1>
            <Link href="/auth/signin">
              <button className="bg-red-500 px-3 py-2 rounded-xl text-sm text-white font-medium  hover:bg-red-600 ">
                LOG OUT
              </button>
            </Link>
            <Link href="/admin">
              <button className="bg-brand-100 px-5 py-2 ml-2 rounded-xl text-sm text-brand-900 font-medium  hover:bg-brand-200">
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
