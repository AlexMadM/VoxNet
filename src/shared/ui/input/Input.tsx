'use client'
import React, { ComponentPropsWithRef, ReactNode, useState } from 'react'
import s from './input.module.css'
import clsx from 'clsx'
import { Close, Eye, EyeOff, Search } from '@/shared/ui'

export type InputProps = ComponentPropsWithRef<'input'> & {
  type: 'email' | 'password' | 'search' | 'text'
  label?: string | ReactNode
  className?: string
  error?: boolean | string
  onClear?: () => void
}

export const Input = ({
  type,
  label,
  className,
  ref,
  error,
  disabled,
  onClear,
  id,
  placeholder,
  autoComplete,
  value,
  onChange,
  onBlur,
  name,
  ...rest
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const inputClassName = clsx(
    error ? s.errorInput : s.defaultInput,
    type === 'search' && s.searchInput,
    type === 'password' && s.passwordInput,
    className
  )
  const labelClassName = clsx(s.label, disabled && s.labelDisabled)

  const inputType = type === 'password' && showPassword ? 'text' : type

  const handleClear = () => {
    if (onClear) {
      onClear()
    }
  }

  return (
    <div>
      {label && (
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
      )}
      <div className={s.wrapper}>
        {type === 'search' && (
          <span className={s.searchIcon}>
            <Search />
          </span>
        )}

        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          className={inputClassName}
          disabled={disabled}
          autoComplete={autoComplete}
          ref={ref}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          {...rest}
        />

        {type === 'password' && (
          <button
            type="button"
            className={s.eyesIcon}
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </button>
        )}

        {type === 'search' && value && (
          <button
            type="button"
            className={s.crossIcon}
            onClick={handleClear}
            disabled={disabled}
            aria-label="Clear input"
          >
            <Close />
          </button>
        )}
      </div>
      {error && <span className={s.errorText}>{error}</span>}
    </div>
  )
}
