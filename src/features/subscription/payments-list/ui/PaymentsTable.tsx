'use client'

import { useState, useMemo } from 'react'
import { useMyPayments } from '@/entities/subscription/model/useMyPayments'
import { SubscriptionType, PaymentType } from '@/entities/subscription/api/types'
import { Typography, Spinner } from '@/shared/ui'
import s from './PaymentsTable.module.css'
import { Pagination } from '@/widgets/pagination/ui/Pagination'

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
}

const formatSubscriptionType = (type: SubscriptionType): string => {
  switch (type) {
    case 'DAY':
      return '1 day'
    case 'WEEKLY':
      return '7 days'
    case 'MONTHLY':
      return '1 month'
    default:
      return type
  }
}

const formatPaymentType = (type: PaymentType): string => {
  switch (type) {
    case 'STRIPE':
      return 'Stripe'
    case 'PAYPAL':
      return 'PayPal'
    default:
      return type
  }
}

const formatPrice = (price: number): string => {
  return `$${price}`
}

export const PaymentsTable = () => {
  const { data: payments, isLoading, isError } = useMyPayments()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const paginatedPayments = useMemo(() => {
    if (!payments) return []
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return payments.slice(startIndex, endIndex)
  }, [payments, currentPage, itemsPerPage])

  const totalPages = useMemo(() => {
    if (!payments) return 1
    return Math.max(1, Math.ceil(payments.length / itemsPerPage))
  }, [payments, itemsPerPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value)
    setCurrentPage(1) // Сбрасываем на первую страницу
  }

  return (
    <div className={s.container}>
      <table className={s.table}>
        <thead>
          <tr>
            <th>
              <Typography variant="regular_14" color="light">
                Date of Payment
              </Typography>
            </th>
            <th>
              <Typography variant="regular_14" color="light">
                End date of subscription
              </Typography>
            </th>
            <th>
              <Typography variant="regular_14" color="light">
                Price
              </Typography>
            </th>
            <th>
              <Typography variant="regular_14" color="light">
                Subscription Type
              </Typography>
            </th>
            <th>
              <Typography variant="regular_14" color="light">
                Payment Type
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={5} className={s.loading}>
                <Spinner />
              </td>
            </tr>
          )}
          {isError && (
            <tr>
              <td colSpan={5} className={s.error}>
                <Typography variant="regular_14" color="error">
                  Ошибка при загрузке платежей
                </Typography>
              </td>
            </tr>
          )}
          {!isLoading && !isError && (!payments || payments.length === 0) && (
            <tr>
              <td colSpan={5} className={s.empty}>
                <Typography variant="regular_14" color="light">
                  Нет данных о платежах
                </Typography>
              </td>
            </tr>
          )}
          {!isLoading && !isError && payments && payments.length > 0 && (
            <>
              {paginatedPayments.map((payment) => (
                <tr key={payment.subscriptionId}>
                  <td>
                    <Typography variant="regular_14" color="light">
                      {formatDate(payment.dateOfPayment)}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="regular_14" color="light">
                      {formatDate(payment.endDateOfSubscription)}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="regular_14" color="light">
                      {formatPrice(payment.price)}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="regular_14" color="light">
                      {formatSubscriptionType(payment.subscriptionType)}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="regular_14" color="light">
                      {formatPaymentType(payment.paymentType)}
                    </Typography>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  )
}
