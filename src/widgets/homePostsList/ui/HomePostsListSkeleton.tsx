'use client'

import s from './homePostsList.module.css'
import skeletonStyles from './homePostsListSkeleton.module.css'

type HomePostsListSkeletonProps = {
  count?: number
}

/**
 * Скелетон для загрузки постов на главной странице
 * Соответствует структуре HomePostsList
 */
export const HomePostsListSkeleton = ({ count = 4 }: HomePostsListSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className={s.postItem}>
          {/* Скелетон изображения */}
          <div className={skeletonStyles.imageSkeleton} />

          {/* Скелетон информации о пользователе */}
          <div className={s.userInfo}>
            <div className={skeletonStyles.avatarSkeleton} />
            <div className={skeletonStyles.userNameSkeleton} />
          </div>

          {/* Скелетон времени */}
          <div className={skeletonStyles.timeSkeleton} />

          {/* Скелетон описания */}
          <div className={skeletonStyles.descriptionSkeleton}>
            <div className={skeletonStyles.descriptionLine} />
            <div className={skeletonStyles.descriptionLine} />
          </div>
        </li>
      ))}
    </>
  )
}

