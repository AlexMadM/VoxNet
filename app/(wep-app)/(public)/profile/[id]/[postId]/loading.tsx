import { PostModalSkeleton } from '@/shared/ui'

/**
 * Loading UI для страницы поста
 *
 * Автоматически показывается Next.js во время навигации:
 * - При переходе с /profile/114 на /profile/114/776
 * - Во время SSR загрузки данных на сервере
 *
 * Next.js автоматически использует этот компонент как Suspense fallback
 * во время загрузки страницы [postId]/page.tsx
 */
export default function PostLoading() {
  return <PostModalSkeleton />
}
