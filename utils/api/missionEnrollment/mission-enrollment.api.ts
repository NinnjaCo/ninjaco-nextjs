import { ApiFilter } from '../shared'
import { ApiParam } from '../client'
import { AxiosRequestConfig } from 'axios'
import { Mission, MissionRequest } from '@/models/crud/mission.model'
import { MissionEnrollment } from '@/models/crud/mission-enrollment.model'
import CrudApi, { CrudResponse } from '../crud/crud.api'

export class MissionEnrollmentApi extends CrudApi<Mission, MissionRequest> {
  path = '/course-enrollements'
  constructor(courseId: string, param?: ApiParam) {
    super(param)
    this.path = `/courses/${courseId}/missions`
  }

  async findAll(
    filter?: ApiFilter | undefined,
    options?: AxiosRequestConfig | undefined
  ): Promise<CrudResponse<(Mission | MissionEnrollment)[]>> {
    const { data } = await this.client.get(`${this.path}`, { params: filter, ...options })
    return data
  }
}
