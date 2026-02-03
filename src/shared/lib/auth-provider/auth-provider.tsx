'use client'

import { User } from '@/entities/user'
import { createContext, ReactNode, useContext } from 'react'
import { useMe } from '@/shared/api'

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  isError: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Хук для доступа к данным аутентификации
 * @throws {Error} если используется вне AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

/**
 * Провайдер аутентификации для всего приложения
 * Предоставляет информацию о текущем пользователе через контекст
 *
 * @remarks
 * - Использует React Query для кэширования данных пользователя
 * - Автоматически обновляет токены через axios interceptors
 * - Данные доступны только в Client Components
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: user = null, isLoading, isError } = useMe()

  const value: AuthContextValue = {
    user,
    isLoading,
    isError
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
