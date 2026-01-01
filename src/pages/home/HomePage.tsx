import { HydrationBoundary } from '@tanstack/react-query'
import { HomePageClient } from './HomePageClient'
import { prefetchHomePageData } from './prefetch-home-page'

// SSG: Страница будет статически сгенерирована на этапе сборки
// ISR: Страница будет перегенерирована каждые 60 секунд при запросах
export const revalidate = 60

/**
 * Server Component для главной страницы.
 * Использует прямой fetch для получения данных (сохраняем SSG/ISR оптимизацию)
 * и заполняет кеш React Query через prefetchHomePageData.
 */
export const HomePage = async () => {
  // Предзагружаем данные через fetch и заполняем кеш React Query
  const { dehydratedState, postsData, totalCountUsers } = await prefetchHomePageData()

  return (
    <HydrationBoundary state={dehydratedState}>
      <HomePageClient posts={postsData.items} totalCountUsers={totalCountUsers} />
    </HydrationBoundary>
  )
}
