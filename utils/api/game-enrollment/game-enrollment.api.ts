import { ApiParam } from '../client'
import { UserPlayGame, UserPlayGameRequest } from '@/models/crud/game-enrollment.model'
import CrudApi, { CrudResponse } from '../crud/crud.api'
import { AxiosRequestConfig } from 'axios'
import { ApiFilter } from '../shared'
import { Game } from '@/models/crud/game.model'

export class GameEnrollmentAPI extends CrudApi<UserPlayGame, UserPlayGameRequest> {
  path = '/users-play-games'
  constructor(param?: ApiParam) {
    super(param)
  }

    async findAll(filter?: ApiFilter | undefined, options?: AxiosRequestConfig | undefined): Promise<CrudResponse<(UserPlayGame | Game)[]>> {
        return (await this.client.get<CrudResponse<(UserPlayGame | Game)[]>>(this.path, { ...options, params: filter })).data
    }
}
