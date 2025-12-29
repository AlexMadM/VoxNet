import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { postsApi } from '@/entities/posts/api/posts'
import { useAuth } from '@/shared/lib'
import type { UserProfileResponse } from '@/entities/user/api/user-types'

/**
 * Хук для удаления аватара пользователя.
 *
 * Оборачивает вызов postsApi.deletePhotoAvatar в useMutation из react-query.
 * После успешного удаления инвалидирует кэш профиля пользователя для обновления UI.
 * Возвращает стандартный объект мутации:
 * - mutate / mutateAsync — запуск запроса
 * - isPending / isSuccess / isError / error — состояние запроса
 */
export const useDeleteAvatar = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation<void, AxiosError, void>({
    // mutationFn — функция, которая реально делает запрос на сервер
    mutationFn: () => postsApi.deletePhotoAvatar(),
    onSuccess: async () => {
      // Инвалидируем кэш профиля пользователя для обновления UI
      if (user?.userName) {
        // Сначала обновляем данные в кэше напрямую для мгновенного обновления UI
        const currentData = queryClient.getQueryData<UserProfileResponse>(['personal-data'])
        if (currentData) {
          queryClient.setQueryData<UserProfileResponse>(['personal-data'], {
            ...currentData,
            avatars: []
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
