export interface Game {
  _id: string
  title: string
  numOfBlocks: number
  sizeOfGrid?: number
  playerLocation: Array<number>
  goalLocation: Array<number>
  wallsLocations: Array<Array<number>>
}

export interface GameRequest {
  title: string
  numOfBlocks: number
  sizeOfGrid?: number
  playerLocation: Array<number> | undefined
  goalLocation: Array<number> | undefined
  wallsLocations: Array<Array<number>> | undefined
}
