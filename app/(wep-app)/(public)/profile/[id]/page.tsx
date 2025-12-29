import { ProfilePageClient } from '@/features/user-profile/ui/ProfilePageClient'
import { HydrationBoundary } from '@tanstack/react-query'
import { Metadata } from 'next'
import { prefetchProfileWithPosts } from '@/features/user-profile/api/prefetch-profile'

export const metadata: Metadata = {
  title: 'Профиль',
  description: 'Страница пользователя'
}

type Props = {
  params: Promise<{ id?: string }>
}

/**
 * Серверный компонент страницы профиля.
 * Получает userId из параметров URL и передает в клиентский компонент.
 */
const ProfilePage = async ({ params }: Props) => {
  const { id } = await params
  const userId = Number(id)

  if (!id || Number.isNaN(userId) || userId <= 0) {
    return <div>Профиль не найден</div>
  }

  const dehydratedState = await prefetchProfileWithPosts(userId)

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProfilePageClient userId={userId} />
    </HydrationBoundary>
  )
}

export default ProfilePage
