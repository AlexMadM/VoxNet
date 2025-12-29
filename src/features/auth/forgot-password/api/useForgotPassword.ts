import { useMutation } from '@tanstack/react-query'
import { SendRecoveryEmailType, userApi } from '@/entities/user'
import { AxiosError } from 'axios'

export const useForgotPassword = () => {
  return useMutation<
    void,
    // ↑ ✔ ИСПРАВЛЕНО: добавили первый generic — тип успешного ответа (Swagger: 204 No Content → void)

    AxiosError<{
      statusCode: number
      messages: { message: string; field: string }[]
    }>,
    // ↑ ✔ ИСПРАВЛЕНО: расширили тип ошибки под Swagger UC-3

    SendRecoveryEmailType
    // ↑ ✔ оставлено без изменений — аргументы mutate
  >({
    mutationFn: userApi.sendRecoveryEmail
  })
}
