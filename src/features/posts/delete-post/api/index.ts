import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { postsApi } from '@/entities/posts/api/posts'
import type { Post } from '@/entities/posts/api/types'
import { useAuth } from '@/shared/lib'

export const useDeletePost = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation<void, AxiosError, number>({
    mutationFn: (id: number) => postsApi.deletePost(id),
    onSuccess: async (_, postId) => {
      // Получаем пост из кэша, чтобы узнать ownerId владельца поста
      const post = queryClient.getQueryData<Post>(['post', postId])
      const ownerId = post?.ownerId || user?.userId

      // refetchType: 'all' обновляет все запросы, включая неактивные (важно для страницы профиля)
      if (ownerId) {
        await queryClient.invalidateQueries({
          queryKey: ['user-posts', ownerId],
          refetchType: 'all' // Обновляем все запросы, включая неактивные страницы профиля
        })

        // Инвалидируем профиль пользователя для обновления счетчика публикаций
        // Получаем userName из удаленного поста для инвалидации профиля
        if (post?.userName) {
          await queryClient.invalidateQueries({
            queryKey: ['user-profile', post.userName],
            refetchType: 'all'
          })
        }
      }
    }
  })
}
