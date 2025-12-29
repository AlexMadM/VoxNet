import { useCallback, useId, useRef } from 'react'
import { MAX_FILE_COUNT, validateFiles } from '../model/fileValidation'
import type { ImageItem, Step } from '../model/types'
import type { Dispatch, SetStateAction } from 'react'

type UseFileUploadParams = {
  images: ImageItem[]
  setImages: Dispatch<SetStateAction<ImageItem[]>>
  setCurrentImageIndex: Dispatch<SetStateAction<number>>
  setStep: Dispatch<SetStateAction<Step>>
  onFileSelect?: (file: File) => void
  onValidationError?: () => void
}

export const useFileUpload = ({
  setImages,
  setCurrentImageIndex,
  setStep,
  onFileSelect,
  onValidationError
}: UseFileUploadParams) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const inputId = useId()

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length === 0) return

      setImages((prevImages) => {
        const validation = validateFiles([...prevImages.map((img) => img.originalFile), ...files])
        if (!validation.valid) {
          console.error('File validation errors:', validation.errors)
          e.target.value = ''
          onValidationError?.()
          return prevImages
        }

        const remainingSlots = MAX_FILE_COUNT - prevImages.length
        const filesToAdd = files.slice(0, remainingSlots)

        if (filesToAdd.length === 0) {
          console.warn(`Maximum ${MAX_FILE_COUNT} files allowed`)
          e.target.value = ''
          return prevImages
        }

        const newImages: ImageItem[] = filesToAdd.map((file) => ({
          id: `${Date.now()}-${Math.random()}`,
          originalFile: file,
          originalUrl: URL.createObjectURL(file),
          croppedBlob: null,
          croppedUrl: null
        }))

        const updatedImages = [...prevImages, ...newImages]
        const firstNewIndex = prevImages.length

        setCurrentImageIndex(firstNewIndex)
        setStep((currentStep) => (currentStep === 'select' ? 'crop' : currentStep))

        if (onFileSelect && filesToAdd[0]) onFileSelect(filesToAdd[0])
        e.target.value = ''

        return updatedImages
      })
    },
    [setImages, setCurrentImageIndex, setStep, onFileSelect, onValidationError]
  )

  const handleAddPhotos = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return {
    inputRef,
    inputId,
    handleFileChange,
    handleAddPhotos
  }
}
