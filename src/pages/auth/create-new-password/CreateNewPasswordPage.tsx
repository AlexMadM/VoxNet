'use client'
import { CreateNewPasswordForm, useCheckRecoveryCode } from '@/features/auth/forgot-password'
import { notFound, useSearchParams } from 'next/navigation'
import ExpiredLink from '@/features/auth/forgot-password/ui/ExpiredLink'
import { Spinner } from '@/shared/ui'

export const CreateNewPasswordPage = () => {
  const params = useSearchParams()
  const recoveryCode = params?.get('code')
  const email = params?.get('email')

  const { isPending, isError } = useCheckRecoveryCode(recoveryCode!)
  if (!email || !recoveryCode) notFound()
  if (isPending) return <Spinner />

  if (isError) {
    return <ExpiredLink />
  }

  return <CreateNewPasswordForm />
}
