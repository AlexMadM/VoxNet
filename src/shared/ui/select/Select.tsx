'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import s from './Select.module.css'
import { Arrow } from '@/shared/ui/icons/Arrow'
import { ComponentPropsWithoutRef } from 'react'

type Option = { value: string; label: string }

type SelectProps = {
  placeholder?: string
  options: Option[]
  label: string
  className?: string
} & ComponentPropsWithoutRef<typeof SelectPrimitive.Root>

export const Select = ({ placeholder = 'Select', options, label, className, ...props }: SelectProps) => {
  return (
    <div className={s.wrapper}>
      <label className={s.label}>{label}</label>
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger className={`${s.trigger} ${className ?? ''}`}>
          <SelectPrimitive.Value placeholder={placeholder} />
          {/*иконка*/}
          <SelectPrimitive.Icon>
            <Arrow className={s.icon} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className={s.content}>
            <SelectPrimitive.Viewport>
              {options.map((option) => (
                <SelectPrimitive.Item key={option.value} value={option.value} className={s.item}>
                  {/*здесь тоже иконка так как внутри будит стрелочка на выбраном месте так работает силект*/}
                  <SelectPrimitive.ItemIndicator className={s.itemIndicator}>
                    <Arrow className={s.indicatorIcon} />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  )
}
