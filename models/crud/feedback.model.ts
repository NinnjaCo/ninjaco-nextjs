import { Course } from './course.model'
import { Level } from './level.model'
import { Mission } from './mission.model'
import { User } from 'next-auth'

export interface Feedback {
  _id: string
  user: User
  course: Course
  mission: Mission
  level: Level
  rating: number
  message?: string
}

export interface FeedbackRequest {
  userId: string
  courseId: string
  missionId: string
  levelId: string
  rating: number
  message?: string
}
