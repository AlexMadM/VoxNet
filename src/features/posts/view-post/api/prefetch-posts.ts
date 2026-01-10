import { QueryClient, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/app/providers/query-provider/get-query-client'
import { postsApi } from '@/entities/posts/api'

/**
 * Предзагрузка поста на сервере
 *
 * Использует prefetchQuery (БЕЗ await) для оптимизации:
 * - Быстрее отдает HTML пользователю
 * - Запросы остаются в pending состоянии
 * - На клиенте показывается скелетон, пока данные загружаются
 * - Pending queries включаются в дегидратацию (настроено в get-query-client)
 *
 * @param queryClient - QueryClient для prefetch
 * @param postId - ID поста
 */
export function prefetchPost(queryClient: QueryClient, postId: number) {
  // void явно указывает, что мы намеренно игнорируем Promise
  void queryClient.prefetchQuery({
    queryKey: ['post', postId],
    queryFn: () => postsApi.getPost(postId),
    staleTime: 2 * 60 * 1000 // 2 минуты
  })
}

/**
 * Предзагрузка комментариев к посту
 * queryKey должен совпадать с useComments: ['comments', postId, pageSize]
 *
 * @param queryClient - QueryClient для prefetch
 * @param postId - ID поста
 * @param pageSize - Размер страницы (по умолчанию 6)
 */
export function prefetchComments(queryClient: QueryClient, postId: number, pageSize: number = 6) {
  // void явно указывает, что мы намеренно игнорируем Promise
  void queryClient.prefetchQuery({
    queryKey: ['comments', postId, pageSize],
    queryFn: () => postsApi.getComments({ postId, pageSize }),
    staleTime: 2 * 60 * 1000 // 2 минуты
  })
}

/**
 * Предзагрузка поста и комментариев в одном QueryClient
 * НЕ ждем завершения запросов (без await) - это позволяет:
 * 1. Быстрее отдать HTML пользователю
 * 2. Запросы остаются в pending состоянии
 * 3. На клиенте показывается скелетон, пока данные загружаются
 * 4. Pending queries включаются в дегидратацию (настроено в get-query-client)
 *
 * @param postId - ID поста
 * @param pageSize - Размер страницы для комментариев (по умолчанию 6)
 * @returns dehydratedState для передачи в HydrationBoundary (включая pending queries)
 */
export async function prefetchPostWithComments(postId: number, pageSize: number = 6) {
  const queryClient = getQueryClient()

  try {
    // Предзагружаем пост и комментарии (БЕЗ await - запросы будут в pending)
    // Это позволяет быстрее отдать HTML и показать скелетон на клиенте
    prefetchPost(queryClient, postId)
    prefetchComments(queryClient, postId, pageSize)
  } catch (error) {
    // Логируем ошибку, но не прерываем рендеринг
    // Next.js обработает ошибку через свой механизм
    console.error('Prefetch post or comments error:', error)
  }

  // Дегидратируем состояние, включая pending queries (настроено в get-query-client)
  // Pending queries будут отправлены на клиент, и там покажется скелетон
  return dehydrate(queryClient)
}
