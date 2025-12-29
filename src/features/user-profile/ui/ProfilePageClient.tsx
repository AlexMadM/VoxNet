'use client'

import { UserProfile } from './UserProfile'

type ProfilePageClientProps = {
  userId: number
}

/**
 * Клиентский компонент страницы профиля.
 *
 * Упрощен: убрано дублирование useProfileData.
 * UserProfile сам обрабатывает загрузку и показывает скелетон через useProfileData.
 * React Query автоматически кэширует запросы, поэтому дублирование не нужно.
 */
export const ProfilePageClient = ({ userId }: ProfilePageClientProps) => {
  return <UserProfile userId={userId} />
}
