import { EnvelopeIcon, UserIcon } from '@heroicons/react/20/solid'
import { Input } from '@/components/forms/input'
import Head from 'next/head'
import MenuSection from '@/components/admin/menuSection'

export default function Profile() {
  return (
    <>
      <Head>
        <title>Ninja Co | Profile</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex h-screen ">
        <MenuSection />
        <div className="flex flex-col w-full ">
          {/* name and save button */}
          <div className="flex pl-16 mt-10 justify-between items-center">
            <div className="text-brand-700 text-2xl font-semibold">Ahmad Issa</div>
            <div className="btn rounded-xl px-8 border-2 border-brand mr-44">
              <p> Save</p>
            </div>
          </div>
          {/* profile */}
          <div className="bg-brand-50 mt-7 mr-44 mx-16 h-2/5 flex flex-col">
            <div className=" text-brand-700 text-base pt-3 pl-5">Profile</div>
            {/* first name last name */}

            <div className="flex flex-row gap-96 pl-5">
              <Input label={'First Name'} placeholder="John" StartIcon={UserIcon} name={''} />
              <Input label={'Last Name'} placeholder="Smith" StartIcon={UserIcon} name={''} />
            </div>
            <div className="flex flex-row gap-96 pl-5">
              <Input label={'Email'} placeholder={'Email'} StartIcon={EnvelopeIcon} name={''} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
