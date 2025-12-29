'use client'

import { Button, Typography } from '@/shared/ui'
import { AlertAction, AlertCancel, AlertDescription, AlertDialog } from '@/shared/ui/alert-dilog'

import s from './CloseConfirmDialog.module.css'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDiscard: () => void
  onSaveDraft: () => void
}

export const CloseConfirmDialog = ({ open, onOpenChange, onDiscard, onSaveDraft }: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} title="Close">
      <div className={s.container}>
        <AlertDescription asChild className={s.description}>
          <div>
            <Typography variant={'regular_16'}>Do you really want to close the creation of a publication?</Typography>
            <Typography variant={'regular_16'} className={s.subtext}>
              If you close everything will be deleted
            </Typography>
          </div>
        </AlertDescription>
        <div className={s.actions}>
          <AlertCancel asChild>
            <Button variant={'outlined'} onClick={onDiscard} className={s.btnDiscard}>
              Discard
            </Button>
          </AlertCancel>
          <AlertAction asChild>
            <Button onClick={onSaveDraft}>Save draft</Button>
          </AlertAction>
        </div>
      </div>
    </AlertDialog>
  )
}
