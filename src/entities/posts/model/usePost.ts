import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { postsApi } from '@/entities/posts/api'
import type { Post } from '@/entities/posts/api/types'

/**
 * React Query хук для получения поста
 * Используется в Client Components
 *
 * Оптимизирован для SSR:
 * - staleTime: 2 минуты - данные считаются свежими, предотвращает лишние запросы
 * - refetchOnMount/refetchOnWindowFocus: false (из глобальных настроек)
 * - При SSR данные уже в кэше, isLoading будет false сразу
 */
export const usePost = (postId: number, options?: Omit<UseQueryOptions<Post>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => postsApi.getPost(postId),
    staleTime: 2 * 60 * 1000, // 2 минуты - данные поста не меняются часто
    gcTime: 5 * 60 * 1000, // 5 минут в кэше
    // refetchOnMount и refetchOnWindowFocus наследуются из глобальных настроек
    // retry и retryDelay тоже наследуются, но можно переопределить через options
    ...options
  })
}
