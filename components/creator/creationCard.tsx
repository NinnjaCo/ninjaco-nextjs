import Image from 'next/image'
import React from 'react'

type CreationCardProps = {
  children: React.ReactNode
  title: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  underLineImage: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  titleImage: any
}
const CreateResourceCard: React.FC<CreationCardProps> = ({
  children,
  title,
  underLineImage,
  titleImage,
}: CreationCardProps) => {
  return (
    <div className="grid grid-cols-12 w-full my-12 pb-12">
      <div className="col-start-2 md:col-start-3 col-span-10 md:col-span-8 shadow-2xl rounded-lg shadow-brand-100 px-6 md:px-12 lg:px-24 xl:px-32 pb-20">
        <div className="flex justify-between items-start">
          <div className="mt-12 font-bold text-brand-500 flex flex-col">
            <p className="text-lg md:text-xl lg:text-2xl">{title}</p>
            <Image src={underLineImage} alt="Waved Line" className="w-20 md:w-24" />
          </div>
          <Image
            src={titleImage}
            alt="Logo Pointing Down"
            className="w-20 md:w-28 lg:w-40 xl:w-48 animate-float"
            priority
          ></Image>
        </div>
        {children}
      </div>
    </div>
  )
}

export default CreateResourceCard
