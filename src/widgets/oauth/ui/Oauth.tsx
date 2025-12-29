'use client'
import { Button, Github } from '@/shared/ui'
import s from './oauth.module.css'

export const Oauth = () => {
  const loginWithGitHub = () => {
    const backendUrl = process.env.NEXT_PUBLIC_OAUTH_URL
    const redirectUrl = process.env.NEXT_PUBLIC_BASE_URL!

    window.location.assign(`${backendUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`)
  }
  return (
    <div className={s.container}>
      <Button className={s.button} onClick={loginWithGitHub} variant={'textButton'} style={{ color: 'currentColor' }}>
        <Github />
      </Button>
    </div>
  )
}
