import { useMutation } from '@tanstack/react-query'
import { SignUpErrorResponse, SignUpRequest } from '@/entities/user'
import { userApi } from '@/entities/user'
import { AxiosError } from 'axios'

export const useSignUp = () => {
  return useMutation<void, AxiosError<SignUpErrorResponse>, SignUpRequest>({
    mutationFn: (payload) => userApi.signUp(payload)
  })
}
