'use client'

import { User } from '@/entities/user'
import { createContext, ReactNode, useContext, useMemo } from 'react'
import { useMe } from '@/shared/api'

/**
 * Тип контекста аутентификации
 *
 * Интегрирован с TanStack Query через useMe хук
 */
export type AuthContextValue = {
  /** Данные текущего пользователя или null, если не авторизован */
  user: User | null
  /** Флаг загрузки данных пользователя (из React Query) */
  isLoading: boolean
  /** Флаг ошибки при загрузке данных пользователя (из React Query) */
  isError: boolean
  /**
   * Удобный хелпер для проверки авторизации
   * true только если user существует и нет ошибки
   */
  isAuthenticated: boolean
}

const Auth = createContext<AuthContextValue | null>(null)
export const AuthContext = Auth


export const useAuth = (): AuthContextValue => {
  const ctx = useContext(Auth)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Получаем данные из React Query
  // data может быть: undefined (загрузка), User (авторизован), или undefined (ошибка/не авторизован)
  const { data: user, isLoading, isError } = useMe()

  // Мемоизируем значение контекста для предотвращения ненужных ре-рендеров
  // дочерних компонентов при обновлении провайдера
  //
  // Важно: useMemo зависит от user, isLoading, isError
  // При изменении любого из этих значений контекст обновится
  const contextValue = useMemo<AuthContextValue>(() => {
    // Преобразуем undefined в null для более предсказуемого поведения
    // В React Query data может быть undefined до первого запроса или после ошибки
    const userValue = user ?? null

    // isAuthenticated: true только если пользователь существует и нет ошибки
    // Простая проверка: !!userValue проверяет, что user не null и не undefined
    // !isError гарантирует, что запрос не завершился с ошибкой (например, 401)
    const authenticated = !!userValue && !isError

    return {
      user: userValue,
      isLoading,
      isError,
      isAuthenticated: authenticated
    }
  }, [user, isLoading, isError])

  return <Auth.Provider value={contextValue}>{children}</Auth.Provider>
}
