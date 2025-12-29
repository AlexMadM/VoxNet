'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Dialog, DialogContent, DialogClose } from '@/shared/ui/modal'

import { Avatar, Close, Typography, Button, PostModalSkeleton } from '@/shared/ui'

import { PostImageSlider } from '@/shared/lib/post-image-slider'

import s from './PostModal.module.css'
import { useAuth } from '@/shared/lib'
import { CommentsList } from '@/features/posts/post-comments'
import { usePost } from '@/entities/posts/model'
import DropMenu from '../../../shared/ui/dropdown/DropMenu'
import { AlertAction, AlertCancel, AlertDescription, AlertDialog } from '@/shared/ui/alert-dilog'
import { useDeletePost } from '@/features/posts/delete-post/api'
import { EditPostForm } from '@/features/posts/edit-post/ui/EditPostForm'

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
 */
export const PostModal = ({ postId }: PostModalProps) => {
  const router = useRouter()
  const { user } = useAuth()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost()

  // Запрос поста всегда активен - React Query сам управляет состоянием
  const { data: post, isLoading, error } = usePost(postId)

  // Закрытие модального окна с возвратом на предыдущую страницу
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        router.back()
      }
    },
    [router]
  )

  // Показываем скелетон только если данные загружаются и их еще нет
  // При SSR данные уже в кэше, поэтому isLoading будет false
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

  if (error) {
    return (
      <Dialog open={true} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton={false} className={s.modalContent}>
          <DialogClose className={s.closeButton} aria-label="Закрыть">
            <Close />
          </DialogClose>
          <div className={s.error}>
            <p>Ошибка загрузки поста</p>
            <button type="button" onClick={() => router.back()} className={s.errorButton}>
              Вернуться назад
            </button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!post) {
    return null
  }

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className={s.modalContent}>
        {/* Кнопка закрытия справа вверху */}
        <DialogClose className={s.closeButton} aria-label="Закрыть">
          <Close />
        </DialogClose>
        <div className={s.postContainer}>
          {/* Левая часть - карусель изображений */}
          <div className={s.imageSection}>
            <PostImageSlider
              images={post.images}
              postId={post.id}
              ownerId={post.ownerId}
              description={post.description}
              disableLink={true}
              className={s.modalSlider}
              size="large"
            />
          </div>

          {/* Правая часть - комментарии и информация */}
          <div className={s.sidebar}>
            <div className={s.description}>
              <div className={s.avatar}>
                <Avatar src={post.avatarOwner} alt={post.userName} size="small" />
                <Typography variant="h3" className={s.descriptionUser}>
                  {post.userName}
                </Typography>
              </div>
              {user?.userId && (
                <div>
                  <DropMenu
                    onEdit={() => setIsEditOpen(true)}
                    onDelete={() => setIsDeleteOpen(true)}
                    ownerId={post.ownerId}
                    currentUserId={user?.userId ?? null}
                  />
                </div>
              )}
            </div>

            {/* Комментарии */}
            <section className={s.comments} aria-label="Комментарии">
              <CommentsList postId={post.id} user={user?.userId} />
            </section>

            {/* Футер с лайками и датой */}
            <footer className={s.sidebarFooter}>
              {/* Аватары пользователей, которые лайкнули */}
              {post.avatarWhoLikes.length > 0 && (
                <div className={s.likesAvatars}>
                  {post.avatarWhoLikes.slice(0, 4).map((avatar, index) => (
                    <div key={index} className={s.likeAvatarWrapper}>
                      <Avatar src={avatar} alt={`User ${index + 1}`} size="very_small" />
                    </div>
                  ))}
                </div>
              )}

              <p className={s.likesCount}>{post.likesCount.toLocaleString('ru-RU')} Likes </p>

              <p className={s.timestamp}>
                {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>

              {/* Поле для добавления комментария */}
            </footer>
          </div>
        </div>
      </DialogContent>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} title="Удалить пост">
        <AlertDescription asChild>
          <p style={{ textAlign: 'left' }}>Вы уверены, что хотите удалить этот пост? Это действие нельзя отменить.</p>
        </AlertDescription>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
          <AlertCancel asChild>
            <Button variant="outlined" onClick={() => setIsDeleteOpen(false)}>
              Отмена
            </Button>
          </AlertCancel>
          <AlertAction asChild>
            <Button
              variant="primary"
              onClick={() => {
                deletePost(postId, {
                  onSuccess: () => {
                    setIsDeleteOpen(false)
                    router.back()
                  }
                })
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Удаление...' : 'Удалить'}
            </Button>
          </AlertAction>
        </div>
      </AlertDialog>
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
