'use client'

import s from './skeleton.module.css'

type PostSkeletonProps = {
  count?: number
}

/**
 * Скелетон для загрузки постов в профиле
 * Соответствует размеру и стилю реальных постов
 */
export const PostSkeleton = ({ count = 1 }: PostSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={s.postSkeleton}>
          <div className={s.skeletonContent} />
        </div>
      ))}
    </>
  )
}
