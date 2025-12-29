'use client'
import s from './homePostsList.module.css'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { clsx } from 'clsx'
import { Button, Typography } from '@/shared/ui'
import { getTimeDifference } from '@/shared/lib/getTimeDifference'
import { Avatar } from '@/shared/ui/Avatar'
import { PostImageSlider } from '@/shared/lib/post-image-slider'
import { Post } from '@/entities/posts/api/types'

type Props = {
  post: Post
}

const SHORT_DESCRIPTION_LENGTH = 66

export const HomePostsList = ({ post }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const description = post?.description || ''
  const descriptionLength = description.trim().length

  const shouldShowButton = descriptionLength > SHORT_DESCRIPTION_LENGTH

  const getDisplayedText = () => {
    // Если текст короткий, показываем полностью
    if (!shouldShowButton) {
      return description
    }

    // Если текст развернут, показываем полностью
    if (isExpanded) {
      return description
    }

    // Если текст свернут, показываем только первые 66 символов
    return description.slice(0, SHORT_DESCRIPTION_LENGTH) + '...'
  }

  const handleToggleDescription = () => {
    setIsExpanded((prev) => !prev)
  }

  const hasImages = post.images && post.images.length > 0
  const hasMultipleImages = hasImages && post.images.length > 1
  const firstImage = hasImages ? post.images[0] : null

  return (
    <li className={s.postItem}>
      <div className={clsx(s.postImageWraper, isExpanded && s.postImageWraperExpanded)}>
        {hasMultipleImages ? (
          // Используем слайдер только если больше одного изображения
          // Link уже внутри слайдера
          <PostImageSlider
            images={post.images}
            postId={post.id}
            ownerId={post.ownerId}
            description={post.description}
          />
        ) : firstImage ? (
          // Одно изображение - показываем без слайдера
          <Link href={`/profile/${post.ownerId}/${post.id}`} prefetch={true}>
            <Image
              src={firstImage.url}
              alt={post.description || 'Post image'}
              width={firstImage.width || 234}
              height={firstImage.height || 240}
              className={s.postImage}
              loading="lazy"
            />
          </Link>
        ) : (
          <div className={s.postImagePlaceholder}>No image</div>
        )}
      </div>

      <div className={s.userInfo}>
        <Avatar src={post.avatarOwner} alt="Avatar Image" size="small" />
        <Link className={s.userName} href={`/profile/${post.ownerId}`} prefetch={true}>
          <span className={s.userName}>{post.userName}</span>
        </Link>
      </div>

      <span className={s.time}>{getTimeDifference(post.createdAt)}</span>

      <Typography variant="regular_14" className={s.description}>
        <span className={s.descriptionText}>{getDisplayedText()}</span>
        {shouldShowButton && (
          <Button variant={'textButton'} className={s.showMoreButton} onClick={handleToggleDescription}>
            {isExpanded ? 'Hide' : 'Show more'}
          </Button>
        )}
      </Typography>
    </li>
  )
}
