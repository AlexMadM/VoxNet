'use client'

import { useMemo } from 'react'
import { useAuth } from '@/shared/lib'
import { useUserProfile } from '@/entities/user'
import { useUserPosts } from '@/entities/posts/model'
import type { profileOwner } from '../ui/ProfileActions'

type UseProfileDataParams = {
  userId: number
  pageSize?: number
}

type UseProfileDataReturn = {
  // Данные
  profileData: ReturnType<typeof useUserProfile>['data']
  postsData: ReturnType<typeof useUserPosts>['data']

  // Состояния загрузки
  isPostsLoading: boolean
  isFetchingNextPage: boolean

  // Ошибки
  isPostsError: boolean
  postsError: Error | null

  // Действия
  refetchPosts: (() => void) | undefined
  fetchNextPage: (() => void) | undefined
  hasNextPage: boolean

  // Вычисленные значения (готовые к использованию в UI)
  profileOwner: profileOwner
  displayName: string
  avatarUrl: string | undefined
  bio: string | undefined

  // Общее состояние
  isLoading: boolean
}

/**
 * Хук для получения и обработки всех данных профиля пользователя.
 * Объединяет логику загрузки постов, профиля и вычисления производных значений.
 *
 * @param userId - ID пользователя, чей профиль нужно загрузить
 * @param pageSize - Размер страницы для постов (по умолчанию 8)
 * @returns Объект с данными профиля, состояниями загрузки и вычисленными значениями
 */
export const useProfileData = ({ userId, pageSize = 8 }: UseProfileDataParams): UseProfileDataReturn => {
  const { user, isLoading: isAuthLoading } = useAuth()

  const isMyProfile = useMemo(() => user?.userId === userId, [user?.userId, userId])

  // Загружаем посты пользователя
  const {
    data: postsData,
    isLoading: isPostsLoading,
    isFetchingNextPage: isFetchingNextPage,
    isError: isPostsError,
    error: postsError,
    refetch: refetchPosts,
    fetchNextPage,
    hasNextPage
  } = useUserPosts({ userId, pageSize })

  // Получаем userName: если свой профиль - используем user.userName,
  // иначе берем из первого поста (может быть undefined пока посты не загрузились)
  const userNameFromPosts = useMemo(() => postsData?.pages[0]?.items[0]?.userName, [postsData?.pages])

  const userName = useMemo(
    () => (isMyProfile ? user?.userName : userNameFromPosts) ?? null,
    [isMyProfile, user?.userName, userNameFromPosts]
  )

  // Загружаем данные профиля
  const { data: profileData, isLoading: isProfileLoading } = useUserProfile(userName)

  // Вычисляем производные значения
  const profileOwner: profileOwner = useMemo(() => (isMyProfile ? 'myProfile' : 'guestProfile'), [isMyProfile])

  const displayName = useMemo(
    () => profileData?.userName || userNameFromPosts || user?.userName || 'User',
    [profileData?.userName, userNameFromPosts, user?.userName]
  )

  const avatarUrl = useMemo(() => profileData?.avatars?.[0]?.url, [profileData?.avatars])

  const bio = useMemo(() => profileData?.aboutMe, [profileData?.aboutMe])

  // Упрощенная логика определения состояния загрузки
  const isLoading = useMemo(() => {
    // Загружается авторизация
    if (isAuthLoading) return true

    // Для своего профиля: загружается профиль и еще нет данных
    if (isMyProfile) {
      return isProfileLoading && !profileData
    }

    // Для чужого профиля:
    // - Загружаются посты и еще нет данных (чтобы получить userName)
    // - ИЛИ загружается профиль и еще нет данных профиля (если userName уже получен)
    if (isPostsLoading && !postsData) return true
    if (isProfileLoading && !profileData && userName) return true

    return false
  }, [isAuthLoading, isMyProfile, isProfileLoading, profileData, isPostsLoading, postsData, userName])

  return {
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
    bio,
    isLoading
  }
}
