'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '../api/user'
import { UserPublicProfile } from '@/entities/user'

/**
 * Хук для получения данных профиля пользователя по userId.
 * Используется на странице профиля для отображения статистики и информации.
 *
 * @param userId - ID пользователя для загрузки профиля (может быть null/undefined)
 * @returns Результат запроса с данными профиля, состоянием загрузки и ошибками
 */
export const useUserProfile = (userId: number | null | undefined) => {
  return useQuery<UserPublicProfile, Error>({
    queryKey: ['user-profile', userId],
    queryFn: () => {
      // Дополнительная проверка для TypeScript (enabled уже проверяет, но это для безопасности)
      const result = userApi.getPublicUserProfile(userId!)
      return result
    },
    enabled: !!userId && Number.isFinite(userId) && userId > 0,
    staleTime: 2 * 60_000, // 2 минуты - данные профиля не меняются часто
    gcTime: 5 * 60_000, // 5 минут в кэше
    retry: 1
  })
}
