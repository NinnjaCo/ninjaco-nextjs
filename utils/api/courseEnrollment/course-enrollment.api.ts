import { ApiParam } from '../client'
import { AxiosRequestConfig } from 'axios'
import { Course } from '@/models/crud/course.model'
import { CourseEnrollment, CourseEnrollmentRequest } from '@/models/crud/course-enrollment.model'
import { CrudResponse } from '../crud'
import CrudApi from '../crud/crud.api'

export class CourseEnrollmentAPI extends CrudApi<CourseEnrollment, CourseEnrollmentRequest> {
  // change the path
  path = '/users-play-courses'
  constructor(param?: ApiParam) {
    super(param)
  }

  async findAll(
    userId: string,
    options?: AxiosRequestConfig | undefined
  ): Promise<CrudResponse<(CourseEnrollment | Course)[]>> {
    return (
      await this.client.get<CrudResponse<(CourseEnrollment | Course)[]>>(this.path, {
        ...options,
        params: {
          userId: userId,
        },
      })
    ).data
  }

  async findByCourseId(
    courseId: string,
    userId: string,
    options?: AxiosRequestConfig | undefined
  ): Promise<CrudResponse<CourseEnrollment | Course>> {
    return (
      await this.client.get<CrudResponse<CourseEnrollment | Course>>(`${this.path}/${courseId}`, {
        ...options,
        params: {
          userId: userId,
        },
      })
    ).data
  }
}
