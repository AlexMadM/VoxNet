import { ComponentPropsWithoutRef } from 'react'
import { Button } from '../button'
import { PayPal, Stripe } from '../icons'
import s from './payment-button.module.css'
import { clsx } from 'clsx'

type PaymentButtonProps = {
  variant: 'paypal' | 'stripe'
} & ComponentPropsWithoutRef<'button'>

export const PaymentButton = ({ variant, className, children, ...rest }: PaymentButtonProps) => {
  const Icon = variant === 'paypal' ? PayPal : Stripe

  return (
    <Button variant="secondary" className={clsx(s.paymentButton, s[variant], className)} {...rest}>
      <Icon aria-hidden="true" />
    </Button>
  )
}
