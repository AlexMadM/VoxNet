import { useQuery } from '@tanstack/react-query'

import { userApi } from '@/entities/user'

/**
 * Хук для получения данных текущего пользователя
 *
 * Оптимизирован для предотвращения лишних запросов:
 * - staleTime: 5 минут - данные пользователя меняются редко
 * - refetchOnMount: false - не перезагружает при монтировании
 * - refetchOnWindowFocus: false - не перезагружает при фокусе окна
 */
export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: userApi.me,
    staleTime: 5 * 60 * 1000, // 5 минут - данные пользователя меняются редко
    gcTime: 10 * 60 * 1000, // 10 минут в кэше
    refetchOnMount: false, // Не перезагружать при монтировании, если данные свежие
    refetchOnWindowFocus: false, // Не перезагружать при фокусе окна
    retry: false // Не повторять при ошибке (401 обрабатывается отдельно)
  })
}
