import { PostImageSlider } from '@/shared/lib/post-image-slider'
import type { Post } from '@/entities/posts/api/types'
import s from '../PostModal.module.css'

type PostModalImageSectionProps = {
  post: Post
}

/**
 * Секция с изображениями поста в модальном окне
 */
export const PostModalImageSection = ({ post }: PostModalImageSectionProps) => {
  return (
    <div className={s.imageSection}>
      <PostImageSlider
        images={post.images}
        postId={post.id}
        ownerId={post.ownerId}
        description={post.description}
        disableLink={true}
        className={s.modalSlider}
        size="large"
      />
    </div>
  )
}

