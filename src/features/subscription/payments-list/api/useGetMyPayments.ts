'use client'

import { useQuery } from '@tanstack/react-query'
import { subscriptionApi } from '@/entities/subscription/api/subscription'
import { subscriptionKeys } from '@/entities/subscription/model/keys'
import { GetMyPaymentsResponse } from '@/entities/subscription/api/types'

export const useGetMyPayments = () => {
  return useQuery<GetMyPaymentsResponse>({
    queryKey: subscriptionKeys.payments(),
    queryFn: () => subscriptionApi.getMyPayments()
  })
}
