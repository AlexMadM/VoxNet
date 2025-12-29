'use client'

import s from './CommentsSkeleton.module.css'

/**
 * Скелетон для списка комментариев
 * Имитирует структуру CommentsList для лучшего UX
 */
export const CommentsSkeleton = () => {
  return (
    <div className={s.commentsSkeleton}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className={s.commentSkeleton}>
          <div className={s.commentAvatarSkeleton} />
          <div className={s.commentContentSkeleton}>
            <div className={s.commentAuthorSkeleton} />
            <div className={s.commentTextSkeleton} />
            <div className={s.commentTextSkeleton} style={{ width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
