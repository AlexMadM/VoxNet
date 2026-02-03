import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionApi } from './subscription'

export const useCancelAutoRenewal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: subscriptionApi.cancelAutoRenewal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['current-subscription']
      })
    },
    onError: (error) => {
      console.error('Ошибка отмены автообновления:', error)
    }
  })
}
