import { Level } from './level.model'

export interface LevelEnrollment {
  _id: string
  level: Level
  startedAt: string
  completed: boolean
}

export interface LevelEnrollmentRequest {
  levelId: string
  completed?: boolean
}
