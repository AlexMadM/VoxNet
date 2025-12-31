import { Suspense } from 'react'
import { ConfirmPage } from '@/pages/auth/confirm'

export default function Confirm() {
  return (
    <Suspense fallback={null}>
      <ConfirmPage />
    </Suspense>
  )
}
