import { QueryClient, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/app/providers/query-provider/get-query-client'
import { postsApi } from '@/entities/posts/api'

/**
 * Предзагрузка поста на сервере
 *
 * Использует ensureQueryData вместо prefetchQuery для оптимизации:
 * - Если данные уже есть в кеше QueryClient и свежие (staleTime) - не делает запрос
 * - Если данных нет или они устарели - делает запрос
 *
 * Важно для динамических данных:
 * - На сервере QueryClient создается заново для каждого запроса
 * - ensureQueryData защищает от дублирования запросов в рамках одного рендера
 * - staleTime: 2 минуты означает, что данные считаются свежими в течение этого времени
 *
 * @param queryClient - QueryClient для prefetch
 * @param postId - ID поста
 */
export async function prefetchPost(queryClient: QueryClient, postId: number) {
  await queryClient.ensureQueryData({
    queryKey: ['post', postId],
    queryFn: () => postsApi.getPost(postId),
    staleTime: 2 * 60 * 1000 // 2 минуты
  })
}

export async function prefetchComments(queryClient: QueryClient, postId: number, pageSize: number = 6) {
  // queryKey должен совпадать с useComments: ['comments', postId, pageSize]
  await queryClient.ensureQueryData({
    queryKey: ['comments', postId, pageSize],
    queryFn: () => postsApi.getComments({ postId, pageSize }),
    staleTime: 2 * 60 * 1000 // 2 минуты
  })
}

/**
 * Предзагрузка поста и комментариев в одном QueryClient
 * @param postId - ID поста
 * @param pageSize - Размер страницы для комментариев (по умолчанию 6)
 * @returns dehydratedState для передачи в HydrationBoundary
 */
export async function prefetchPostWithComments(postId: number, pageSize: number = 6) {
  const queryClient = getQueryClient()

  try {
    // Предзагружаем пост и комментарии в одном QueryClient
    await Promise.all([prefetchPost(queryClient, postId), prefetchComments(queryClient, postId, pageSize)])
  } catch (error) {
    // Если предзагрузка не удалась - не критично, клиент повторит запрос
    console.error('Prefetch post or comments error:', error)
  }

  return dehydrate(queryClient)
}
