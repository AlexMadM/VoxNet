'use client'

import { Button, Resend, Spinner, Typography } from '@/shared/ui'
import { useResendRecoveryEmail } from '../api/useResendRecoveryEmail'
import s from './ForgotPasswordForm.module.css'
import { useSearchParams } from 'next/navigation'
import { ROUTES } from '@/shared/lib/routes'
import { Dialog, DialogClose } from '@/shared/ui/temp/dialog'
import { useState } from 'react'

export default function ExpiredLink() {
  const savedEmail = useSearchParams()?.get('email')
  const { mutate: resendEmail, isPending } = useResendRecoveryEmail()
  // 👇 НОВОЕ СОСТОЯНИЕ ДЛЯ ДИАЛОГА
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleResend = () => {
    if (!savedEmail) return

    resendEmail(
      {
        email: savedEmail,
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.AUTH.CREATE_NEW_PASSWORD}`
      },
      {
        onSuccess: () => {
          // alert(`We have sent a link to confirm your email to ${savedEmail}`)
          setIsDialogOpen(true) // ✅ Открываем диалог через состояние
        }
      }
    )
  }

  return (
    <>
      <div className={s.container}>
        <div className={s.contentPage}>
          <Typography variant="h1">Email verification link expired</Typography>
          <p className={s.textPage}>
            Looks like the verification link has expired. Not to worry, we can send the link again
          </p>
          <Button className={s.buttonPage} onClick={handleResend} disabled={isPending}>
            {isPending ? <Spinner inline /> : 'Resend link'}
          </Button>
          <Resend className={s.illustration} width={473} height={352} />
        </div>
      </div>

      {/* 👇 ВАШ ДИАЛОГ С ПРАВИЛЬНЫМИ ПРОПСАМИ И ВНУТРЕННИМ КОНТЕНТОМ */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen} // Используем onOpenChange, как требует Radix/ваши типы
        title="Email sent" // Передаем заголовок через пропс title
      >
        {/* Контент внутри Dialog передается через children */}
        <div className={s.modalContent}>
          <p className={s.textModal}>We have sent a link to confirm your email to {savedEmail}</p>
          <DialogClose asChild>
            <Button className={s.buttonModal}>Ok</Button>
          </DialogClose>
        </div>
      </Dialog>
    </>
  )
}
