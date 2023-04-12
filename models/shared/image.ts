interface ImageFormat {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path?: string
  size: number
  width: number
  height: number
}

interface Formats {
  large: ImageFormat
  small: ImageFormat
  medium: ImageFormat
  thumbnail: ImageFormat
}

export interface Image {
  id: number
  name: string
  alternativeText: string
  caption: string
  width: number
  height: number
  formats?: Formats
  hash: string
  ext: string
  mime: string
  size: number
  url: string
}
