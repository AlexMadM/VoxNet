import { dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/app/providers/query-provider/get-query-client'
import { postsApi } from '@/entities/posts/api'
import { userApi } from '@/entities/user/api/user'
import type { ResponsesPosts } from '@/entities/posts/api/types'

/**
 * Префетчит данные профиля и посты пользователя на сервере
 * НЕ ждем завершения запросов (без await) - это позволяет:
 * 1. Быстрее отдать HTML пользователю
 * 2. Запросы остаются в pending состоянии
 * 3. На клиенте показывается скелетон, пока данные загружаются
 *
 * @param userId - ID пользователя
 * @param pageSize - Размер страницы для постов (по умолчанию 8)
 * @returns Dehydrated state для HydrationBoundary (включая pending queries)
 */
export function prefetchProfileWithPosts(userId: number, pageSize = 8) {
  const queryClient = getQueryClient()

  try {
    // Префетчим профиль пользователя (БЕЗ await - запрос будет в pending)
    // Это позволяет быстрее отдать HTML и показать скелетон на клиенте
    // void явно указывает, что мы намеренно игнорируем Promise
    void queryClient.prefetchQuery({
      queryKey: ['user-profile', userId],
      queryFn: () => userApi.getPublicUserProfile(userId),
      staleTime: 2 * 60 * 1000 // 2 минуты - соответствует настройкам в useUserProfile
    })

    // Префетчим первую страницу постов пользователя (БЕЗ await)
    // prefetchInfiniteQuery автоматически обрабатывает initialPageParam
    // void явно указывает, что мы намеренно игнорируем Promise
    void queryClient.prefetchInfiniteQuery({
      queryKey: ['user-posts', userId, pageSize],
      queryFn: ({ pageParam }: { pageParam: number | null }) => {
        const cursor = pageParam === null ? undefined : pageParam
        return postsApi.getUserPosts(userId, pageSize, cursor)
      },
      initialPageParam: null as number | null,
      getNextPageParam: (lastPage: ResponsesPosts): number | null => {
        // Логика должна соответствовать useUserPosts
        if (!lastPage.items || lastPage.items.length === 0) {
          return null
        }
        if (lastPage.items.length < pageSize) {
          return null
        }
        const lastPost = lastPage.items[lastPage.items.length - 1]
        return lastPost?.id ?? null
      },
      staleTime: 2 * 60 * 1000 // 2 минуты
    })
  } catch (error) {
    // Логируем ошибку, но не прерываем рендеринг
    // Next.js обработает ошибку через свой механизм
    console.error('Prefetch profile error:', error)
  }

  // Дегидратируем состояние, включая pending queries (настроено в get-query-client)
  // Pending queries будут отправлены на клиент, и там покажется скелетон
  return dehydrate(queryClient)
}
