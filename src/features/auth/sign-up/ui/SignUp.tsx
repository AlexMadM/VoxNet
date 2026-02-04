import { BaseModal, Card, Checkbox, Input, Spinner, Typography } from '@/shared/ui'
import { Button } from '@/shared/ui/button/Button'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import s from './SignUp.module.css'
import Link from 'next/link'
import { Oauth } from '@/widgets'
import { SignUpForm, SignUpSchema } from '../model/validation'
import { ROUTES } from '@/shared/lib/routes'
import { useSignUp } from '@/features/auth'
import { AxiosError } from 'axios'
import { SignUpErrorResponse } from '@/entities/user'
import { useState } from 'react'

export const SignUp = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    watch,
    formState: { errors, isValid }
  } = useForm<SignUpForm>({
    defaultValues: { email: '', password: '', agree: false, confirmPassword: '', userName: '' },
    resolver: zodResolver(SignUpSchema),
    mode: 'onChange',
    reValidateMode: 'onChange'
  })
  const agree = watch('agree')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openModalEmail, setOpenModalEmail] = useState<string | null>(null)

  const handleClose = () => {
    setIsModalOpen(false)
  }

  const { mutate: signUpMutate, isPending } = useSignUp()

  const handleFormSubmit = (formData: SignUpForm) => {
    signUpMutate(
      {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.AUTH.CONFIRM_REGISTRATION}`
      },
      {
        onSuccess: () => {
          reset()
          setOpenModalEmail(formData.email)
          setIsModalOpen(true)
        },
        onError: (error: AxiosError<SignUpErrorResponse>) => {
          const messages = error.response?.data.messages
          if (messages) {
            setError(messages[0].field, { type: 'server error', message: messages[0].message })
          }
        }
      }
    )
  }

  if (isPending) return <Spinner />

  return (
    <>
      <Card className={s.card} as="form" noValidate onSubmit={handleSubmit(handleFormSubmit)}>
        <h2 className={s.title}>Sign Up</h2>

        <Oauth />

        <div className={s.containerInput}>
          <Input
            label="User name"
            type="text"
            id="Username"
            placeholder="Epam11"
            error={errors.userName?.message}
            {...register('userName')}
            className={s.inputCustom}
          />
        </div>

        <div className={s.containerInput}>
          <Input
            label="Email"
            type="email"
            id="Email"
            placeholder="Epam@epam.com"
            error={errors.email?.message}
            {...register('email')}
            className={s.inputCustom}
          />
        </div>

        <div className={s.containerInput}>
          <Input
            label="Password"
            type="password"
            id="Password"
            placeholder="******************"
            error={errors.password?.message}
            {...register('password')}
            className={s.inputCustom}
          />
        </div>

        <div className={s.containerInput}>
          <Input
            label="Password Сonfirmation"
            type="password"
            id="confirmPassword"
            placeholder="******************"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
            className={s.inputCustom}
          />
        </div>

        <div className={s.containerIAgree}>
          <Controller
            name="agree"
            control={control}
            render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />}
          />
          <Typography variant="small" className={s.paragraph}>
            I agree to the{' '}
            <Typography asChild className={s.link} variant={'regular_link'}>
              <Link href={ROUTES.LEGAL.TERMS_OF_SERVICE}>Terms of Service</Link>
            </Typography>{' '}
            and{' '}
            <Typography asChild className={s.link} variant={'regular_link'}>
              <Link href={ROUTES.LEGAL.PRIVACY_POLICY}>Privacy Policy</Link>
            </Typography>
          </Typography>
        </div>

        <Button
          variant={'primary'}
          type="submit"
          className={s.buttonFullWidth}
          disabled={isPending || !isValid || !agree}
        >
          Sign Up
        </Button>

        <Typography variant="regular_16" className={s.paragraph}>
          Do you have an account?
        </Typography>
        <Link href={'/sign-in'}>
          <Button variant={'textButton'}>Sign In</Button>
        </Link>
      </Card>

      {openModalEmail && (
        <div>
          <BaseModal open={isModalOpen} onOpenChange={handleClose} title="Email sent">
            <Typography variant="regular_16" className={s.textModal}>
              We have sent a link to confirm your email to <b>{openModalEmail}</b>
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button className={s.buttonModal} onClick={handleClose}>
                Ok
              </Button>
            </div>
          </BaseModal>
        </div>
      )}
    </>
  )
}
