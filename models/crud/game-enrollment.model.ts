import { Game } from './game.model'
import { GameProgress } from './game-Progress.model'
import { User } from './user.model'

export interface UserPlayGame {
  _id: string
  game: Game
  user: User
  gameProgress: GameProgress
  completed: boolean
  startedAt: string
  createdAt: string
  updatedAt: string
}

export interface UserPlayGameRequest {
  userId: string
  gameId: string
  progress?: string
  completed?: boolean
}
