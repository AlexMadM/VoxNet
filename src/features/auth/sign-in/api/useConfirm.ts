import { useMutation } from '@tanstack/react-query'
import { ConfirmErrorResponse, ConfirmRequest } from '@/entities/user/api/user-types'
import { userApi } from '@/entities/user'
import { AxiosError } from 'axios'

export const useConfirm = () => {
  return useMutation<void, AxiosError<ConfirmErrorResponse>, ConfirmRequest>({
    mutationFn: async (payload) => userApi.confirm(payload)
  })
}
