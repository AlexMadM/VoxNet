import { ComponentProps } from 'react'

type TypographyVariant =
  | 'large'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'regular_16'
  | 'bold_16'
  | 'regular_14'
  | 'medium_14'
  | 'bold_14'
  | 'small'
  | 'bold_small'
  | 'regular_link'
  | 'small_link'
type TypographyColors = 'light' | 'dark' | 'blue' | 'lightBlue' | 'deepBlue' | 'error' | 'disabled'
type TypographyAlign = 'inherit' | 'left' | 'center' | 'right' | 'justify' | 'initial' | 'unset'

export type TypographyProps = {
  variant?: TypographyVariant
  color?: TypographyColors
  textAlign?: TypographyAlign
  asChild?: boolean
} & ComponentProps<'p'>
