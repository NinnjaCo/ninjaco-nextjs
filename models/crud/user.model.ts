export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
}

export interface UserRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  dateOfBirth: string
}
