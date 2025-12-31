import { Suspense } from 'react'
import { CreateNewPasswordPage, metadata } from '@/pages/auth/create-new-password'

export { metadata }

export default function CreatePassword() {
  return (
    <Suspense fallback={null}>
      <CreateNewPasswordPage />
    </Suspense>
  )
}
