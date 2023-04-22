import { ApiFilter } from '../shared/filter'
import { ApiParam } from '../client'
import { AxiosRequestConfig } from 'axios'
import { Level } from '@/models/crud/level.model'
import { LevelEnrollment, LevelEnrollmentRequest } from '@/models/crud/level-enrollment.model'
import CrudApi, { CrudResponse } from '../crud/crud.api'

export class LevelEnrollmentApi extends CrudApi<LevelEnrollment, LevelEnrollmentRequest> {
  path = '/course-enrollements'
  constructor(courseId: string, missionId: string, param?: ApiParam) {
    super(param)
    this.path = `/course-enrollements/${courseId}/missions/${missionId}/levels`
  }

  async findAll(
    filter?: ApiFilter | undefined,
    options?: AxiosRequestConfig | undefined
  ): Promise<CrudResponse<(Level | LevelEnrollment)[]>> {
    const { data } = await this.client.get(`${this.path}`, { params: filter, ...options })
    return data
  }
}
