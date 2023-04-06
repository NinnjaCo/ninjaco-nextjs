import Image from 'next/image'
import React from 'react'
import Star from '@/components/landingPage/star'
import clsx from 'clsx'
import testimonialBlueB from '@/images/testimonialBlueB.svg'
import testimonialYellowB from '@/images/testimonialYellowB.svg'

const Testimonial: React.FC<{ name: string; review: string; isBlue: boolean }> = (props) => {
  const testimonialImage = props.isBlue ? testimonialBlueB : testimonialYellowB
  return (
    <div className="relative">
      <Image src={testimonialImage} alt={'Testimonial'} />
      <div className="absolute top-1/4 w-full px-8 flex flex-col gap-1 xs:gap-3">
        <div className="text-3xs xs:text-xs md:text-base font-semibold text-brand">
          {props.review}
        </div>
        <div className="flex flex-col gap-0 xs:gap-1 md:gap-2">
          <div className="text-xs xs:text-xl md:text-2xl font-semibold text-brand-700">
            {props.name}
          </div>
          <div className="flex">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <Star
                  key={index}
                  className={clsx(props.isBlue ? 'text-secondary' : 'text-brand')}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonial
