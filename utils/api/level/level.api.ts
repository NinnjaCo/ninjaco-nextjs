import { ApiParam } from '../client'
import { Level, LevelRequest } from '@/models/crud/level.model'
import CrudApi from '../crud/crud.api'

export class LevelApi extends CrudApi<Level, LevelRequest> {
  path = '/courses'
  constructor(courseId: string, missionid: string, param?: ApiParam) {
    super(param)
    this.path = `/courses/${courseId}/missions/${missionid}/levels`
  }
}
