import { dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/app/providers/query-provider/get-query-client'
import { ResponsesPosts } from '@/entities/posts/api/types'

type TotalCountUsersResponse = {
  totalCount: number
}

/**
 * Предзагружает данные главной страницы через прямой fetch
 * и заполняет кеш React Query для каждого поста.
 *
 * Преимущества этого подхода:
 * - Оставляем существующую логику fetch (SSG/ISR оптимизация)
 * - Интегрируем данные в React Query кеш
 * - Данные доступны для usePost хука в других компонентах
 * - Поддерживаем единый кеш приложения
 *
 * @param apiUrl - URL API (по умолчанию берется из env или используется дефолтный)
 * @returns Объект с dehydratedState для HydrationBoundary и данными
 */
export async function prefetchHomePageData(apiUrl?: string) {
  const queryClient = getQueryClient()
  const defaultApiUrl = apiUrl || process.env.NEXT_PUBLIC_API_URL || 'https://inctagram.work/api/v1'

  try {
    // Используем прямой fetch (как было)
    const [postsResponse, usersResponse] = await Promise.all([
      fetch(`${defaultApiUrl}/posts/all`).catch(() => null),
      fetch(`${defaultApiUrl}/public-user`).catch(() => null)
    ])

    const postsData: ResponsesPosts = postsResponse?.ok
      ? await postsResponse.json().catch(() => ({ totalCount: 0, pageSize: 0, items: [], totalUsers: 0 }))
      : { totalCount: 0, pageSize: 0, items: [], totalUsers: 0 }

    // Заполняем кеш React Query для каждого поста
    // Используем тот же queryKey, что и в usePost: ['post', postId]
    postsData.items.forEach((post) => {
      queryClient.setQueryData(['post', post.id], post)
    })

    // Дегидратируем состояние для HydrationBoundary
    const dehydratedState = dehydrate(queryClient)

    // Получаем totalCount пользователей
    const totalCountUsers =
      (usersResponse?.ok
        ? ((await usersResponse.json().catch(() => null)) as TotalCountUsersResponse | null)?.totalCount
        : null) ?? 0

    return {
      dehydratedState,
      postsData,
      totalCountUsers
    }
  } catch (error) {
    // При ошибке возвращаем пустые данные, но все равно дегидратируем состояние
    console.error('Prefetch home page error:', error)
    const dehydratedState = dehydrate(queryClient)
    return {
      dehydratedState,
      postsData: { totalCount: 0, pageSize: 0, items: [], totalUsers: 0 },
      totalCountUsers: 0
    }
  }
}
