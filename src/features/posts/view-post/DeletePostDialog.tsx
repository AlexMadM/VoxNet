'use client'

import { Button } from '@/shared/ui'
import { AlertAction, AlertCancel, AlertDescription, AlertDialog } from '@/shared/ui/alert-dilog'

type DeletePostDialogProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isDeleting: boolean
}

export const DeletePostDialog = ({ isOpen, onOpenChange, onConfirm, isDeleting }: DeletePostDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange} title="Удалить пост">
      <AlertDescription asChild>
        <p style={{ textAlign: 'left' }}>Вы уверены, что хотите удалить этот пост? Это действие нельзя отменить.</p>
      </AlertDescription>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
        <AlertCancel asChild>
          <Button variant="outlined" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
        </AlertCancel>
        <AlertAction asChild>
          <Button variant="primary" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </Button>
        </AlertAction>
      </div>
    </AlertDialog>
  )
}
