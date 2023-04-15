import { Level } from './level.model'

export interface Mission {
  _id: string
  title: string
  description: string
  image: string
  categoryId: string
  levels: Level[]
}

export interface MissionRequest {
  title: string
  description: string
  image: string
  categoryId: string
}
