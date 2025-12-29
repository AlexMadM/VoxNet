'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, Input, Spinner, Typography } from '@/shared/ui'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSetNewPassword } from '../api/useNewPassword'
import { CreatePasswordInput, passwordSchema } from '../model/validatePassword'
import s from './ForgotPasswordForm.module.css'
import { ROUTES } from '@/shared/lib/routes'

export const CreateNewPasswordForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const recoveryCode = searchParams?.get('code') || ''

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreatePasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', password_confirmation: '' }
  })

  const { mutate: setNewPassword, isPending } = useSetNewPassword()
  const onSubmit: SubmitHandler<CreatePasswordInput> = (data) => {
    if (!recoveryCode) {
      return
    }

    setNewPassword(
      { newPassword: data.password, recoveryCode },
      {
        onSuccess: () => {
          reset()
          router.replace(ROUTES.AUTH.SIGN_IN)
        }
      }
    )
  }

  return (
    <Card as="form" className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h1">Create New Password</Typography>

      <div className={s.field}>
        <Input
          id="password"
          label="New password"
          type="password"
          placeholder="******************"
          error={!!errors.password}
          {...register('password')}
        />
      </div>

      <div className={s.field}>
        <Input
          id="password_confirmation"
          label="Password confirmation"
          type="password"
          placeholder="******************"
          error={!!errors.password_confirmation}
          {...register('password_confirmation')}
        />
        {errors.password_confirmation && <span className={s.errorMessage}>{errors.password_confirmation.message}</span>}
      </div>

      <p className={s.text}>Your password must be between 6 and 20 characters</p>

      <Button variant="primary" className={s.buttonPassword} type="submit" disabled={isPending}>
        {isPending ? <Spinner inline /> : 'Create new password'}
      </Button>
    </Card>
  )
}
