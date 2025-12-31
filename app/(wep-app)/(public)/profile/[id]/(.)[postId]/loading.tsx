import { PostModalSkeleton } from '@/shared/ui'

/**
 * Loading UI для intercepting route поста
 * 
 * Автоматически показывается Next.js во время выполнения await prefetchPostWithComments()
 * в page.tsx. Это происходит при клиентской навигации (когда пользователь кликает на пост).
 * 
 * Скелетон отображается до загрузки данных поста при перехвате навигации
 */
export default function PostModalLoading() {
  return (
    <div >
      <PostModalSkeleton />
    </div>
  )
}

