import { ApiParam } from '../client'
import { Mission, MissionRequest } from '@/models/crud/mission.model'
import CrudApi from '../crud/crud.api'

export class MissionEnrollmentApi extends CrudApi<Mission, MissionRequest> {
  path = '/course-enrollements'
  constructor(courseId: string, param?: ApiParam) {
    super(param)
    this.path = `/courses/${courseId}/missions`
  }
}
