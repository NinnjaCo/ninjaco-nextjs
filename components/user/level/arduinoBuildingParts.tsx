import MultiImageCarousel from './multiImageCarousel'
import React from 'react'

const ArduinoBuildingParts = ({ buildingPartsImages }: { buildingPartsImages: string[] }) => {
  return (
    <div className="m-24">
      <div className="w-full text-start text-brand text-2xl font-bold my-12">
        Building Parts that Might be Need :{' '}
      </div>
      <MultiImageCarousel images={buildingPartsImages} />
    </div>
  )
}

export default ArduinoBuildingParts
