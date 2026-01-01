import { Avatar, Typography } from '@/shared/ui'
import DropMenu from '@/shared/ui/dropdown/DropMenu'
import type { Post } from '@/entities/posts/api/types'
import s from '../PostModal.module.css'

type PostModalHeaderProps = {
  post: Post
  currentUserId: number | null
  onEdit: () => void
  onDelete: () => void
}

/**
 * Заголовок модального окна поста с аватаром пользователя и меню действий
 */
export const PostModalHeader = ({ post, currentUserId, onEdit, onDelete }: PostModalHeaderProps) => {
  const isOwner = currentUserId !== null && post.ownerId === currentUserId

  return (
    <div className={s.description}>
      <div className={s.avatar}>
        <Avatar src={post.avatarOwner} alt={post.userName} size="small" />
        <Typography variant="h3" className={s.descriptionUser}>
          {post.userName}
        </Typography>
      </div>
      {isOwner && (
        <div>
          <DropMenu onEdit={onEdit} onDelete={onDelete} ownerId={post.ownerId} currentUserId={currentUserId} />
        </div>
      )}
    </div>
  )
}

