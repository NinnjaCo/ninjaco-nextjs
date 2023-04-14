import { ApiParam } from '../client'
import { Game, GameRequest } from '@/models/crud/game.model'
import CrudApi from '../crud/crud.api'

export class GameApi extends CrudApi<Game, GameRequest> {
  path = '/games'
  constructor(param?: ApiParam) {
    super(param)
  }
}
