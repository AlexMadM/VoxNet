// запрос
// entities/subscription/api/subscription.ts

import { api } from '@/shared/api'
import {
  CreateSubscriptionPayload,
  CreateSubscriptionResponse,
  GetSubscriptionCostResponse,
  GetCurrentSubscriptionResponse,
  GetMyPaymentsResponse
} from './types'

export const subscriptionApi = {
  createSubscription: async (payload: CreateSubscriptionPayload): Promise<CreateSubscriptionResponse> => {
    const { data } = await api.post<CreateSubscriptionResponse>('/subscriptions', payload)
    return data
  },

  cancelAutoRenewal: async (): Promise<void> => {
    await api.post('/subscriptions/canceled-auto-renewal')
  },

  renewAutoRenewal: async (): Promise<void> => {
    await api.post('/subscriptions/renew-auto-renewal')
  },

  getSubscriptionCost: async (): Promise<GetSubscriptionCostResponse> => {
    const { data } = await api.get<GetSubscriptionCostResponse>('/subscriptions/cost-of-payment-subscriptions')
    return data
  },

  getCurrentSubscription: async (): Promise<GetCurrentSubscriptionResponse> => {
    const { data } = await api.get<GetCurrentSubscriptionResponse>('/subscriptions/current-payment-subscriptions')
    return data
  },

  getMyPayments: async (): Promise<GetMyPaymentsResponse> => {
    const { data } = await api.get<GetMyPaymentsResponse>('/subscriptions/my-payments')
    return data
  }
}
