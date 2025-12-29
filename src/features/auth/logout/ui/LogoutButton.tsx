'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui/button/Button'
import { Logout } from '@/shared/ui/icons'
import clsx from 'clsx'

import s from './logoutButton.module.css'
import { BaseModal, Typography } from '@/shared/ui'
import { useLogout } from '../api/useLogout'

type Props = {
  variant?: 'icon' | 'text' | 'both'
  className?: string
}

export const LogoutButton = ({ variant = 'both', className }: Props) => {
  const { mutate: handleLogout, isPending } = useLogout()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    if (!open && isPending) return
    setIsModalOpen(open)
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        disabled={isPending}
        variant={'textButton'}
        className={clsx(s.button, className)}
      >
        <div className={s.center}>
          {(variant === 'icon' || variant === 'both') && <Logout width={24} height={24} />}
          {(variant === 'text' || variant === 'both') && (
            <Typography className={s.text} variant="medium_14" asChild>
              <span>Log Out</span>
            </Typography>
          )}
        </div>
      </Button>

      <BaseModal open={isModalOpen} onOpenChange={handleOpenChange} title="Log Out">
        <Typography variant="regular_16" className={s.message}>
          Do you really want to log out of your account?
        </Typography>
        <div className={s.buttons}>
          <Button variant="primary" onClick={() => handleLogout()} disabled={isPending} className={s.confirmButton}>
            {isPending ? 'Logging out...' : 'Yes'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => !isPending && setIsModalOpen(false)}
            disabled={isPending}
            className={s.cancelButton}
          >
            No
          </Button>
        </div>
      </BaseModal>
    </>
  )
}
