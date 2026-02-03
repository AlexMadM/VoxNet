'use client'

import { useAuth } from '@/shared/lib'
import { useUserProfile } from '@/entities/user'
// import { usePublicUserProfile } from '@/entities/user/model/useUserProfile'
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

  const isMyProfile = user?.userId === userId

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

  // Определяем userName для загрузки профиля
  const userName = (isMyProfile ? user?.userName : postsData?.pages[0]?.items[0]?.userName) ?? null

  // Загружаем данные профиля
  const { data: profileData, isLoading: isProfileLoading } = useUserProfile(userName)

  // Загружаем публичный профиль по userId (закомментировано)
  // const { data: publicProfileData, isLoading: isPublicProfileLoading } = usePublicUserProfile(userId)

  // Вычисляем производные значения
  const profileOwner: profileOwner = isMyProfile ? 'myProfile' : 'guestProfile'
  const displayName = profileData?.userName || userName || user?.userName || 'User'
  const avatarUrl = profileData?.avatars?.[0]?.url
  const bio = profileData?.aboutMe

  // Определяем состояние загрузки
  const isLoading =
    isAuthLoading ||
    (isMyProfile
      ? isProfileLoading && !profileData
      : (isPostsLoading && !postsData) || (isProfileLoading && !profileData && !!userName))

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
