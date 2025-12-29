import { useMutation } from '@tanstack/react-query'
import { userApi } from '@/entities/user'
import { AxiosError } from 'axios'

// Хук для установки нового пароля
export const useSetNewPassword = () => {
  return useMutation<
    void,
    AxiosError<{ statusCode: number; messages: { message: string; field: string }[] }>,
    { newPassword: string; recoveryCode: string }
  >({
    mutationFn: (data: { newPassword: string; recoveryCode: string }) => userApi.SetNewPassword(data)
  })
}
