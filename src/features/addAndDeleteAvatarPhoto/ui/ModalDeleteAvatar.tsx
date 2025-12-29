'use client'

import * as React from 'react'
import { Dialog, DialogContent } from '@/shared/ui/modal'
import { Button, Typography } from '@/shared/ui'
import { useDeleteAvatar } from '../api/useDeleteAvatar'
import s from './ModalDeleteAvatar.module.css'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: () => void
}

export const ModalDeleteAvatar = ({ open, onOpenChange, onDelete }: Props) => {
  const { mutateAsync: deleteAvatar, isPending } = useDeleteAvatar()

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleDelete = async () => {
    try {
      await deleteAvatar()
      if (onDelete) {
        onDelete()
      }
      handleClose()
    } catch (e) {
      // TODO: здесь можно показать тост/уведомление об ошибке
      console.error('Failed to delete avatar', e)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent title="Delete Photo" className={s.modalContent}>
        <div className={s.container}>
          <Typography className={s.message} variant={'regular_16'}>
            Do you really want to delete your profile photo?
          </Typography>

          <div className={s.buttons}>
            <Button className={s.button} variant="outlined" onClick={handleDelete} disabled={isPending}>
              Yes
            </Button>
            <Button className={s.button} variant="primary" onClick={handleClose} disabled={isPending}>
              No
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
