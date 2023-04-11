import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'
import Image from 'next/image'
import filter from '@/images/filter.svg'

export default function Home() {
  return (
    <>
      <Head>
        <title>Creator dashboard</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative h-screen w-full">
        <CreatorMenu />

        <div className="flex flex-row mt-32 justify-between">
          <div className="flex flex-col ml-14 gap-6">
            <div className="text-brand-700 font-semibold text-2xl ">courses</div>
            <div className="flex flex-row gap-10 justify-center">
              <div className="text-lg text-brand"> 210 enties</div>

              <button className="bg-brand-200 flex items-center  pl-2 gap-3 hover:bg-brand-400 text-lg font-semibold w-28 rounded-md text-brand-500 border-x-2 border-y-2 border-brand-700">
                <Image src={filter} alt="Hero Image " width={20}></Image>
                Filter
              </button>
            </div>
          </div>
          <div className="text-brand-700 font-semibold text-3xl mr-12 ">
            <button className="bg-secondary hover:bg-secondary-300 text-xl font-semibold w-40 h-10 rounded-xl text-brand-700 border-x-2 border-y-2 border-brand-700">
              Create course
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
