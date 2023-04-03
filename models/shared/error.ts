export interface ModelError {
  code: number
  message: string
}

export interface ErrorMessage {
  id: string
  message: string
}

export interface AuthError {
  statusCode: number
  error: string
  message: {
    messages: ErrorMessage[]
  }[]
}
