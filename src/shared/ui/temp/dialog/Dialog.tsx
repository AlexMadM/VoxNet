import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Card, Close, Typography } from '@/shared/ui'
import s from './Dialog.module.css'
import { clsx } from 'clsx'

type Props = {
  className?: string
  title?: string
  trigger?: ReactNode
  closeOutContent?: boolean
} & ComponentPropsWithoutRef<typeof DialogPrimitive.Root>

export const Dialog = (props: Props) => {
  const { className, title, trigger, children, closeOutContent, ...rest } = props
  return (
    <DialogPrimitive.Root {...rest}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={s.overlay} />
        <DialogPrimitive.Content asChild className={clsx(className, s.container)}>
          <Card className={s.card}>
            {title && (
              <DialogPrimitive.Title asChild className={s.title} aria-describedby={'modal title'}>
                <header>
                  <Typography variant={'h1'} asChild>
                    <h1>{title}</h1>
                  </Typography>
                  <DialogClose className={clsx(closeOutContent && s.closeOutContent)}>
                    <Close />
                  </DialogClose>
                </header>
              </DialogPrimitive.Title>
            )}
            <div className={s.content}>{children}</div>
          </Card>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export const DialogClose = DialogPrimitive.Close
