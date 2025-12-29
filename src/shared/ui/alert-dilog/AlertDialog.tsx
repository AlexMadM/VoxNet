import * as AlertPrimitive from '@radix-ui/react-alert-dialog'
import s from './AlertDialog.module.css'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Card, Close, Typography } from '@/shared/ui'
import { clsx } from 'clsx'

type Props = {
  className?: string
  title?: string
  trigger?: ReactNode
} & ComponentPropsWithoutRef<typeof AlertPrimitive.Root>

export const AlertDialog = (props: Props) => {
  const { className, title, trigger, children, ...rest } = props
  return (
    <AlertPrimitive.Root {...rest}>
      {trigger && <AlertPrimitive.Trigger asChild>{trigger}</AlertPrimitive.Trigger>}
      <AlertPrimitive.Portal>
        <AlertPrimitive.Overlay className={s.overlay} />
        <AlertPrimitive.Content asChild className={clsx(className, s.container)}>
          <Card>
            {title && (
              <AlertPrimitive.Title asChild className={s.title} aria-describedby={'modal title'}>
                <header>
                  <Typography variant={'h1'} asChild>
                    <h1>{title}</h1>
                  </Typography>
                  <AlertPrimitive.Cancel className={s.cancel}>
                    <Close />
                  </AlertPrimitive.Cancel>
                </header>
              </AlertPrimitive.Title>
            )}
            <div className={s.content}>{children}</div>
          </Card>
        </AlertPrimitive.Content>
      </AlertPrimitive.Portal>
    </AlertPrimitive.Root>
  )
}

export const AlertCancel = AlertPrimitive.Cancel
export const AlertAction = AlertPrimitive.Action
export const AlertDescription = AlertPrimitive.Description
