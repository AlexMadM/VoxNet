import { useMutation } from '@tanstack/react-query'
import { ResendRecoveryEmailType, userApi } from '@/entities/user'
import { AxiosError } from 'axios'

// Хук для повторной отправки письма восстановления
export const useResendRecoveryEmail = () => {
  return useMutation<
    void,
    AxiosError<{
      statusCode: number
      messages: { message: string; field: string }[]
    }>,
    ResendRecoveryEmailType
  >({
    //  mutationFn теперь принимает объект payload с типом ResendRecoveryEmailType
    mutationFn: (payload: ResendRecoveryEmailType) => userApi.resendRecoveryEmail(payload)
  })
}
