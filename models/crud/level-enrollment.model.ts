import { Level } from './level.model'
import { LevelProgress } from './level-progress.model'

export interface LevelEnrollment {
  _id: string
  level: Level
  levelProgress: LevelProgress
  startedAt: string
  completed: boolean
}

export interface LevelEnrollmentRequest {
  levelId: string
  completed?: boolean
}
