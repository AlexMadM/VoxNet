import { ComponentProps, useId } from 'react'
import * as RadixCheckbox from '@radix-ui/react-checkbox'
import s from './checkbox.module.css'
import { clsx } from 'clsx'
import { Checkmark, Typography } from '@/shared/ui'

export type CheckboxProps = ComponentProps<typeof RadixCheckbox.Root> & {
  labelClassName?: string
  label?: string
}

export const Checkbox = ({
  className,
  labelClassName,
  label,
  checked,
  ref,
  onCheckedChange,
  disabled = false,
  ...rest
}: CheckboxProps) => {
  const generatedId = useId()
  const id = rest.id || generatedId

  return (
    <div className={clsx(s.container, className)}>
      <div className={clsx(s.buttonWrapper, { [s.disabled]: disabled })}>
        <RadixCheckbox.Root
          id={id}
          disabled={disabled}
          className={clsx(s.base)}
          checked={checked}
          onCheckedChange={onCheckedChange}
          ref={ref}
          {...rest}
        >
          <RadixCheckbox.Indicator className={s.indicator}>
            <Checkmark />
          </RadixCheckbox.Indicator>
        </RadixCheckbox.Root>
      </div>
      {label && (
        <Typography variant="regular_14" color={'light'} asChild>
          <label htmlFor={id} className={clsx(s.checkboxLabel, { [s.labelDisabled]: disabled }, labelClassName)}>
            {label}
          </label>
        </Typography>
      )}
    </div>
  )
}
