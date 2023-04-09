export interface Role {
  _id: string
  role: string
}

export enum RoleEnum {
  ADMIN = 'admin',
  CREATOR = 'creator',
  USER = 'user',
}
