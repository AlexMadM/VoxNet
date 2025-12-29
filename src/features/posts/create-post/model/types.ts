export type Step = 'select' | 'crop' | 'publication'

export type ImageItem = {
  id: string
  originalFile: File
  originalUrl: string
  croppedBlob: Blob | null
  croppedUrl: string | null
}
