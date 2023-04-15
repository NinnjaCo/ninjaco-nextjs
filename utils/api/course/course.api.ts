import { ApiParam } from '../client'
import { Course, CourseRequest } from '@/models/crud/course.model'
import CrudApi from '../crud/crud.api'

export class CourseApi extends CrudApi<Course, CourseRequest> {
  path = '/courses'
  constructor(param?: ApiParam) {
    super(param)
  }
}
