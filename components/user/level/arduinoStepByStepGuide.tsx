import MultiImageCarousel from './multiImageCarousel'
import React from 'react'
import useTranslation from '@/hooks/useTranslation'

interface Props {
  stepByStepImages: string[]
}

const ArduinoStepByStepGuide = ({ stepByStepImages }: Props) => {
  const t = useTranslation()
  return (
    <div className="m-24">
      <div className="w-full text-start text-brand text-2xl font-bold my-4">
        {t.User.arduinoLevel.stepByStep}{' '}
      </div>
      <MultiImageCarousel images={stepByStepImages} isLarge={true} />
    </div>
  )
}

export default ArduinoStepByStepGuide
