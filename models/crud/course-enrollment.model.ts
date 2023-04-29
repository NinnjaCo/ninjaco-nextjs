import { Course } from './course.model'
import { MissionEnrollment } from './mission-enrollment.model'
import { User } from 'next-auth'

export interface CourseEnrollment {
  _id: string
  course: Course
  user: User
  missions: MissionEnrollment[]
  completed: boolean
  enrolledAt: string
  createdAt: string
  updatedAt: string
}

export interface CourseEnrollmentRequest {
  userId: string
  courseId: string
  completed?: boolean
}
