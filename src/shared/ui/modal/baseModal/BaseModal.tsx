import React from 'react'
import { Dialog, DialogContent } from '@/shared/ui/modal'

type Props = {
  children?: React.ReactNode
  title?: string
  onOpenChange?: (open: boolean) => void
  className?: string
  open?: boolean
  showCloseButton?: boolean
}

export const BaseModal = ({ title, className, children, showCloseButton = true, ...rest }: Props) => {
  return (
    <div>
      <Dialog {...rest}>
        <DialogContent showCloseButton={showCloseButton} title={title} className={className}>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  )
}
