import { ApiParam, CoreApi } from '@/utils/api/client'
import { ApiResponse } from '../shared/auth-response'
import { User } from '@/models/crud'
import { useEffect, useRef } from 'react'

interface AuthResponse {
  access_token: string
  refresh_token: string
  user: User
}

export class AuthApi extends CoreApi {
  path = '/auth/local'
  path2 = '/auth'
  constructor(param?: ApiParam) {
    super(param)
  }
  async signIn(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const res = await this.client.post<ApiResponse<AuthResponse>>(`${this.path}/signin`, {
      email,
      password,
    })
    return res.data
  }

  async refresh(token: string): Promise<ApiResponse<AuthResponse>> {
    const res = await this.client.post<ApiResponse<AuthResponse>>(
      `${this.path2}/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return res.data
  }

  async signUp(data: {
    firstName: string
    lastName: string
    dateOfBirth: string
    email: string
    password: string
  }): Promise<ApiResponse<AuthResponse>> {
    const res = await this.client.post<ApiResponse<AuthResponse>>(`${this.path}/signUp`, data)
    return res.data
  }

  async resetpassword(data: {
    password: string
    passwordConfirmation: string
    code: string
    email: string
  }): Promise<ApiResponse<AuthResponse>> {
    const res = await this.client.post<ApiResponse<AuthResponse>>(
      `${this.path2}/reset-password`,
      data
    )
    return res.data
  }

  async forgotpassword(data: { email: string }): Promise<ApiResponse<AuthResponse>> {
    const res = await this.client.post<ApiResponse<AuthResponse>>(
      `${this.path2}/forgot-password`,
      data
    )
    return res.data
  }

  async confirmEmail(confirmation: string): Promise<ApiResponse<AuthResponse>> {
    const res = await this.client.get<ApiResponse<AuthResponse>>(
      `${this.path2}/email-confirmation?confirmation=${confirmation}`
    )
    return res.data
  }
}

export function useAuthApi(param?: ApiParam): AuthApi {
  const ref = useRef<AuthApi>(new AuthApi(param))
  useEffect(() => {
    ref.current = new AuthApi(param)
  }, [param])
  return ref.current
}
