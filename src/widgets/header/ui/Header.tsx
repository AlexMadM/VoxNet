'use client'
import s from './header.module.css'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Button, Typography } from '@/shared/ui'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/shared/lib'
import { NotificationBell } from '@/widgets/notifications'

type Props = {
  children?: ReactNode
}

export const Header = ({ children }: Props) => {
  const { user } = useAuth()

  return (
    <header className={s.header}>
      <div className={s.container}>
        <Link className={s.logo} href="/">
          <Typography variant={'large'} asChild>
            <span>Inctagram</span>
          </Typography>
        </Link>
        <div className={s.box}>
          {user && <NotificationBell />}
          {children}
        </div>
      </div>
    </header>
  )
}
