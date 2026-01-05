'use client'

import { useQuery } from '@tanstack/react-query'
import { subscriptionApi } from '../api/subscription'
import { subscriptionKeys } from './keys'

//Стоимость и план всех подписок
export const useSubscriptionCost = () => {
  return useQuery({
    queryKey: subscriptionKeys.cost(),
    queryFn: subscriptionApi.getSubscriptionCost,
    staleTime: Infinity
  })
}
