import { Level } from './level.model'
import { LevelEnrollment } from './level-enrollment.model'
import { Mission } from './mission.model'

export interface MissionEnrollment {
  _id: string
  mission: Mission
  startedAt: string
  completed: boolean
  levels: LevelEnrollment[]
}

export interface MissionEnrollmentRequest {
  missionId: string
  completed?: boolean
}
