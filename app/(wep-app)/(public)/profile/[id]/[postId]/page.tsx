import { Metadata } from 'next'
import { HydrationBoundary } from '@tanstack/react-query'
import { PostModal } from '@/features/posts'
import { prefetchPostWithComments } from '@/features/posts/view-post/api/prefetch-posts'

export const metadata: Metadata = { title: 'Post' }

/**
 * Обычная страница поста для прямого доступа (F5, прямая ссылка, share)
 *
 * Когда пользователь открывает /post/[postId] напрямую (не через клик),
 * используется этот роут вместо intercepting route.
 *
 * Реализован SSR с HydrationBoundary для предзагрузки данных на сервере.
 * Скелетон показывается автоматически через loading.tsx во время await prefetchPostWithComments()
 */
type Props = {
  params: Promise<{ postId: string }>
}

const PostPage = async ({ params }: Props) => {
  const { postId } = await params
  const postIdNumber = parseInt(postId, 10)

  // Валидация postId
  if (isNaN(postIdNumber) || postIdNumber <= 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Неверный ID поста</p>
      </div>
    )
  }

  // Предзагружаем данные поста и комментариев в одном QueryClient
  // loading.tsx автоматически показывается во время выполнения этого await
  const dehydratedState = prefetchPostWithComments(postIdNumber)

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostModal postId={postIdNumber} />
    </HydrationBoundary>
  )
}

export default PostPage
