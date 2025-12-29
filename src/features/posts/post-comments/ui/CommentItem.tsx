'use client'

import { Avatar } from '@/shared/ui'
import { getTimeDifference } from '@/shared/lib/getTimeDifference'
import { Comment } from '@/entities/posts/api/types'
import { Heart } from '@/shared/ui/icons/Heart'
import s from './CommentItem.module.css'

type CommentItemProps = {
  comment: Comment
  user?: number
  showLike?: boolean
}

/**
 * Компонент для отображения одного комментария
 * Показывает аватар, имя пользователя, текст комментария и время создания
 */
export const CommentItem = ({ comment, showLike }: CommentItemProps) => {
  const userAvatar = comment.from.avatars?.[0]?.url || ''
  const userName = comment.from.username

  return (
    <article className={s.comment}>
      <Avatar src={userAvatar} alt={userName} size="small" />
      <div className={s.commentContent}>
        <div className={s.commentTop}>
          <div className={s.commentHeader}>
            <span className={s.userName}>{userName}</span>
            <span className={s.commentText}>{comment.content}</span>
          </div>
          {showLike && (
            <button type="button" className={s.likeButton} aria-label="Like comment">
              <Heart />
            </button>
          )}
        </div>
        <time className={s.timestamp} dateTime={comment.createdAt}>
          {getTimeDifference(comment.createdAt, 'ru')}
        </time>
      </div>
    </article>
  )
}
