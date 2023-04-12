import { ApiParam, CoreApi } from '@/utils/api/client'
import { ApiResponse } from '../shared/auth-response'
import { useEffect, useRef } from 'react'

interface ImageResponse {
  image_url: string
  message: string
}

export class ImageApi extends CoreApi {
  path = '/file-upload/single'
  constructor(param?: ApiParam) {
    super(param)
  }

  async uploadImage({ image }: { image: File }): Promise<ApiResponse<ImageResponse>> {
    const formData = new FormData()
    formData.append('image', image)
    const res = await this.client.post<ApiResponse<ImageResponse>>(`${this.path}`, formData)
    return res.data
  }
}

export function useEmailApi(param?: ApiParam): ImageApi {
  const ref = useRef<ImageApi>(new ImageApi(param))
  useEffect(() => {
    ref.current = new ImageApi(param)
  }, [param])
  return ref.current
}
