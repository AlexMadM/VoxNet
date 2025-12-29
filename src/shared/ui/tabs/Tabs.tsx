import * as TabsPrimitive from '@radix-ui/react-tabs'
import { ComponentPropsWithoutRef, ComponentRef, Ref } from 'react'
import { Typography } from '@/shared/ui'
import s from './Tabs.module.css'
import clsx from 'clsx'

type Props = {} & ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    ref?: Ref<ComponentRef<typeof TabsPrimitive.Root>>
  }

type TabsTriggerProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
  ref?: Ref<ComponentRef<typeof TabsPrimitive.Trigger>>
}

export const Tabs = (props: Props) => {
  const { ref, ...rest } = props
  return <TabsPrimitive.Root ref={ref} {...rest} />
}

export const TabsTrigger = ({ className, ref, children, ...rest }: TabsTriggerProps) => {
  return (
    <TabsPrimitive.Trigger className={clsx(className, s.trigger)} {...rest} ref={ref}>
      <Typography asChild variant={'h3'}>
        <span>{children}</span>
      </Typography>
    </TabsPrimitive.Trigger>
  )
}

export const TabsContent = TabsPrimitive.Content
export const TabsList = TabsPrimitive.List
