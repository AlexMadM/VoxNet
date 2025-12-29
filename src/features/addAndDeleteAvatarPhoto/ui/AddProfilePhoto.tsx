'use client'

import * as React from 'react'
import { useState } from 'react'
import { Dialog, DialogContent } from '@/shared/ui/modal'
import { Button } from '@/shared/ui'
import { useProfilePhotoUpload } from '../hooks/useProfilePhotoUpload'
import { useAddAvatar } from '../api/useAddAvatar'
import { SelectPhotoStep } from './SelectPhotoStep'
import { FileValidationError } from '../model/profilePhotoValidation'
import s from './AddProfilePhoto.module.css'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (file: File) => Promise<void>
}

type Step = 'select' | 'preview'

export const AddProfilePhoto = ({ open, onOpenChange, onSave }: Props) => {
  const [step, setStep] = useState<Step>('select')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<FileValidationError[]>([])
  const { mutateAsync: addAvatar, isPending } = useAddAvatar()

  const handleClose = () => {
    onOpenChange(false)
    // Сброс состояния при закрытии
    setTimeout(() => {
      setStep('select')
      setSelectedFile(null)
      setValidationErrors([])
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
    }, 300)
  }

  const fileUpload = useProfilePhotoUpload({
    onFileSelect: (file, url) => {
      setSelectedFile(file)
      setPreviewUrl(url)
      setValidationErrors([])
      setStep('preview')
    },
    onValidationError: (errors) => {
      setValidationErrors(errors)
    }
  })

  const handleSave = async (file: File) => {
    try {
      // Загружаем аватар на сервер
      await addAvatar({ file })

      // Дополнительный внешний колбэк, если он передан
      if (onSave) {
        await onSave(file)
      }

      handleClose()
    } catch (e) {
      // TODO: здесь можно показать тост/уведомление об ошибке
      console.error('Failed to upload avatar', e)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent title="Add a Profile Photo" className={s.modalContent}>
          <input
            ref={fileUpload.inputRef}
            id={fileUpload.inputId}
            type="file"
            accept="image/jpeg,image/png"
            className={s.hiddenInput}
            onChange={fileUpload.handleFileChange}
          />

          {step === 'select' && (
            <SelectPhotoStep onSelectFile={fileUpload.handleSelectFile} validationErrors={validationErrors} />
          )}

          {step === 'preview' && selectedFile && previewUrl && (
            <div className={s.container}>
              <div className={s.preview}>
                <img src={previewUrl} alt="Profile preview" className={s.image} />
              </div>

              <Button
                className={s.button}
                variant="primary"
                onClick={() => handleSave(selectedFile)}
                disabled={isPending}
              >
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
