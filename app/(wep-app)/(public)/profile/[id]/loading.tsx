import { ProfileSkeleton } from '@/shared/ui'

/**
 * Loading UI для страницы профиля
 *
 * Автоматически показывается Next.js во время навигации:
 * - При переходе на /profile/[id] (страница профиля)
 * - Во время навигации между страницами
 *
 * Этот loading.tsx используется только для страницы профиля.
 * Для страницы поста используется [postId]/loading.tsx с PostModalSkeleton
 */
export default function ProfileLoading() {
  return <ProfileSkeleton />
}
