import s from './typography.module.css'
import { clsx } from 'clsx'
import { Slot } from '@radix-ui/react-slot'
import { TypographyProps } from '@/shared/ui/typography/typography.types'

export const Typography = ({
  className,
  variant = 'small',
  color,
  textAlign,
  children,
  asChild,
  ...restProps
}: TypographyProps) => {
  const Component = asChild ? Slot : 'p'
  return (
    <Component
      className={clsx(
        s[`variant-${variant}`],
        color && s[`color-${color}`],
        textAlign && s[`align-${textAlign}`],
        className
      )}
      {...restProps}
    >
      {children}
    </Component>
  )
}
