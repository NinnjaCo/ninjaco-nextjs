import { ApiFilter } from '@/api/shared'
import { ApiParam, CoreApi } from '@/api/client'
import { AxiosRequestConfig } from 'axios'
import { Uid } from '@/models/shared'

export interface CrudResponse<T> {
  paylaod: T
  timestamp: number
}

export default class CrudApi<Model, RequestModel> extends CoreApi {
  path = ''
  basePath = ''
  constructor(param?: ApiParam) {
    super(param)
  }

  setPath(path: string) {
    this.path = `${this.basePath}${path}`
  }

  async count(filter?: ApiFilter): Promise<number> {
    return (await this.client.get<number>(`${this.path}/count`, { params: filter })).data
  }

  async find(filter?: ApiFilter, options?: AxiosRequestConfig): Promise<CrudResponse<Model[]>> {
    return (await this.client.get<CrudResponse<Model[]>>(this.path, { ...options, params: filter }))
      .data
  }

  async findOne(id: Uid): Promise<CrudResponse<Model>> {
    return (await this.client.get<CrudResponse<Model>>(`${this.path}/${id}`)).data
  }

  async create(toCreate: RequestModel): Promise<CrudResponse<Model>> {
    return (await this.client.post<CrudResponse<Model>>(`${this.path}`, toCreate)).data
  }

  async update(id: Uid, toUpdate: Partial<RequestModel>): Promise<CrudResponse<Model>> {
    return (await this.client.put<CrudResponse<Model>>(`${this.path}/${id}`, toUpdate)).data
  }

  async delete(id: Uid): Promise<CrudResponse<Model>> {
    return (await this.client.delete<CrudResponse<Model>>(`${this.path}/${id}`)).data
  }
}
