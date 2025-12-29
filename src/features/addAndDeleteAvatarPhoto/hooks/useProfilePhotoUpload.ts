import { useCallback, useId, useRef } from 'react'
import { validateProfilePhoto, FileValidationError } from '../model/profilePhotoValidation'

type UseProfilePhotoUploadParams = {
  onFileSelect: (file: File, previewUrl: string) => void
  onValidationError: (errors: FileValidationError[]) => void
}

export const useProfilePhotoUpload = ({ onFileSelect, onValidationError }: UseProfilePhotoUploadParams) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const inputId = useId()

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const validation = validateProfilePhoto(file)
      if (!validation.valid) {
        e.target.value = ''
        onValidationError(validation.errors)
        return
      }

      const previewUrl = URL.createObjectURL(file)
      onFileSelect(file, previewUrl)
      e.target.value = ''
    },
    [onFileSelect, onValidationError]
  )

  const handleSelectFile = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return {
    inputRef,
    inputId,
    handleFileChange,
    handleSelectFile
  }
}
