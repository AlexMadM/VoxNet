import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { userApi } from '@/entities/user'
import { ROUTES } from '@/shared/lib/routes'

export const useLogout = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: userApi.logout,
    onSuccess: () => {
      // Удаляем токен из localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
      }

      // Устанавливаем данные пользователя в null (без нового запроса)
      queryClient.setQueryData(['me'], null)

      // Очищаем остальные кэшированные данные
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== 'me'
      })

      // Перенаправляем на страницу входа
      router.push(ROUTES.AUTH.SIGN_IN)
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      // Даже при ошибке очищаем локальные данные
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
      }

      // Устанавливаем данные пользователя в null
      queryClient.setQueryData(['me'], null)

      // Очищаем остальные данные
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== 'me'
      })

      router.push(ROUTES.AUTH.SIGN_IN)
    }
  })

  return mutation
}
