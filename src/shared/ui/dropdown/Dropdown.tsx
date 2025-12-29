'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import s from './Dropdown.module.css'
import { clsx } from 'clsx'

// --- ОПРЕДЕЛЕНИЕ ТИПОВ ДЛЯ УНИВЕРСАЛЬНОГО КОМПОНЕНТА ---
type Props = {
  className?: string
  trigger: ReactNode // Элемент-триггер (обязательный)
  children: ReactNode // ✨ Содержимое меню (обязательный)

  // Добавляем пропсы позиционирования, чтобы их можно было передать
  side?: ComponentPropsWithoutRef<typeof DropdownMenu.Content>['side']
  sideOffset?: ComponentPropsWithoutRef<typeof DropdownMenu.Content>['sideOffset']
  align?: ComponentPropsWithoutRef<typeof DropdownMenu.Content>['align']
  alignOffset?: ComponentPropsWithoutRef<typeof DropdownMenu.Content>['alignOffset']
} & ComponentPropsWithoutRef<typeof DropdownMenu.Root>

// --- КОМПОНЕНТ Dropdown ---
export const Dropdown = (props: Props) => {
  const {
    className,
    trigger,
    children,
    side = 'bottom',
    align = 'end',
    sideOffset = 8,
    alignOffset,
    ...restRootProps
  } = props

  return (
    <DropdownMenu.Root modal={false} {...restRootProps}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={clsx(className, s.DropdownMenuContent)}
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          avoidCollisions={false}
          forceMount // Хорошая практика для универсальных компонентов
        >
          {children} {/* ✨ Рендерим ПЕРЕДАМ контент (ваши Item-ы с иконками) */}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default Dropdown
