import { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from 'react'
import { clsx } from 'clsx'
import s from './card.module.css'

type CardProps<T extends ElementType> = {
  as?: T
}

type Props<T extends ElementType> = PropsWithChildren<CardProps<T>> & ComponentPropsWithoutRef<T>

export const Card = <T extends ElementType = 'div'>({ as, children, className, ...restProps }: Props<T>) => {
  const Component = as || 'div'

  return (
    <Component className={clsx(s.card, className)} {...restProps}>
      {children}
    </Component>
  )
}
