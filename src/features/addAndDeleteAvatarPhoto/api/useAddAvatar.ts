import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { postsApi } from '@/entities/posts/api/posts'
import type { AddAvatarPayload, AddAvatarResponse } from '@/entities/posts/api/types'
import { useAuth } from '@/shared/lib'
import type { UserProfileResponse } from '@/entities/user/api/user-types'

/**
 * Хук для загрузки аватара пользователя.
 *
 * Оборачивает вызов postsApi.addPhotoAvatar в useMutation из react-query.
 * После успешной загрузки инвалидирует кэш профиля пользователя для обновления UI.
 * Возвращает стандартный объект мутации:
 * - mutate / mutateAsync — запуск запроса
 * - isPending / isSuccess / isError / error — состояние запроса
 */
export const useAddAvatar = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation<AddAvatarResponse, AxiosError, AddAvatarPayload>({
    // mutationFn — функция, которая реально делает запрос на сервер
    mutationFn: (payload) => postsApi.addPhotoAvatar(payload),
    onSuccess: async (data) => {
      // Инвалидируем кэш профиля пользователя для обновления UI
      if (user?.userName) {
        // Сначала обновляем данные в кэше напрямую для мгновенного обновления UI
        const currentData = queryClient.getQueryData<UserProfileResponse>(['personal-data'])
        if (currentData) {
          queryClient.setQueryData<UserProfileResponse>(['personal-data'], {
            ...currentData,
            avatars: data.avatars
          })
        }

        // Затем инвалидируем и обновляем все запросы для синхронизации с сервером
        await queryClient.invalidateQueries({
          queryKey: ['user-profile', user.userName],
          refetchType: 'all' // Обновляем все запросы, включая неактивные
        })
      }
    }
  })
}
