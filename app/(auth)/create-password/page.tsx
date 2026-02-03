import { Suspense } from 'react'
import { CreateNewPasswordPage, metadata } from '@/pages/auth/create-new-password'
import { Spinner } from '@/shared/ui'

export { metadata }

export default function CreatePassword() {
  return (
    <Suspense fallback={<Spinner />}>
      <CreateNewPasswordPage />
    </Suspense>
  )
}
