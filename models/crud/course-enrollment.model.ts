import { Course } from './course.model'
import { User } from 'next-auth'

export interface CourseEnrollment {
  _id: string
  course: Course
  user: User
  completed: boolean
  startedAt: string
  createdAt: string
  updatedAt: string
}

export interface CourseEnrollmentRequest {
  userId: string
  courseId: string
  completed?: boolean
}
