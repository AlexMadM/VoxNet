'use client'
import React from 'react'
import { Oauth } from '@/widgets/oauth'
import { Card, Typography } from '@/shared/ui'
import { WithGuestGuard } from '@/shared/lib/hoc/WithGuestGuard'
import { SignInForm } from '@/features/auth'
import s from './sign-in.module.css'

export const Page = () => {
  return (
    <Card className={s.card}>
      <Typography variant={'h1'} asChild className={s.title}>
        <h1>Sign In</h1>
      </Typography>
      <Oauth />
      <SignInForm />
    </Card>
  )
}

export const SignInPage = WithGuestGuard(Page)
