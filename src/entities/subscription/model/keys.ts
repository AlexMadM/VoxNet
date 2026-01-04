export const subscriptionKeys = {
  all: () => ['subscription'] as const,

  current: () => [...subscriptionKeys.all(), 'current'] as const,

  cost: () => [...subscriptionKeys.all(), 'cost'] as const,

  payments: () => [...subscriptionKeys.all(), 'payments'] as const
}
