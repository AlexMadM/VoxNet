'use client'

import { PostImageSlider } from '@/shared/lib/post-image-slider'
import { CommentsList } from '@/features/posts/post-comments'
import { PostModalHeader } from './PostModalHeader'
import { PostModalFooter } from './PostModalFooter'
import { Post } from '@/entities/posts/api/types'
import { Avatar } from '@/shared/ui'
import { formatDistanceToNowStrict } from 'date-fns'
import s from './PostModal.module.css'

type PostModalContentProps = {
  post: Post
  currentUserId: number | null
  onEdit: () => void
  onDelete: () => void
}

export const PostModalContent = ({ post, currentUserId, onEdit, onDelete }: PostModalContentProps) => {
  const formatRelativeTime = (isoString: string) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) return ''

    return formatDistanceToNowStrict(date, { addSuffix: true })
  }

  return (
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
        <PostModalHeader
          userName={post.userName}
          avatarOwner={post.avatarOwner}
          ownerId={post.ownerId}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        {/* Комментарии */}
        <section className={s.comments} aria-label="Комментарии">
          {post.description && (
            <article className={s.postDescription}>
              <Avatar src={post.avatarOwner ?? undefined} alt={post.userName} size="small" />
              <div className={s.postDescriptionContent}>
                <p className={s.postDescriptionText}>
                  <span className={s.descriptionUser}>{post.userName}</span> {post.description}
                </p>
                <time className={s.postDescriptionTime} dateTime={post.createdAt}>
                  {formatRelativeTime(post.createdAt)}
                </time>
              </div>
            </article>
          )}
          <CommentsList postId={post.id} user={currentUserId ?? undefined} />
        </section>

        <PostModalFooter avatarWhoLikes={post.avatarWhoLikes} likesCount={post.likesCount} createdAt={post.createdAt} />
      </div>
    </div>
  )
}
