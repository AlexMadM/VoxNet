'use client'

import { Button, Typography } from '@/shared/ui'
import { SvgImage } from '@/shared/ui/icons/SvgImage'
import { FileValidationError } from '../model/profilePhotoValidation'
import s from './SelectPhotoStep.module.css'

type Props = {
  onSelectFile: () => void
  validationErrors?: FileValidationError[]
}

export const SelectPhotoStep = ({ onSelectFile, validationErrors = [] }: Props) => {
  const formatError = validationErrors.find((error) => error.type === 'format')
  const sizeError = validationErrors.find((error) => error.type === 'size')

  return (
    <div className={s.container}>
      {formatError && (
        <Typography className={s.errorFormat} variant={'regular_14'}>
          {formatError.message}
        </Typography>
      )}
      {sizeError && (
        <Typography className={s.errorFormat} variant={'regular_14'}>
          {sizeError.message}
        </Typography>
      )}
      <div className={s.placeholder}>
        <SvgImage width={48} height={48} />
      </div>
      <Button onClick={onSelectFile}>Select from Computer</Button>
    </div>
  )
}
