export interface Level {
  _id: string
  levelNumber: number
  buildingPartsImages: string[]
  stepGuideImages: string[]
}

export interface LevelRequest {
  levelNumber: number
  buildingPartsImages: string[]
  stepGuideImages: string[]
}
