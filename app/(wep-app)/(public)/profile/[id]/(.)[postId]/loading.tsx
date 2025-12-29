import { PostModalSkeleton } from '@/shared/ui'

/**
 * Loading UI для intercepting route поста
 * 
 * Автоматически показывается Next.js во время навигации:
 * - При клике на пост с /profile/114 на /profile/114/776
 * - Во время SSR загрузки данных на сервере для модального окна
 * 
 * Этот loading.tsx используется для intercepting route (.)[postId]
 * который показывает пост в модальном окне
 */
export default function PostModalLoading() {
  return <PostModalSkeleton />
}
