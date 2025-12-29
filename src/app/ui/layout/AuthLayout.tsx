import React, { ReactNode } from 'react'
import { Header } from '@/widgets'

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <main style={{ marginTop: '24px' }}>{children}</main>
    </>
  )
}
