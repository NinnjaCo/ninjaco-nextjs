import MultiImageCarousel from './multiImageCarousel'
import React from 'react'

interface Props {
  stepByStepImages: string[]
}

const ArduinoStepByStepGuide = ({ stepByStepImages }: Props) => {
  return (
    <div className="m-24">
      <div className="w-full text-start text-brand text-2xl font-bold my-12">
        Step by Step Guide :{' '}
      </div>
      <MultiImageCarousel images={stepByStepImages} />
    </div>
  )
}

export default ArduinoStepByStepGuide
