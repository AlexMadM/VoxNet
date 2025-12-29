'use client'

import { useRouter } from 'next/navigation'
import { ComponentType, ReactNode, useEffect } from 'react'
import { useAuth } from '@/shared/lib'
import { Spinner } from '@/shared/ui'
import { ROUTES } from '@/shared/lib/routes'

type PropsWithChildren<T> = T & { children?: ReactNode }

export function WithAuthGuard<T extends object>(Component: ComponentType<T>) {
  return function Guarded(props: PropsWithChildren<T>) {
    const { user, isLoading, isError } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && (!user || isError)) {
        router.replace(ROUTES.HOME)
      }
    }, [user, isLoading, isError, router])

    if (isLoading) return <Spinner />
    if (!user || isError) return null

    return <Component {...(props as T)} />
  }
}
