import { ComponentProps, useId } from 'react'
import * as RadixRadioGroup from '@radix-ui/react-radio-group'
import s from './radio.module.css'
import { clsx } from 'clsx'
import { Typography } from '@/shared/ui'

export type RadioProps = {
  label?: string
  labelClassName?: string
  value: string
} & Omit<ComponentProps<typeof RadixRadioGroup.Item>, 'value'>

export const Radio = ({ className, label, labelClassName, value, ...rest }: RadioProps) => {
  const id = useId()

  return (
    <div className={clsx(s.container, className)}>
      <RadixRadioGroup.Item
        id={id}
        value={value}
        className={clsx(s.radioItem)}
        {...rest}
      >
        <RadixRadioGroup.Indicator className={s.radioIndicator} />
      </RadixRadioGroup.Item>
      {label && (
        <Typography variant="regular_14" color={'light'} asChild>
          <label htmlFor={id} className={clsx(s.radioLabel, labelClassName)}>
            {label}
          </label>
        </Typography>
      )}
    </div>
  )
}

export const RadioGroup = RadixRadioGroup.Root

