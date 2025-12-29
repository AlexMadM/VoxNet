'use client'
import { ReactNode } from 'react'
import { WithAuthGuard } from '@/shared/lib'

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>
}

export default WithAuthGuard(ProtectedLayout)
