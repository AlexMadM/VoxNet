'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoginMutation } from './useSignIn'
import { SignInForm, signInSchema } from '../model/validation'

export const useSignInForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    // reValidateMode: 'onChange',
    defaultValues: { email: '', password: '' }
  })

  const { mutate, isPending } = useLoginMutation(setError)

  const onSubmit = handleSubmit((data) => mutate(data))

  return { register, errors, isPending, onSubmit }
}
