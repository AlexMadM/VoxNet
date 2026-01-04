'use client'

import { useQuery } from '@tanstack/react-query'
import { subscriptionApi } from '../api/subscription'
import { subscriptionKeys } from './keys'

//Данные текущей подписки
export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: subscriptionKeys.current(),
    queryFn: subscriptionApi.getCurrentSubscription,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false
  })
}
