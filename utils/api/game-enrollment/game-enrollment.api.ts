import { ApiFilter } from '../shared'
import { ApiParam } from '../client'
import { AxiosRequestConfig } from 'axios'
import { Game } from '@/models/crud/game.model'
import { UserPlayGame, UserPlayGameRequest } from '@/models/crud/game-enrollment.model'
import CrudApi, { CrudResponse } from '../crud/crud.api'

export class GameEnrollmentAPI extends CrudApi<UserPlayGame, UserPlayGameRequest> {
  path = '/users-play-games'
  constructor(param?: ApiParam) {
    super(param)
  }

  async findAll(
    filter?: ApiFilter | undefined,
    options?: AxiosRequestConfig | undefined
  ): Promise<CrudResponse<(UserPlayGame | Game)[]>> {
    return (
      await this.client.get<CrudResponse<(UserPlayGame | Game)[]>>(this.path, {
        ...options,
        params: filter,
      })
    ).data
  }
}
