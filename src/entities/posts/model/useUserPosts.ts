'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { postsApi } from '../api/posts'

type UseUserPostsParams = {
  userId: number
  pageSize?: number
}


export const useUserPosts = ({ userId, pageSize = 8 }: UseUserPostsParams) => {
  return useInfiniteQuery({
    queryKey: ['user-posts', userId, pageSize],
    queryFn: async ({ pageParam }: { pageParam: number | null }) => {
      // pageParam - это endCursorPostId (ID последнего поста) или null для первой страницы
      const cursor = pageParam === null ? undefined : pageParam
      return postsApi.getUserPosts(userId, pageSize, cursor)
    },
    getNextPageParam: (lastPage) => {
      // Проверяем, есть ли еще посты для загрузки
      if (!lastPage.items || lastPage.items.length === 0) {
        return null // Нет постов - больше загружать нечего
      }

      // Если вернулось меньше постов, чем pageSize, значит это последняя страница
      if (lastPage.items.length < pageSize) {
        return null // Последняя страница
      }

      // Возвращаем ID последнего поста из текущей страницы как cursor для следующего запроса
      const lastPost = lastPage.items[lastPage.items.length - 1]
      return lastPost?.id ?? null
    },
    initialPageParam: null, // Первый запрос без cursor
    enabled: Number.isFinite(userId) && userId > 0, // Запрос выполняется только при валидном userId
    retry: 1, // Одна повторная попытка при ошибке
    refetchOnWindowFocus: false, // Не перезагружать при возврате на вкладку
    refetchOnMount: false, // Не перезагружать при монтировании - предотвращает лишние запросы при закрытии модального окна поста
    refetchOnReconnect: true // Обновлять при восстановлении соединения
  })
}

