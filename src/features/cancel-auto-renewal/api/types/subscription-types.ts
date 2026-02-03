// Тип для подписки из API
// Тип для получения ТЕКУЩЕЙ ПОДПИСКИ пользователя (эндпоинт: /subscriptions/current-payment-subscriptions)

export type CurrentSubscriptionResponse = {
  data: Array<{
    // Массив подписок (у пользователя может быть несколько)
    userId: number // ID пользователя
    subscriptionId: string // ID подписки (нужен для отмены!)
    dateOfPayment: string // → Next payment (дата следующего платежа)
    endDateOfSubscription: string // → Expire at (дата окончания)
    autoRenewal: boolean // → статус чекбокса
  }>
  hasAutoRenewal: boolean // Дополнительный флаг от бекенда
}
