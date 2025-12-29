'use client'

import { BaseModal, Button, Typography } from '@/shared/ui'
import s from './PhotoValidationModal.module.css'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const PhotoValidationModal = ({ open, onOpenChange }: Props) => {
  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <BaseModal open={open} onOpenChange={handleClose} title="Photo requirements">
      <Typography variant="regular_16" className={s.textModal}>
        The photo must be less than 20 Mb and have JPEG or PNG format
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <Button className={s.buttonModal} onClick={handleClose}>
          Ok
        </Button>
      </div>
    </BaseModal>
  )
}
