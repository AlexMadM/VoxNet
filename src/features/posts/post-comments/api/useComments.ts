import { useQuery } from '@tanstack/react-query'
import { postsApi } from '@/entities/posts/api'
import { GetCommentsParams } from '@/entities/posts/api/types'

/**
 * React Query хук для получения комментариев поста
 * Используется в Client Components
 */
export const useComments = (params: GetCommentsParams) => {
  const { postId, pageSize = 6 } = params

  return useQuery({
    queryKey: ['comments', postId, pageSize],
    queryFn: () => postsApi.getComments({ postId, pageSize }),
    enabled: !!postId && postId > 0,
    staleTime: 2 * 60 * 1000, // 2 минуты - комментарии могут обновляться чаще
    gcTime: 5 * 60 * 1000, // 5 минут в кэше
    retry: 1, // Одна попытка повтора при ошибке
    retryDelay: 1000 // Задержка 1 секунда перед повтором
  })
}
