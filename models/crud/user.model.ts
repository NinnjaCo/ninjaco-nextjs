import { Role, RoleEnum } from './role.model'

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  role: Role
  isVerified: boolean
  points: number
  profilePicture: string
  createdAt: string
  updatedAt: string
}

export interface UserRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  dateOfBirth: string
  role?: RoleEnum
  isVerified?: boolean
}
