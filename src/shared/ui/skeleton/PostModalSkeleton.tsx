'use client'

import s from './PostModalSkeleton.module.css'

/**
 * Скелетон для модального окна поста
 * Имитирует структуру PostModal: изображение слева + сайдбар справа
 */
export const PostModalSkeleton = () => {
  return (
    <div className={s.modalSkeleton}>
      {/* Левая часть - изображение */}
      <div className={s.imageSkeleton}>
        <div className={s.skeletonShimmer} />
      </div>

      {/* Правая часть - сайдбар */}
      <div className={s.sidebarSkeleton}>
        {/* Заголовок с аватаром и именем */}
        <div className={s.headerSkeleton}>
          <div className={s.avatarSkeleton} />
          <div className={s.userNameSkeleton} />
        </div>

        {/* Комментарии */}
        <div className={s.commentsSkeleton}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={s.commentSkeleton}>
              <div className={s.commentAvatarSkeleton} />
              <div className={s.commentContentSkeleton}>
                <div className={s.commentAuthorSkeleton} />
                <div className={s.commentTextSkeleton} />
              </div>
            </div>
          ))}
        </div>

        {/* Футер с лайками */}
        <div className={s.footerSkeleton}>
          <div className={s.likesAvatarsSkeleton}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={s.likeAvatarSkeleton} />
            ))}
          </div>
          <div className={s.likesCountSkeleton} />
          <div className={s.timestampSkeleton} />
        </div>
      </div>
    </div>
  )
}
