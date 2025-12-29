import { ComponentPropsWithoutRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import s from './button.module.css'
import clsx from 'clsx'

type Props = {
  variant?: 'primary' | 'secondary' | 'outlined' | 'textButton'
  asChild?: boolean
} & ComponentPropsWithoutRef<'button'>

export const Button = (props: Props) => {
  const { variant = 'primary', asChild, className, ...rest } = props

  const Component = asChild ? Slot : 'button'

  return <Component className={clsx(s.button, s[variant], className)} {...rest} />
}
