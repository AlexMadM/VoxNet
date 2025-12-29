'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '../api/user'
import { UserProfileResponse } from '../api/user-types'

/**
 * Хук для получения данных профиля пользователя по userName.
 * Используется на странице профиля для отображения статистики и информации.
 *
 * @param userName - Имя пользователя для загрузки профиля (может быть null/undefined)
 * @returns Результат запроса с данными профиля, состоянием загрузки и ошибками
 */
export const useUserProfile = (userName: string | null | undefined) => {
  return useQuery<UserProfileResponse, Error>({
    queryKey: ['user-profile', userName],
    queryFn: () => {
      // Дополнительная проверка для TypeScript (enabled уже проверяет, но это для безопасности)
      const result = userApi.userProfile(userName!)
      return result
    },
    enabled: !!userName && userName.trim().length > 0,
    staleTime: 2 * 60_000, // 2 минуты - данные профиля не меняются часто
    gcTime: 5 * 60_000, // 5 минут в кэше
    retry: 1
  })
}
