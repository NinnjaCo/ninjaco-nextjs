import { ApiFilter } from '@/api/shared'
import { ApiParam, CoreApi } from '@/api/client'
import { AxiosRequestConfig } from 'axios'
import { Uid } from '@/models/shared'

export default class CrudApi<Model, RequestModel> extends CoreApi {
  path = ''
  basePath = '/api'
  constructor(param?: ApiParam) {
    super(param)
  }

  setPath(path: string) {
    this.path = `${this.basePath}${path}`
  }

  async count(filter?: ApiFilter): Promise<number> {
    return (await this.client.get<number>(`${this.path}/count`, { params: filter })).data
  }

  async find(filter?: ApiFilter, options?: AxiosRequestConfig): Promise<Model[]> {
    return (await this.client.get<Model[]>(this.path, { ...options, params: filter })).data
  }

  async findOne(id: Uid): Promise<Model> {
    return (await this.client.get<Model>(`${this.path}/${id}`)).data
  }

  async create(toCreate: RequestModel): Promise<Model> {
    return (await this.client.post<Model>(`${this.path}`, toCreate)).data
  }

  async update(id: Uid, toUpdate: Partial<RequestModel>): Promise<Model> {
    return (await this.client.put<Model>(`${this.path}/${id}`, toUpdate)).data
  }

  async delete(id: Uid): Promise<Uid> {
    return (await this.client.delete<Uid>(`${this.path}/${id}`)).data
  }
}
