import { ApiParam, CoreApi } from '@/utils/api/client'
import { ApiResponse } from '../shared/auth-response'
import { useEffect, useRef } from 'react'

interface EmailResponse {
  success: boolean
}

export class EmailApi extends CoreApi {
  path = '/send-email'
  constructor(param?: ApiParam) {
    super(param)
  }
  async sendDeleteUserEmail(email: string, message: string): Promise<ApiResponse<EmailResponse>> {
    console.log('in AuthApi.sendEmail the message is:', message)
    const res = await this.client.post<ApiResponse<EmailResponse>>(`${this.path}/delete-user`, {
      email,
      message,
    })
    return res.data
  }
  async sendResetPasswordEmail(email: string): Promise<ApiResponse<EmailResponse>> {
    const res = await this.client.post<ApiResponse<EmailResponse>>(`${this.path}/reset-password`, {
      email,
    })
    return res.data
  }
  async sendNotifyUserEmail(email: string, message: string): Promise<ApiResponse<EmailResponse>> {
    const res = await this.client.post<ApiResponse<EmailResponse>>(`${this.path}/notify-user`, {
      email,
      message,
    })
    return res.data
  }
}

export function useEmailApi(param?: ApiParam): EmailApi {
  const ref = useRef<EmailApi>(new EmailApi(param))
  useEffect(() => {
    ref.current = new EmailApi(param)
  }, [param])
  return ref.current
}
