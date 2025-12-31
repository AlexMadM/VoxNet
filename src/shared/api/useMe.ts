import { useQuery } from '@tanstack/react-query'

import { userApi } from '@/entities/user'

/**
 * Хук для получения данных текущего пользователя
 *
 * Оптимизирован для предотвращения лишних запросов:
 * - staleTime: 5 минут - данные пользователя меняются редко
 * - gcTime: 10 минут - данные хранятся в кэше 10 минут
 * - refetchOnMount: false - не перезагружает при монтировании, если данные свежие
 * - refetchOnWindowFocus: false - не перезагружает при фокусе окна
 * - refetchOnReconnect: false - не перезагружает при восстановлении соединения
 * - retry: false - не повторяет при ошибке (401 обрабатывается отдельно)
 * - structuralSharing: true - оптимизирует сравнение объектов для предотвращения лишних ре-рендеров
 *
 * Используется только в AuthProvider, все компоненты используют useAuth()
 */
export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: userApi.me,
    staleTime: 5 * 60 * 1000, // 5 минут - данные пользователя меняются редко
    gcTime: 10 * 60 * 1000, // 10 минут в кэше
    refetchOnMount: false, // Не перезагружать при монтировании, если данные свежие
    refetchOnWindowFocus: false, // Не перезагружать при фокусе окна
    refetchOnReconnect: false, // Не перезагружать при восстановлении соединения
    retry: false, // Не повторять при ошибке (401 обрабатывается отдельно)
    structuralSharing: true // Оптимизирует сравнение объектов для предотвращения лишних ре-рендеров
  })
}
