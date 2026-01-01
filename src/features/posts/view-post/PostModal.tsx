'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Dialog, DialogContent, DialogClose } from '@/shared/ui/modal'
import { Close } from '@/shared/ui'
import { useAuth } from '@/shared/lib'
import { CommentsList } from '@/features/posts/post-comments'
import { usePost } from '@/entities/posts/model'
import { EditPostForm } from '@/features/posts/edit-post/ui/EditPostForm'
import { PostModalHeader, PostModalImageSection, PostModalFooter, PostModalDeleteDialog } from './ui'
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
 * - Использует существующий PostImageSlider компонент
 * - Ошибки обрабатываются через Next.js error.tsx механизм
 */
export const PostModal = ({ postId }: PostModalProps) => {
  const router = useRouter()
  const { user } = useAuth()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Запрос поста всегда активен - React Query сам управляет состоянием
  // throwOnError: true пробрасывает ошибку в Next.js error boundary
  const { data: post } = usePost(postId, { throwOnError: true })

  // Закрытие модального окна с возвратом на предыдущую страницу
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        router.back()
      }
    },
    [router]
  )

  if (!post) {
    return null
  }

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className={s.modalContent}>
        <DialogClose className={s.closeButton} aria-label="Закрыть">
          <Close />
        </DialogClose>
        <div className={s.postContainer}>
          <PostModalImageSection post={post} />
          <div className={s.sidebar}>
            <PostModalHeader
              post={post}
              currentUserId={user?.userId ?? null}
              onEdit={() => setIsEditOpen(true)}
              onDelete={() => setIsDeleteOpen(true)}
            />
            <section className={s.comments} aria-label="Комментарии">
              <CommentsList postId={post.id} user={user?.userId} />
            </section>
            <PostModalFooter post={post} />
          </div>
        </div>
      </DialogContent>
      <PostModalDeleteDialog postId={postId} isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen} />
      <EditPostForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        postId={post.id}
        userName={post.userName}
        userAvatar={post.avatarOwner}
        postImage={post.images[0]?.url}
        initialDescription={post.description}
      />
    </Dialog>
  )
}
