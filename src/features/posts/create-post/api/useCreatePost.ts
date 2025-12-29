import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi } from '@/entities/posts/api/posts'
import { AxiosError } from 'axios'
import { CreatePostPayload, CreatePostResponse } from '@/entities/posts/api/types'

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation<CreatePostResponse, AxiosError, CreatePostPayload>({
    mutationFn: (payload) => postsApi.createPost(payload),
    onSuccess: async (data) => {
      const ownerId = data.ownerId

      // Инвалидируем все запросы постов владельца (все варианты с разными pageSize)
      // Используем префиксный поиск: ['user-posts', ownerId] инвалидирует
      // все запросы ['user-posts', ownerId, pageSize] независимо от pageSize
      if (ownerId) {
        await queryClient.invalidateQueries({
          queryKey: ['user-posts', ownerId],
          refetchType: 'active' // Принудительно обновляем активные запросы
        })
      }

      // Инвалидируем общий список постов
      await queryClient.invalidateQueries({
        queryKey: ['posts'],
        refetchType: 'active'
      })
    }
  })
}
