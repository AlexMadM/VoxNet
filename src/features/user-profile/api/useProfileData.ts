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

export type UseProfileDataReturn = {
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
  isLoading?: boolean
  isProfileLoading?: boolean
}

export const useProfileData = ({ userId, pageSize = 8 }: UseProfileDataParams): UseProfileDataReturn => {
  const { user } = useAuth()

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

  // Загружаем данные профиля по userId
  const { data: profileData, isLoading: isProfileLoading } = useUserProfile(userId)

  // Вычисляем производные значения
  const profileOwner: profileOwner = useMemo(() => (isMyProfile ? 'myProfile' : 'guestProfile'), [isMyProfile])

  const displayName = useMemo(
    () => profileData?.userName || user?.userName || 'User',
    [profileData?.userName, user?.userName]
  )

  const avatarUrl = useMemo(() => profileData?.avatars?.[0]?.url, [profileData?.avatars])

  const bio = useMemo(() => profileData?.aboutMe, [profileData?.aboutMe])

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
    isProfileLoading
  }
}
