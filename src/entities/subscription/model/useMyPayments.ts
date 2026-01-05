'use client'

import { useQuery } from '@tanstack/react-query'
import { subscriptionApi } from '../api/subscription'
import { subscriptionKeys } from './keys'

//Данные всех подписок
export const useMyPayments = () => {
  return useQuery({
    queryKey: subscriptionKeys.payments(),
    queryFn: subscriptionApi.getMyPayments,
    staleTime: 30 * 1000
  })
}
