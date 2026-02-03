import { Suspense } from 'react'
import { ConfirmPage } from '@/pages/auth/confirm'
import { Spinner } from '@/shared/ui'

export default function Confirm() {
  return (
    <Suspense fallback={<Spinner />}>
      <ConfirmPage />
    </Suspense>
  )
}
