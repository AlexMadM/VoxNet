import { HydrationBoundary } from '@tanstack/react-query'
import { HomePageClient } from './HomePageClient'
import { prefetchHomePageData } from './prefetch-home-page'


export const revalidate = 60


export const HomePage = async () => {
  // Предзагружаем данные через fetch и заполняем кеш React Query
  const { dehydratedState, postsData, totalCountUsers } = await prefetchHomePageData()

  return (
    <HydrationBoundary state={dehydratedState}>
      <HomePageClient posts={postsData.items} totalCountUsers={totalCountUsers} />
    </HydrationBoundary>
  )
}
