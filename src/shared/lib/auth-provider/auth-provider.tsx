'use client'

import { User } from '@/entities/user'
import { createContext, ReactNode, useContext, useMemo } from 'react'
import { useMe } from '@/shared/api'

/**
 * Тип контекста аутентификации
 */
export type AuthContextValue = {
  /** Данные текущего пользователя или null, если не авторизован */
  user: User | null
  /** Флаг загрузки данных пользователя */
  isLoading: boolean
  /** Флаг ошибки при загрузке данных пользователя */
  isError: boolean
  /** Удобный хелпер для проверки авторизации */
  isAuthenticated: boolean
}

const Auth = createContext<AuthContextValue | null>(null)
export const AuthContext = Auth

/**
 * Хук для доступа к контексту аутентификации
 * @throws {Error} Если используется вне AuthProvider
 * @returns Объект с данными пользователя и состояниями загрузки
 */
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(Auth)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

/**
 * Провайдер контекста аутентификации
 * Обертывает приложение и предоставляет данные текущего пользователя через контекст
 *
 * Оптимизации:
 * - Использует useMemo для мемоизации значения контекста
 * - Предотвращает ненужные ре-рендеры дочерних компонентов
 * - Использует React Query для кэширования данных пользователя
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading, isError } = useMe()

  // Мемоизируем значение контекста для предотвращения ненужных ре-рендеров
  // дочерних компонентов при обновлении провайдера
  // Используем ?? вместо || для более точного null-coalescing
  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isLoading,
      isError,
      isAuthenticated: user !== undefined && user !== null && !isError
    }),
    [user, isLoading, isError]
  )

  return <Auth.Provider value={contextValue}>{children}</Auth.Provider>
}
