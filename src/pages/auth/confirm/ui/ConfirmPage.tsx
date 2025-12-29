'use client'

import { Button, Spinner, Typography } from '@/shared/ui'
import Link from 'next/link'
import s from './ConfirmPage.module.css'
import { notFound, useSearchParams } from 'next/navigation'
import { useCheckConfirmCode } from '@/pages/auth/confirm/api/useCheckConfirmCode'
import { EmailResending } from '@/pages/auth/EmailResending/ui/EmailResending'
import { Confirmed } from '@/shared/ui/icons/Confirmed'

export function ConfirmPage() {
  const params = useSearchParams()
  const confirmCode = params?.get('code') ?? '12'
  const email = params?.get('email')

  if (!email || !confirmCode) notFound()

  const { isPending, isError } = useCheckConfirmCode(confirmCode)

  if (isPending) return <Spinner />

  if (isError) {
    return <EmailResending />
  }

  return (
    <div className={s.wrapperConfirm}>
      <Typography variant="h1">Congratulations!</Typography>
      <Typography className={s.confirmMessage} variant="regular_16">
        Your email has been confirmed
      </Typography>

      <Button asChild className={s.button} variant={'primary'}>
        <Link href={'/sign-in'}>Sign In</Link>
      </Button>
      <Confirmed width={432} height={300} />
    </div>
  )
}
