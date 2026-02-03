'use client'

import s from './skeleton.module.css'
import { PostSkeleton } from './PostSkeleton'

/**
 * Скелетон для загрузки профиля пользователя
 * Соответствует структуре UserProfile компонента
 */
export const ProfileSkeleton = () => {
  return (
    <section className={s.profileSkeleton}>
      <div className={s.headerSkeleton}>
        {/* Аватар */}
        <div className={s.avatarSkeleton} />

        <div className={s.summarySkeleton}>
          {/* Имя и кнопки */}
          <div className={s.titleRowSkeleton}>
            <div className={s.userNameSkeleton} />
            <div className={s.actionsSkeleton} />
          </div>

          {/* Статистика */}
          <div className={s.statsSkeleton}>
            <div className={s.statCardSkeleton}>
              <div className={s.statValueSkeleton} />
              <div className={s.statLabelSkeleton} />
            </div>
            <div className={s.statCardSkeleton}>
              <div className={s.statValueSkeleton} />
              <div className={s.statLabelSkeleton} />
            </div>
            <div className={s.statCardSkeleton}>
              <div className={s.statValueSkeleton} />
              <div className={s.statLabelSkeleton} />
            </div>
          </div>

          {/* Био */}
          <div className={s.bioSkeleton}>
            <div className={s.bioLineSkeleton} />
            <div className={s.bioLineSkeleton} style={{ width: '60%' }} />
          </div>
        </div>
      </div>

      {/* Секция постов */}
      <div className={s.postsSectionSkeleton}>
        <div className={s.gridSkeleton}>
          <PostSkeleton count={8} />
        </div>
      </div>
    </section>
  )
}
