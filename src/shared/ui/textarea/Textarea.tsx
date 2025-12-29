'use client'

import { ComponentPropsWithRef, ReactNode } from 'react'
import s from './textarea.module.css'

export type TextareaProps = ComponentPropsWithRef<'textarea'> & {
  label?: string | ReactNode
  error?: boolean | string
}

export const Textarea = ({ label, error, className, ...textareaProps }: TextareaProps) => {
  const textareaClassName = `${s.textarea} ${className || ''}`
  const cardClassName = `${s.textareaCard} ${error ? s.errorCard : ''}`

  return (
    <div className={s.container}>
      {label && (
        <label htmlFor={textareaProps.id} className={s.label}>
          {label}
        </label>
      )}
      <div className={cardClassName}>
        <textarea {...textareaProps} className={textareaClassName} />
      </div>
      {error && typeof error === 'string' && <span className={s.errorText}>{error}</span>}
    </div>
  )
}
