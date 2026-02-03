'use client'

import { createContext, ReactNode, useMemo } from 'react'
import { User } from '@/entities/user'

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  isError: boolean
}

/**
 * Контекст для тестирования и Storybook
 * @internal - используйте только в тестах и stories
 */
export const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Mock провайдер для Storybook и тестов
 *
 * @example
 * // В Storybook story:
 * export const MyStory = {
 *   decorators: [
 *     (Story) => (
 *       <MockAuthProvider user={mockUser}>
 *         <Story />
 *       </MockAuthProvider>
 *     )
 *   ]
 * }
 */
export const MockAuthProvider = ({
  children,
  user = null,
  isLoading = false,
  isError = false
}: {
  children: ReactNode
  user?: User | null
  isLoading?: boolean
  isError?: boolean
}) => {
  const value = useMemo(
    () => ({
      user,
      isLoading,
      isError
    }),
    [user, isLoading, isError]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
