'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Dialog, DialogContent, DialogClose } from '@/shared/ui/modal'
import { Close, PostModalSkeleton } from '@/shared/ui'
import { useAuth } from '@/shared/lib'
import { usePost } from '@/entities/posts/model'
import { useDeletePost } from '@/features/posts/delete-post/api'
import { EditPostForm } from '@/features/posts/edit-post/ui/EditPostForm'
import { PostModalContent } from './PostModalContent'
import { DeletePostDialog } from './DeletePostDialog'
import s from './PostModal.module.css'

type PostModalProps = {
  postId: number
}

/**
 * Модальное окно поста с каруселью изображений и комментариями
 *
 * Особенности:
 * - Использует Intercepting Routes для перехвата навигации
 * - Поддерживает закрытие через ESC и клик по overlay
 * - Автоматически обновляет URL при открытии/закрытии
 * - Оптимизированная загрузка данных через React Query
 * - Разбит на подкомпоненты для лучшей поддерживаемости
 */
export const PostModal = ({ postId }: PostModalProps) => {
  const router = useRouter()
  const { user } = useAuth()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost()

  // Запрос поста всегда активен - React Query сам управляет состоянием
  const { data: post, isLoading } = usePost(postId)

  // Закрытие модального окна с возвратом на предыдущую страницу
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        router.back()
      }
    },
    [router]
  )

  // Обработчик удаления поста
  const handleDeleteConfirm = useCallback(() => {
    deletePost(postId, {
      onSuccess: () => {
        setIsDeleteOpen(false)
        router.back()
      }
    })
  }, [deletePost, postId, router])

  // Показываем скелетон только если данные загружаются и их еще нет
  const showSkeleton = isLoading && !post

  if (showSkeleton) {
    return (
      <Dialog open={true} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton={false} className={s.modalContent}>
          <DialogClose className={s.closeButton} aria-label="Закрыть">
            <Close />
          </DialogClose>
          <PostModalSkeleton />
        </DialogContent>
      </Dialog>
    )
  }

  if (!post) {
    return null
  }

  return (
    <>
      <Dialog open={true} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton={false} className={s.modalContent}>
          <DialogClose className={s.closeButton} aria-label="Закрыть">
            <Close />
          </DialogClose>
          <PostModalContent
            post={post}
            currentUserId={user?.userId ?? null}
            onEdit={() => setIsEditOpen(true)}
            onDelete={() => setIsDeleteOpen(true)}
          />
        </DialogContent>
      </Dialog>

      <DeletePostDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      <EditPostForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        postId={post.id}
        userName={post.userName}
        userAvatar={post.avatarOwner}
        postImage={post.images[0]?.url}
        initialDescription={post.description}
      />
    </>
  )
}
