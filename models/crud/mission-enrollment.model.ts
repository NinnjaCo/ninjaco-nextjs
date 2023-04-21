import { Mission } from './mission.model'

export interface MissionEnrollment {
  _id: string
  mission: Mission
  startedAt: string
  completed: boolean
}

export interface MissionEnrollmentRequest {
  missionId: string
  completed?: boolean
}
