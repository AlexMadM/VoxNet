import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ConfirmErrorResponse } from '@/entities/user/api/user-types'
import { userApi } from '@/entities/user'

export const useCheckConfirmCode = (confirmCode: string) => {
  return useQuery<null, AxiosError<ConfirmErrorResponse>>({
    queryKey: ['check-confirm-code', confirmCode],
    queryFn: async () => {
      await userApi.confirm({
        confirmationCode: confirmCode
      })
      return null
    },
    enabled: !!confirmCode,
    retry: false
  })
}
