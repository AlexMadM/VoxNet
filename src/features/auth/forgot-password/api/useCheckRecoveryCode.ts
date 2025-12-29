import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { userApi } from '@/entities/user'
import { CheckRecoveryCodeResponse } from '@/entities/user/api/user-types'

export const useCheckRecoveryCode = (recoveryCode: string) =>
  useQuery<
    CheckRecoveryCodeResponse,
    AxiosError<{ statusCode: number; messages: { message: string; field: string }[] }>
  >({
    queryKey: ['check-recovery-code', recoveryCode],
    queryFn: ({ queryKey }) => {
      const [, code] = queryKey

      return userApi.checkRecoveryCode({
        recoveryCode: code as string
      })
    },
    enabled: !!recoveryCode,
    retry: false
  })
