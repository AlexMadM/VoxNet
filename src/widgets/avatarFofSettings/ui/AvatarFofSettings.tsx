'use client'

import * as React from 'react'
import { useState } from 'react'
import { Avatar, Button } from '@/shared/ui'
import { CloseOutline } from '@/shared/ui/icons/CloseOutline'
import s from './AvatarFofSettings.module.css'
import { ModalDeleteAvatar } from '@/features/addAndDeleteAvatarPhoto/ui/ModalDeleteAvatar'

type Props = {
  src: string | undefined
}
export const AvatarFofSettings = ({ src }: Props) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Используем key на основе src для принудительного перерендера при изменении
  // Это помогает обойти кэш Next.js Image
  const avatarKey = src || 'fallback'

  const hasPhoto = src && src.trim().length > 0

  return (
    <>
      <div className={s.avatar}>
        <Avatar key={avatarKey} alt="Avatar Fof" size="large" src={src} />
        {hasPhoto && (
          <Button className={s.button} variant="textButton" onClick={() => setIsDeleteModalOpen(true)}>
            <div className={s.ring}>
              <CloseOutline />
            </div>
          </Button>
        )}
      </div>

      <ModalDeleteAvatar open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} />
    </>
  )
}
