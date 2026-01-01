'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui'
import { AlertAction, AlertCancel, AlertDescription, AlertDialog } from '@/shared/ui/alert-dilog'
import { useDeletePost } from '@/features/posts/delete-post/api'

type PostModalDeleteDialogProps = {
  postId: number
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Диалог подтверждения удаления поста
 */
export const PostModalDeleteDialog = ({ postId, isOpen, onOpenChange }: PostModalDeleteDialogProps) => {
  const router = useRouter()
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost()

  const handleDelete = () => {
    deletePost(postId, {
      onSuccess: () => {
        onOpenChange(false)
        router.back()
      }
    })
  }

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
          <Button variant="primary" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </Button>
        </AlertAction>
      </div>
    </AlertDialog>
  )
}

