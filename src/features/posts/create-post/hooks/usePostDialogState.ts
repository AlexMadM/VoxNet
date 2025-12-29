import { useEffect, useRef, useState } from 'react'
import type { ImageItem, Step } from '../model/types'

export const usePostDialogState = (open: boolean) => {
  const [step, setStep] = useState<Step>('select')
  const [images, setImages] = useState<ImageItem[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imagesRef = useRef<ImageItem[]>([])
  console.log(open)
  // Синхронизируем ref с state
  useEffect(() => {
    imagesRef.current = images //4
  }, [images])

  useEffect(() => {
    if (!open) {
      // Используем ref для получения актуальных images без добавления в зависимости

      const currentImages = imagesRef.current //1

      currentImages.forEach((img) => {
        URL.revokeObjectURL(img.originalUrl)
        if (img.croppedUrl) URL.revokeObjectURL(img.croppedUrl)
      })

      setImages([])
      setStep('select')
      setCurrentImageIndex(0)
    }
  }, [open])

  return {
    step,
    setStep,
    images,
    setImages,
    currentImageIndex,
    setCurrentImageIndex
  }
}
