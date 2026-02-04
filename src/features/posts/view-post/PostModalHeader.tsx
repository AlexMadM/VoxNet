'use client'

import { Avatar, Typography } from '@/shared/ui'
import DropMenu from '@/shared/ui/dropdown/DropMenu'
import s from './PostModal.module.css'

type PostModalHeaderProps = {
  userName: string
  avatarOwner: string | null
  ownerId: number
  currentUserId: number | null
  onEdit: () => void
  onDelete: () => void
}

export const PostModalHeader = ({
  userName,
  avatarOwner,
  ownerId,
  currentUserId,
  onEdit,
  onDelete
}: PostModalHeaderProps) => {
  return (
    <div className={s.description}>
      <div className={s.avatar}>
        <Avatar src={avatarOwner ?? undefined} alt={userName} size="small" />
        <Typography variant="h3" className={s.descriptionUser}>
          {userName}
        </Typography>
      </div>
      {currentUserId && (
        <div>
          <DropMenu onEdit={onEdit} onDelete={onDelete} ownerId={ownerId} currentUserId={currentUserId} />
        </div>
      )}
    </div>
  )
}
