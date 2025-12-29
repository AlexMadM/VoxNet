import { useCallback } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { ImageItem, Step } from '../model/types'

type UseImageHandlersParams = {
  images: ImageItem[]
  currentImageIndex: number
  setImages: Dispatch<SetStateAction<ImageItem[]>>
  setCurrentImageIndex: Dispatch<SetStateAction<number>>
  setStep: Dispatch<SetStateAction<Step>>
}

export const useImageHandlers = ({
  images,
  currentImageIndex,
  setImages,
  setCurrentImageIndex,
  setStep
}: UseImageHandlersParams) => {
  const handleCropNext = useCallback(
    (blob: Blob) => {
      const croppedUrl = URL.createObjectURL(blob)
      setImages((prev) => {
        const updated = prev.map((img, idx) =>
          idx === currentImageIndex ? { ...img, croppedBlob: blob, croppedUrl } : img
        )

        const nextUncroppedIndex = updated.findIndex((img, idx) => idx > currentImageIndex && !img.croppedBlob)
        if (nextUncroppedIndex !== -1) {
          setCurrentImageIndex(nextUncroppedIndex)
        } else {
          setStep('publication')
        }

        return updated
      })
    },
    [currentImageIndex, setImages, setCurrentImageIndex, setStep]
  )

  const handleDeleteImage = useCallback(
    (deleteIndex: number) => {
      const img = images[deleteIndex]
      if (!img) return

      URL.revokeObjectURL(img.originalUrl)
      if (img.croppedUrl) URL.revokeObjectURL(img.croppedUrl)

      const newImages = images.filter((_, idx) => idx !== deleteIndex)
      setImages(newImages)

      if (newImages.length === 0) {
        setStep('select')
        setCurrentImageIndex(0)
      } else {
        if (deleteIndex <= currentImageIndex) {
          const newIndex = Math.max(0, currentImageIndex - 1)
          setCurrentImageIndex(newIndex)
        }
      }
    },
    [images, currentImageIndex, setImages, setCurrentImageIndex, setStep]
  )

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((i) => Math.max(0, i - 1))
  }, [setCurrentImageIndex])

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((i) => Math.min(images.length - 1, i + 1))
  }, [images.length, setCurrentImageIndex])

  return {
    handleCropNext,
    handleDeleteImage,
    handlePrevImage,
    handleNextImage
  }
}
