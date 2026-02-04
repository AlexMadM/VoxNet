// запросы
import { api } from '@/shared/api'
import { CurrentSubscriptionResponse } from '@/features/cancel-auto-renewal/api/types/subscription-types'

export const subscriptionApi = {
  // GET
  getCurrentSubscription: async (): Promise<CurrentSubscriptionResponse> => {
    const response = await api.get<CurrentSubscriptionResponse>('/subscriptions/current-payment-subscriptions')
    return response.data
  },

  // POST запрос — для отмены продления подписки
  cancelAutoRenewal: async (): Promise<void> => {
    await api.post('/subscriptions/canceled-auto-renewal')
  },

  renewAutoRenewal: async (): Promise<void> => {
    await api.post('/subscriptions/renew-auto-renewal')
  }
}
