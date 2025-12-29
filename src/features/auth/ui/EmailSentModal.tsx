'use client'

import { useState } from 'react'
import { BaseModal, Button, Typography } from '@/shared/ui'
import s from './EmailSentModal.module.css'

type Props = {
  email: string
  onClose?: () => void
}

export const EmailSentModal = ({ email, onClose }: Props) => {
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    onClose?.()
  }

  return (
    <BaseModal open={open} onOpenChange={handleClose} title="Email sent">
      <Typography variant="regular_16" className={s.textModal}>
        We have sent a link to confirm your email to <b>{email}</b>
      </Typography>
      <Button className={s.buttonModal} onClick={handleClose}>
        Ok
      </Button>
    </BaseModal>
  )
}
