'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionApi } from '@/entities/subscription/api/subscription'
import { CreateSubscriptionPayload } from '@/entities/subscription/api/types'
import { subscriptionKeys } from '@/entities/subscription/model/keys'

export const useCreateSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateSubscriptionPayload) => subscriptionApi.createSubscription(payload),
    onSuccess: async () => {
      // Invalidate subscription queries to refetch data
      await queryClient.invalidateQueries({
        queryKey: subscriptionKeys.all(),
        refetchType: 'active'
      })
    }
  })
}
