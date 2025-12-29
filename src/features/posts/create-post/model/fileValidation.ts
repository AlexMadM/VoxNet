export const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
export const MAX_FILE_COUNT = 10
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png'] as const

export type FileValidationError = {
  message: string
  fileName?: string
}

export type FileValidationResult = {
  valid: boolean
  errors: FileValidationError[]
}

/**
 * Валидирует один файл
 */
export const validateFile = (file: File): FileValidationResult => {
  const errors: FileValidationError[] = []

  if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
    errors.push({
      message: 'Only JPEG and PNG formats are supported.',
      fileName: file.name
    })
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push({
      message: `"${file.name}" exceeds the 20MB limit.`,
      fileName: file.name
    })
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Валидирует массив файлов
 */
export const validateFiles = (files: File[]): FileValidationResult => {
  const errors: FileValidationError[] = []

  if (files.length > MAX_FILE_COUNT) {
    errors.push({
      message: `Maximum ${MAX_FILE_COUNT} files allowed.`
    })
  }

  files.slice(0, MAX_FILE_COUNT).forEach((file) => {
    const result = validateFile(file)
    if (!result.valid) {
      errors.push(...result.errors)
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Форматирует размер файла в читаемый вид
 */
export const formatFileSize = (bytes: number): string => {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Возвращает текст-подсказку для загрузки файлов
 */
export const getFileUploadHelperText = (): string => {
  return `JPEG/PNG, up to ${MAX_FILE_COUNT} files, max 20MB each`
}
