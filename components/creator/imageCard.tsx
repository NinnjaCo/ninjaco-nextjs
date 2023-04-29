import Image from 'next/image'
import React from 'react'

const ImageCard = ({ image }: { image: string }) => {
  return (
    <div className="relative bg-brand-100 border-brand-200 border-2 flex items-center justify-center rounded-md shadow-md w-fit h-fit">
      <div className="w-52 h-32 relative m-[3px]">
        <Image
          className="bg-brand-50 border-2 border-brand-200 rounded-md w-52 h-32"
          src={image}
          style={{
            objectFit: 'contain',
          }}
          fill
          sizes="(max-width: 768px) 40vw,
        (max-width: 1200px) 50vw,
        60vw"
          alt="PP"
          placeholder="blur"
          blurDataURL={image}
        />
      </div>
    </div>
  )
}

export default ImageCard
