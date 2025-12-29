'use client'
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { Close, Typography } from '@/shared/ui'
import s from './modal.module.css'

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close {...props} />
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return <DialogPrimitive.Overlay className={clsx(s.overlay, className)} {...props} />
}

type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  title?: React.ReactNode
  showCloseButton?: boolean
}

function DialogContent({
  className,
  children,
  title,
  showCloseButton = true,

  ...props
}: DialogContentProps) {
  const shouldRenderHeader = Boolean(title) || showCloseButton

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content aria-describedby={undefined} className={clsx(s.content, className)} {...props}>
        {shouldRenderHeader && (
          <DialogHeader className={s.header}>
            {title && (
              <DialogTitle>
                <Typography variant={'h1'}>{title}</Typography>
              </DialogTitle>
            )}
            {!title && <DialogTitle className={s.srOnly}>Диалог</DialogTitle>}
            {showCloseButton && (
              <DialogPrimitive.Close className={s.closeButton} aria-label="Закрыть">
                <Close />
              </DialogPrimitive.Close>
            )}
          </DialogHeader>
        )}
        {!title && !shouldRenderHeader && <DialogTitle className={s.srOnly}>Диалог</DialogTitle>}
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={clsx(s.header, className)} {...props} />
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={clsx(s.footer, className)} {...props} />
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={clsx(s.title, className)} {...props} />
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={clsx(s.description, className)} {...props} />
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
}
