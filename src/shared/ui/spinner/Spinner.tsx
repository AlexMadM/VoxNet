'use client'

import React from 'react'
import s from './spinner.module.css'

interface SpinnerProps {
  size?: number | string
  inline?: boolean
}

export const Spinner = ({ size = '1em', inline = false }: SpinnerProps) => {
  if (inline) return <span className={s.inlineLoader} style={{ width: size, height: size }} />

  return (
    <div className={s.wrapper}>
      <span className={s.loader} />
    </div>
  )
}
