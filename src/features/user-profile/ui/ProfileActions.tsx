'use client'

import { Button } from '@/shared/ui'
import { useAuth } from '@/shared/lib'
import { ROUTES } from '@/shared/lib/routes'
import Link from 'next/link'
import s from './userProfile.module.css'

export type profileOwner = 'myProfile' | 'friendProfile' | 'guestProfile'

type Props = {
  profileOwner: profileOwner
}

/**
 * Контейнер кнопок действий профиля.
 * Здесь же лежат обработчики переходов/подписок.
 */
export const ProfileActions = ({ profileOwner }: Props) => {
  const { user } = useAuth()
  const userId = user?.userId

  return (
    <div className={s.buttonWrapper}>
      {profileOwner === 'myProfile' ? (
        <Button asChild variant="secondary">
          <Link href={ROUTES.APP.SETTINGS.PART()}>Profile settings</Link>
        </Button>
      ) : profileOwner === 'friendProfile' ? (
        <>
          <Button variant="outlined">Unfollow</Button>
          <Button variant="secondary">Send message</Button>
        </>
      ) : (
        userId && (
          <>
            <Button variant="primary">Follow</Button>
            <Button variant="secondary">Send message</Button>
          </>
        )
      )}
    </div>
  )
}
