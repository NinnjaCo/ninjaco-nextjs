import MultiImageCarousel from './multiImageCarousel'
import React from 'react'
import useTranslation from '@/hooks/useTranslation'

const ArduinoBuildingParts = ({ buildingPartsImages }: { buildingPartsImages: string[] }) => {
  const t = useTranslation()
  return (
    <div className="m-24">
      <div className="w-full text-start text-brand text-2xl font-bold my-12">
        {t.User.arduinoLevel.buildingPartMayNeed}{' '}
      </div>
      <MultiImageCarousel images={buildingPartsImages} />
    </div>
  )
}

export default ArduinoBuildingParts
