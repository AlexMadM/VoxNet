export const MAX_PROFILE_PHOTO_SIZE = 10 * 1024 * 1024 // 10MB
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png'] as const

export type FileValidationErrorType = 'format' | 'size'

export type FileValidationError = {
  message: string
  type: FileValidationErrorType
  fileName?: string
}

export type FileValidationResult = {
  valid: boolean
  errors: FileValidationError[]
}

export const validateProfilePhoto = (file: File): FileValidationResult => {
  const errors: FileValidationError[] = []

  if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
    errors.push({
      message: 'Error! The format of the uploaded photo must be PNG and JPEG',
      type: 'format',
      fileName: file.name
    })
  }

  if (file.size > MAX_PROFILE_PHOTO_SIZE) {
    errors.push({
      message: 'Error! Photo size must be less than 10 MB!',
      type: 'size',
      fileName: file.name
    })
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
