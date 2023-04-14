export interface Game {
  _id: string
  title: string
  numOfBlocks?: number
  sizeOfGrid: number
  playerLocation: Array<number>
  goalLocation: Array<number>
  wallsLocations?: Array<Array<number>>
}

export interface GameRequest {
  title: string
  numOfBlocks?: number
  sizeOfGrid: number
  playerLocation: Array<number>
  goalLocation: Array<number>
  wallsLocations?: Array<Array<number>>
}
