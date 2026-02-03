'use client'

import { Avatar } from '@/shared/ui'
import s from './PostModal.module.css'

type PostModalFooterProps = {
  avatarWhoLikes: string[]
  likesCount: number
  createdAt: string
}

export const PostModalFooter = ({ avatarWhoLikes, likesCount, createdAt }: PostModalFooterProps) => {
  return (
    <footer className={s.sidebarFooter}>
      {/* Аватары пользователей, которые лайкнули */}
      {avatarWhoLikes.length > 0 && (
        <div className={s.likesAvatars}>
          {avatarWhoLikes.slice(0, 4).map((avatar, index) => (
            <div key={index} className={s.likeAvatarWrapper}>
              <Avatar src={avatar} alt={`User ${index + 1}`} size="very_small" />
            </div>
          ))}
        </div>
      )}

      <p className={s.likesCount}>{likesCount.toLocaleString('ru-RU')} Likes </p>

      <p className={s.timestamp}>
        {new Date(createdAt).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </p>
    </footer>
  )
}
