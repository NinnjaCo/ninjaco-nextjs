import { GameProgress } from "./game-Progress.model"
import { Game } from "./game.model"
import { User } from "./user.model"

export interface UserPlayGame {
    game: Game
    user: User
    gameProgress: GameProgress
    completed: boolean
    startedAt: string
}
  
export interface UserPlayGameRequest {
    userId: string
    gameId: string
    progress: string
    completed: boolean
}
  