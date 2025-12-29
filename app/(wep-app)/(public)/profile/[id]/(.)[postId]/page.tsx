import { HydrationBoundary } from '@tanstack/react-query'
import { PostModal } from '@/features/posts'
import { prefetchPostWithComments } from '@/features/posts/view-post/api/prefetch-posts'

/**
 * Intercepting Route для модального окна поста
 *
 * Этот файл перехватывает навигацию на /profile/[id]/[postId] и показывает модальное окно
 * вместо полной перезагрузки страницы.
 *
 * Синтаксис (.) означает перехват на том же уровне роутинга.
 *
 * Как это работает:
 * 1. Пользователь кликает на пост → навигация на /profile/123/456
 * 2. Next.js перехватывает навигацию через (.)[postId]
 * 3. Рендерится модальное окно, URL обновляется на /profile/123/456
 * 4. При закрытии модального окна (router.back()) возвращаемся на предыдущую страницу
 * 5. При прямом переходе на /profile/123/456 (F5, прямая ссылка) используется обычный [postId]/page.tsx
 *
 * Реализован SSR с HydrationBoundary для предзагрузки данных на сервере.
 * Скелетон показывается автоматически через loading.tsx во время await prefetchPostWithComments()
 *
 * Стратегия кеширования:
 * - Посты динамические (данные меняются: лайки, комментарии, редактирование)
 * - Route Cache: 30 секунд (по умолчанию) - кеширует результат рендеринга
 * - React Query кеш: 2 минуты (staleTime) - кеширует данные на клиенте
 * - Это баланс между актуальностью данных и производительностью
 */


type Props = {
  params: Promise<{ postId: string }>
}

export default async function PostModalPage({ params }: Props) {
  const { postId } = await params
  const postIdNumber = parseInt(postId, 10)

  if (isNaN(postIdNumber) || postIdNumber <= 0) {
    return null
  }

  // Предзагружаем данные поста и комментариев в одном QueryClient
  // ensureQueryData проверяет кеш и делает запрос только если данных нет или они устарели
  // loading.tsx автоматически показывается во время выполнения этого await
  const dehydratedState = await prefetchPostWithComments(postIdNumber)

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostModal postId={postIdNumber} />
    </HydrationBoundary>
  )
}
