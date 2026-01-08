import { dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/app/providers/query-provider/get-query-client'
import { postsApi } from '@/entities/posts/api'

/**
 * Константа для времени, в течение которого данные считаются свежими
 * Совпадает с STALE_TIME из get-query-client.ts
 */
const STALE_TIME = 2 * 60 * 1000 // 2 минуты

/**
 * Предзагрузка поста и комментариев в одном QueryClient
 *
 * Использует prefetchQuery (БЕЗ await) для оптимизации:
 * - Быстрее отдает HTML пользователю (низкий TTFB)
 * - Запросы остаются в pending состоянии
 * - На клиенте показывается скелетон, пока данные загружаются
 * - Pending queries включаются в дегидратацию (настроено в get-query-client)
 *

 */
export function prefetchPostWithComments(postId: number, pageSize: number = 6) {
  const queryClient = getQueryClient()

  // Предзагружаем пост и комментарии параллельно (БЕЗ await - запросы будут в pending)
  // void явно указывает, что мы намеренно игнорируем Promise для оптимизации TTFB
  void queryClient.prefetchQuery({
    queryKey: ['post', postId],
    queryFn: () => postsApi.getPost(postId),
    staleTime: STALE_TIME
  })

  void queryClient.prefetchQuery({
    queryKey: ['comments', postId, pageSize],
    queryFn: () => postsApi.getComments({ postId, pageSize }),
    staleTime: STALE_TIME
  })

  // Дегидратируем состояние, включая pending queries (настроено в get-query-client)
  // Pending queries будут отправлены на клиент, и там покажется скелетон
  return dehydrate(queryClient)
}
