import { useQuery } from '@tanstack/react-query'
import { subscriptionApi } from '@/features/cancel-auto-renewal'

// для  get
export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: ['current-subscription'], // Ключ кеша
    queryFn: subscriptionApi.getCurrentSubscription // Функция запроса
  })
}
