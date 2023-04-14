import { Mission } from './mission.model'

enum CourseType {
  ARDUINO = 'ARDUINO',
  HTML = 'HTML',
}
export interface Course {
  _id: string
  createdAt: string
  updatedAt: string
  type: CourseType
  title: string
  description: string
  image: string
  ageRange?: string[]
  preRequisites?: string[]
  objectives?: string[]
  missions: Mission[]
}

export interface CourseRequest {
  type: CourseType
  title: string
  description: string
  image: string
  ageRange?: string[]
  preRequisites?: string[]
  objectives?: string[]
}
