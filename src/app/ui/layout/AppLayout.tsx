'use client'

import { useAuth } from '@/shared/lib'
import { Button, Spinner } from '@/shared/ui'
import { Header } from '@/widgets'
import Link from 'next/link'
import { ReactNode } from 'react'
import { ROUTES } from '@/shared/lib/routes'
import { Sidebar } from '@/widgets/sidebar/Sidebar'

import s from './appLayout.module.css'
import clsx from 'clsx'

export const AppLayout = ({ children }: { children?: ReactNode }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) return <Spinner />

  const isAuth = !!user

  return (
    <div className={s.wrapper}>
      {isAuth ? (
        <Header />
      ) : (
        <Header>
          <nav>
            <ul style={{ display: 'flex', gap: '24px' }}>
              <li>
                <Button asChild variant={'textButton'}>
                  <Link href={ROUTES.AUTH.SIGN_IN}>Log in</Link>
                </Button>
              </li>
              <li>
                <Button asChild variant={'primary'}>
                  <Link href={ROUTES.AUTH.SIGN_UP}>Sign up</Link>
                </Button>
              </li>
            </ul>
          </nav>
        </Header>
      )}

      <div className={s.contentWithSidebar}>
        {isAuth && <Sidebar />}
        <main className={clsx(isAuth ? s.main : s.post)}>{children}</main>
      </div>
    </div>
  )
}
