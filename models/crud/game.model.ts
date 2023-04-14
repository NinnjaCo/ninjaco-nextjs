export interface Game {
  _id: string
  title: string
  image: string
  numOfBlocks?: number
  sizeOfGrid: number
  playerLocation: number[]
  goalLocation: number[]
  wallsLocations: number[][]
}

export interface GameRequest {
  title: string
  image: string
  numOfBlocks?: number
  sizeOfGrid: number
  playerLocation: number[]
  goalLocation: number[]
  wallsLocations: number[][]
}
