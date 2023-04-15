import { ApiParam } from '../client'
import { Mission, MissionRequest } from '@/models/crud/mission.model'
import CrudApi from '../crud/crud.api'

export class MissionApi extends CrudApi<Mission, MissionRequest> {
  path = '/courses'
  constructor(courseId: string, param?: ApiParam) {
    super(param)
    this.path = `/courses/${courseId}/missions`
  }
}
