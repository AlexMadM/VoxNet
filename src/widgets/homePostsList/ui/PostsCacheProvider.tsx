'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Post } from '@/entities/posts/api/types'

type Props = {
  posts: Post[]
  children: React.ReactNode
}

/**
 * Провайдер для предзаполнения кеша React Query данными постов
 *
 * Когда пользователь открывает модальное окно поста,
 * данные уже будут в кеше и не потребуется дополнительный запрос.
 * React Query автоматически использует кешированные данные,
 * если они еще не устарели (staleTime: 5 минут в usePost)
 */
export const PostsCacheProvider = ({ posts, children }: Props) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Предзаполняем кеш для каждого поста
    // Используем тот же queryKey, что и в usePost: ['post', postId]
    posts.forEach((post) => {
      queryClient.setQueryData<Post>(['post', post.id], post)
    })
  }, [posts, queryClient])

  return <>{children}</>
}
