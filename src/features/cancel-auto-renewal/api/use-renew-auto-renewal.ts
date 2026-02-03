import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionApi } from './subscription'

export const useRenewAutoRenewal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: subscriptionApi.renewAutoRenewal, // ← нужно добавить в subscriptionApi!
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['current-subscription']
      })
    },
    onError: (error) => {
      console.error('Ошибка включения автообновления:', error)
    }
  })
}
