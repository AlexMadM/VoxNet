'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SignInForm } from '../model/validation'
import { UseFormSetError } from 'react-hook-form'
import { handleFormError } from '@/shared/lib/errors'
import { userApi } from '@/entities/user'

export const useLoginMutation = (setError: UseFormSetError<SignInForm>) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: userApi.signIn,
    onSuccess: async (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken)
      }
      await qc.invalidateQueries({ queryKey: ['me'] })
    },
    onError: (error) => handleFormError(error, setError, 'password')

    // onError: (error: AxiosError<SignInErrorResponse>) => {
    //   const message = error.response?.data?.messages || 'Authentication failed'
    //   setError('password', { type: 'server', message })
    // }
  })
}
