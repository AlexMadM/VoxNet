'use client'

import Link from 'next/link'
import { Button } from '@/shared/ui/button/Button'
import { Input, Typography } from '@/shared/ui'
import { useSignInForm } from '../api/useSignInForm'
import s from './signIn.module.css'
import { ROUTES } from '@/shared/lib/routes'

export const SignInForm = () => {
  const { register, errors, isPending, onSubmit } = useSignInForm()

  return (
    <div className={s.card}>
      <form onSubmit={onSubmit} className={s.form}>
        <div className={s.fieldsWrapper}>
          <div className={s.containerInput}>
            <Input
              label={'Email'}
              id={'email'}
              placeholder={'Epam@epam.com'}
              type={'email'}
              error={errors.email?.message}
              {...register('email')}
              className={s.inputCustom}
            />
          </div>
          <div className={s.containerInput}>
            <Input
              label={'Password'}
              id={'password'}
              placeholder={'**********'}
              type={'password'}
              error={errors.password?.message}
              {...register('password')}
              className={s.inputCustom}
            />
          </div>
        </div>
        <Typography asChild className={s.forgotPasswordLink} variant={'regular_link'}>
          <Link href={ROUTES.AUTH.FORGOT_PASSWORD}>Forgot Password</Link>
        </Typography>

        <Button disabled={isPending}>Sign In</Button>
      </form>
      <div className={s.registration}>
        <Typography asChild variant={'regular_14'}>
          <h2>Don’t have an account?</h2>
        </Typography>

        <Typography className={s.registrationLink} asChild variant={'h3'}>
          <Link href={ROUTES.AUTH.SIGN_UP}>Sign Up</Link>
        </Typography>
      </div>
    </div>
  )
}
