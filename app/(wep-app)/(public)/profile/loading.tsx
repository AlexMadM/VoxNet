import { ProfileSkeleton } from '@/shared/ui'

/**
 * Loading UI для страницы поста
 * 
 * Автоматически показывается Next.js во время выполнения await prefetchPostWithComments()
 * в page.tsx. Это происходит при:
 * - SSR (Server-Side Rendering) - пока выполняется prefetch на сервере
 * - Навигации между страницами - пока загружается следующая страница
 * 
 * Скелетон отображается до загрузки JavaScript и данных поста
 */
export default function PostLoading() {
  return (
    <div >
      <ProfileSkeleton />
    </div>
  )
}

