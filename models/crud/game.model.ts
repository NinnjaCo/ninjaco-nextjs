export interface Game {
  _id: string
  title: string
  image: string
  playerDirection: string
  numOfBlocks?: number
  sizeOfGrid: number
  playerLocation: number[]
  goalLocation: number[]
  wallsLocations: number[][]
  createdAt: string
  updatedAt: string
}

export interface GameRequest {
  title: string
  image: string
  playerDirection: string
  numOfBlocks?: number
  sizeOfGrid: number
  playerLocation: number[]
  goalLocation: number[]
  wallsLocations: number[][]
}
