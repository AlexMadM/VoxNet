import { Avatar } from '@/shared/ui'
import type { Post } from '@/entities/posts/api/types'
import s from '../PostModal.module.css'

type PostModalFooterProps = {
  post: Post
}

/**
 * Футер модального окна поста с лайками и датой создания
 */
export const PostModalFooter = ({ post }: PostModalFooterProps) => {
  return (
    <footer className={s.sidebarFooter}>
      {/* Аватары пользователей, которые лайкнули */}
      {post.avatarWhoLikes.length > 0 && (
        <div className={s.likesAvatars}>
          {post.avatarWhoLikes.slice(0, 4).map((avatar, index) => (
            <div key={index} className={s.likeAvatarWrapper}>
              <Avatar src={avatar} alt={`User ${index + 1}`} size="very_small" />
            </div>
          ))}
        </div>
      )}

      <p className={s.likesCount}>{post.likesCount.toLocaleString('ru-RU')} Likes</p>

      <p className={s.timestamp}>
        {new Date(post.createdAt).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </p>
    </footer>
  )
}

