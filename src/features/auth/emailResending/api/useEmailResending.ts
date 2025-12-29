import { useMutation } from '@tanstack/react-query'
import { userApi } from '@/entities/user'
import { EmailResendingErrorResponse, EmailResendingRequest } from '@/entities/user/api/user-types'
import { AxiosError } from 'axios'

export const useEmailResending = () => {
  return useMutation<void, AxiosError<EmailResendingErrorResponse>, EmailResendingRequest>({
    mutationFn: (payload) => userApi.emailResending(payload)
  })
}
