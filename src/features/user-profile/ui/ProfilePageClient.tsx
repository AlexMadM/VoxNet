'use client'

import { UserProfile } from './UserProfile'
import { useProfileData } from '../api/useProfileData'


type ProfilePageClientProps = {
  userId: number
}

/**
 * Container компонент для страницы профиля.
 * Отвечает за получение данных через useProfileData и передачу их в презентационный компонент UserProfile.
 * Контролирует показ скелетона пока данные не загружены.
 */
export const ProfilePageClient = ({ userId }: ProfilePageClientProps) => {
  const profileData = useProfileData({ userId })


  return <UserProfile {...profileData} />
}
