export interface ModelError {
  code: number
  message: string
}

export interface ErrorMessage {
  [key: string]: string
}

export interface AuthError {
  error: {
    message: string
    name: string
    status: number
    response: {
      errors: ErrorMessage
      message: string
      status: number
    }
  }
  timestamp: number
}
