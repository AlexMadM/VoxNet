/** Тип подписки */
export type SubscriptionType = 'MONTHLY' | 'DAY' | 'WEEKLY'

/** Платёжная система */
export type PaymentType = 'STRIPE' | 'PAYPAL'

/** ===== CREATE SUBSCRIPTION ===== */
export type CreateSubscriptionPayload = {
  typeSubscription: SubscriptionType
  paymentType: PaymentType
  amount: number
  baseUrl: string
}

export type CreateSubscriptionResponse = {
  url: string
}

/** ===== COST OF SUBSCRIPTIONS ===== */
export type SubscriptionCostItem = {
  amount: number
  typeDescription: SubscriptionType
}

export type GetSubscriptionCostResponse = {
  data: SubscriptionCostItem[]
}

/** ===== CURRENT SUBSCRIPTION ===== */
export type CurrentSubscriptionItem = {
  userId: number
  subscriptionId: string
  dateOfPayment: string // ISO
  endDateOfSubscription: string // ISO
  autoRenewal: boolean
}

export type GetCurrentSubscriptionResponse = {
  data: CurrentSubscriptionItem[]
  hasAutoRenewal: boolean
}

/** ===== MY PAYMENTS (HISTORY) ===== */
export type SubscriptionPaymentItem = {
  userId: number
  subscriptionId: string
  dateOfPayment: string
  endDateOfSubscription: string
  price: number
  subscriptionType: SubscriptionType
  paymentType: PaymentType
}

export type GetMyPaymentsResponse = SubscriptionPaymentItem[]
