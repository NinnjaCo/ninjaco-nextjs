export interface Level {
  _id: string
  levelNumber: number
  buildingPartsImages?: string[]
  stepGuideImages?: string[]
  websitePreviewImage?: string
}

export interface LevelRequest {
  levelNumber: number
  buildingPartsImages?: string[]
  stepGuideImages?: string[]
  websitePreviewImage?: string
}
