import { ApiFilter } from '../shared'
import { ApiParam } from '../client'
import { AxiosRequestConfig } from 'axios'
import { Mission } from '@/models/crud/mission.model'
import { MissionEnrollment, MissionEnrollmentRequest } from '@/models/crud/mission-enrollment.model'
import CrudApi, { CrudResponse } from '../crud/crud.api'

export class MissionEnrollmentApi extends CrudApi<MissionEnrollment, MissionEnrollmentRequest> {
  path = '/course-enrollements'
  constructor(courseId: string, param?: ApiParam) {
    super(param)
    this.path = `/course-enrollements/${courseId}/missions`
  }

  async findAll(
    filter?: ApiFilter | undefined,
    options?: AxiosRequestConfig | undefined
  ): Promise<CrudResponse<(Mission | MissionEnrollment)[]>> {
    const { data } = await this.client.get(`${this.path}`, { params: filter, ...options })
    return data
  }

  async findMissionById(
    missionId: string,
    options?: AxiosRequestConfig | undefined
  ): Promise<CrudResponse<MissionEnrollment | Mission>> {
    return (
      await this.client.get<CrudResponse<MissionEnrollment | Mission>>(
        `${this.path}/${missionId}`,
        {
          ...options,
        }
      )
    ).data
  }
}
