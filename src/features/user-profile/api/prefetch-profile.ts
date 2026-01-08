import { dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/app/providers/query-provider/get-query-client'
import { postsApi } from '@/entities/posts/api'
import { userApi } from '@/entities/user/api/user'
import type { ResponsesPosts } from '@/entities/posts/api/types'

export async function prefetchProfileWithPosts(userId: number, pageSize = 8) {
  const queryClient = getQueryClient()

  // Запускаем запросы параллельно и ждем завершения всех (включая ошибки)
  // Promise.allSettled не прервется, даже если один запрос упадет с ошибкой
  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: ['user-profile', userId],
      queryFn: () => userApi.getPublicUserProfile(userId),
      staleTime: 2 * 60 * 1000 // 2 минуты - соответствует настройкам в useUserProfile
    }),
    queryClient.prefetchInfiniteQuery({
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
  ])

  // Дегидратируем состояние после завершения всех запросов
  // Включаются только успешные queries (через defaultShouldDehydrateQuery)
  // Данные уже загружены и будут в HTML
  return dehydrate(queryClient)
}
