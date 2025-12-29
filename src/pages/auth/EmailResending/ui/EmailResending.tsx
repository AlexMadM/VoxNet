'use client'

import { notFound, useSearchParams } from 'next/navigation'
import { useEmailResending } from '@/features/auth/emailResending'
import { useState } from 'react'
import { BaseModal, Button, Input, Spinner, Typography } from '@/shared/ui'
import s from './EmailResending.module.css'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EmailResendingForm, EmailResendingSchema } from '@/pages/auth/EmailResending/model'
import { ROUTES } from '@/shared/lib/routes'
import { Resending } from '@/shared/ui/icons/Resending'

export function EmailResending() {
  const searchParams = useSearchParams()
  const emailParam = searchParams?.get('email')
  if (!emailParam) notFound()

  const { mutateAsync, isPending, isError, error } = useEmailResending()
  const [openModalEmail, setOpenModalEmail] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EmailResendingForm>({
    defaultValues: { email: emailParam },
    resolver: zodResolver(EmailResendingSchema),
    mode: 'onBlur'
  })

  const handleResend = async (data: EmailResendingForm) => {
    const email = data.email || emailParam

    await mutateAsync(
      { email, baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.AUTH.CONFIRM_REGISTRATION}` },
      {
        onSuccess: () => {
          setOpenModalEmail(email)
          setIsModalOpen(true)
        }
      }
    )
  }
  if (isPending) return <Spinner />

  if (isError) {
    const message = error?.response?.data?.messages?.[0]?.message ?? 'Something went wrong'
    alert(message)
  }

  const handleClose = () => {
    setIsModalOpen(false)
  }

  return (
    <div className={s.wrapperEmailResending}>
      <Typography variant="h1">Email verification link expired</Typography>
      <Typography className={s.resendingMessage} variant="regular_16">
        Looks like the verification link has expired. Not to worry, we can send the link again
      </Typography>

      <form className={s.form} onSubmit={handleSubmit(handleResend)}>
        <Input
          label={'Email'}
          id={'email'}
          placeholder={'Epam@epam.com'}
          type={'email'}
          error={errors.email?.message}
          {...register('email')}
        />
        <Button className={s.button} variant={'primary'} type="submit" disabled={isPending}>
          <Typography variant="h3">Resend verification link</Typography>
        </Button>
      </form>

      <Resending />

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
    </div>
  )
}
