import { Role } from './role.model'

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  role: Role
}

export interface UserRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  dateOfBirth: string
}
