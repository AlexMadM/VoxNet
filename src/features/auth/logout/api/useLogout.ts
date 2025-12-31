import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { userApi } from '@/entities/user'
import { ROUTES } from '@/shared/lib/routes'

export const useLogout = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: userApi.logout,
    onSuccess: async () => {
      // Удаляем токен из localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
      }

      // Явно устанавливаем user в null, чтобы AuthProvider сразу обновился
      // Это обновит контекст и все компоненты, использующие useAuth()
      queryClient.setQueryData(['me'], null)

      // Очищаем все остальные кэшированные данные (кроме ['me'])
      // Используем removeQueries с фильтром, чтобы сохранить ['me'] с null значением
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== 'me'
      })

      // Используем replace вместо push, чтобы не добавлять в историю
      // replace автоматически обновит страницу и состояние
      router.replace(ROUTES.AUTH.SIGN_IN)
    },
    onError: async (error) => {
      console.error('Logout failed:', error)
      // Даже при ошибке очищаем локальные данные
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
      }

      // Явно устанавливаем user в null, чтобы AuthProvider сразу обновился
      queryClient.setQueryData(['me'], null)

      // Очищаем все остальные кэшированные данные (кроме ['me'])
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== 'me'
      })

      router.replace(ROUTES.AUTH.SIGN_IN)
    }
  })

  return mutation
}
