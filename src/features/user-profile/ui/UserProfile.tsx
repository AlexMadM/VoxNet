'use client'

import { useMemo, useRef } from 'react'
import Link from 'next/link'
import s from './userProfile.module.css'

import { ProfileActions } from './ProfileActions'
import { PostImageSlider } from '@/shared/lib/post-image-slider'
import { Avatar, Typography, PostSkeleton } from '@/shared/ui'
import { useInfiniteScroll } from '@/shared/lib'
import type { UseProfileDataReturn } from '../api/useProfileData'

export const UserProfile = ({
  profileData,
  postsData,
  isPostsLoading,
  isFetchingNextPage,
  isPostsError,
  postsError,
  refetchPosts,
  fetchNextPage,
  hasNextPage,
  profileOwner,
  displayName,
  avatarUrl,
  bio
}: UseProfileDataReturn) => {
  const observerTarget = useRef<HTMLDivElement>(null)

  const allPosts = useMemo(() => postsData?.pages.flatMap((page) => page.items) ?? [], [postsData?.pages])

  const stats = useMemo(
    () => ({
      following: profileData?.userMetadata?.following ?? 0,
      followers: profileData?.userMetadata?.followers ?? 0,
      publications: profileData?.userMetadata?.publications ?? 0
    }),
    [profileData?.userMetadata]
  )

  const profileDescription = useMemo(
    () =>
      bio ??
      'Расскажите о себе в настройках профиля. Это поле можно обновить в разделе Profile settings — пользователи увидят его здесь.',
    [bio]
  )

  // Обработка бесконечной прокрутки через Intersection Observer
  useInfiniteScroll({
    targetRef: observerTarget,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage: fetchNextPage ?? (() => {}),
    threshold: 0.1,
    rootMargin: '10px'
  })


  

  return (
    <section className={s.page}>
      <div className={s.header}>
        <Avatar src={avatarUrl} alt={`${displayName} avatar`} size="large" />

        <div className={s.summary}>
          <div className={s.titleRow}>
            <span className={s.userName}>{displayName}</span>
            <div className={s.actions}>
              <ProfileActions profileOwner={profileOwner} />
            </div>
          </div>

          <div className={s.stats}>
            <div className={s.statCard}>
              <span className={s.statValue}>{stats.following}</span>
              <span className={s.statLabel}>Following</span>
            </div>
            <div className={s.statCard}>
              <span className={s.statValue}>{stats.followers}</span>
              <span className={s.statLabel}>Followers</span>
            </div>
            <div className={s.statCard}>
              <span className={s.statValue}>{stats.publications}</span>
              <span className={s.statLabel}>Publications</span>
            </div>
          </div>

          <Typography variant="regular_14" className={s.bio}>
            {profileDescription}{' '}
            <Link href="#" prefetch={false}>
              Подробнее
            </Link>
          </Typography>
        </div>
      </div>

      <div className={s.postsSection}>
        {isPostsError && (
          <div className={s.error}>
            Не удалось загрузить посты: {postsError?.message || 'попробуйте позже'}
            <br />
            <button type="button" onClick={() => refetchPosts?.()}>
              Повторить
            </button>
          </div>
        )}

        {isPostsLoading ? (
          <div className={s.loader}>{/* <Spinner /> */}</div>
        ) : allPosts.length > 0 ? (
          <>
            <div className={s.grid}>
              {allPosts.map((post) => (
                <div key={post.id} className={s.postCard}>
                  <div className={s.postContent}>
                    <PostImageSlider
                      images={post.images}
                      postId={post.id}
                      ownerId={post.ownerId}
                      description={post.description}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Элемент для отслеживания скролла и загрузки следующей страницы */}
            {hasNextPage && (
              <div ref={observerTarget} className={s.skeletonContainer} aria-label="Загрузка следующих постов">
                {isFetchingNextPage && (
                  <div className={s.grid}>
                    <PostSkeleton count={8} />
                  </div>
                )}
              </div>
            )}
            {/* Отступ внизу, когда все посты загружены */}
            {!hasNextPage && allPosts.length > 0 && <div className={s.bottomSpacer} />}
          </>
        ) : (
          <div className={s.emptyState}>У пользователя пока нет публикаций</div>
        )}
      </div>
    </section>
  )
}
