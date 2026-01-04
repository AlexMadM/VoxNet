'use client'

import { useState, useMemo } from 'react'
import { PaymentButton, Typography } from '@/shared/ui'
import { useSubscriptionCost } from '@/entities/subscription/model/useSubscriptionCost'
import { useCurrentSubscription } from '@/entities/subscription/model/useCurrentSubscription'
import { useCreateSubscription } from '../api/useCreateSubscription'
import { PaymentType, SubscriptionType } from '@/entities/subscription/api/types'
import { SETTINGS_PART } from '@/shared/lib/routes'
import s from './UpgradeAccount.module.css'

import { AccountTypeSelector } from './AccountTypeSelector'
import { SubscriptionPlans } from './SubscriptionPlans'
import { CurrentSubscriptionCard } from './CurrentSubscriptionCard'
import { PaymentModals } from './PaymentModals'

export type AccountType = 'PERSONAL' | 'BUSINESS'

export const UpgradeAccount = () => {
  const [accountType, setAccountType] = useState<AccountType>('PERSONAL')
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null)
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType | null>(null)
  const [agree, setAgree] = useState(false)
  const [createPaymentOpen, setCreatePaymentOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)

  const { data: subscriptionCosts, isLoading: isLoadingCosts } = useSubscriptionCost()
  const { data: currentSubscription, isLoading: isLoadingCurrent } = useCurrentSubscription()
  const { mutate: createSubscription, isPending: isCreating } = useCreateSubscription()

  const plans = subscriptionCosts?.data ?? []

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}.${date.getFullYear()}`
  }

  const getSubscriptionLabel = (item: { typeDescription: SubscriptionType }) => {
    switch (item.typeDescription) {
      case 'DAY':
        return '1 Day'
      case 'WEEKLY':
        return '7 Days'
      default:
        return 'month'
    }
  }

  const currentSubscriptionId = useMemo(() => {
    if (selectedSubscriptionId) return selectedSubscriptionId
    if (plans.length > 0) return `${plans[0].amount}-${plans[0].typeDescription}`
    return ''
  }, [selectedSubscriptionId, plans])

  const selectedSubscription = useMemo(() => {
    return plans.find((p) => `${p.amount}-${p.typeDescription}` === currentSubscriptionId)
  }, [plans, currentSubscriptionId])

  const hasCurrentSubscription = !!currentSubscription?.data?.length
  const currentSub = hasCurrentSubscription ? currentSubscription.data[0] : null

  const handlePaymentClick = (paymentType: PaymentType) => {
    if (!selectedSubscription) return
    setSelectedPaymentType(paymentType)
    setCreatePaymentOpen(true)
  }

  const handleConfirmPayment = () => {
    if (!selectedSubscription || !selectedPaymentType || !agree) return

    createSubscription(
      {
        typeSubscription: selectedSubscription.typeDescription,
        paymentType: selectedPaymentType,
        amount: selectedSubscription.amount,
        baseUrl: `${window.location.origin}/settings?part=${SETTINGS_PART.SUBSCRIPTIONS}`
      },
      {
        onSuccess: (res) => {
          setCreatePaymentOpen(false)
          setAgree(false)

          if (res?.url) {
            window.location.href = res.url
          } else {
            setSuccessOpen(true)
          }
        },
        onError: () => {
          setCreatePaymentOpen(false)
          setErrorOpen(true)
        }
      }
    )
  }

  if (isLoadingCosts || isLoadingCurrent) {
    return <div>Loading...</div>
  }

  return (
    <div className={s.container}>
      {/* Account type */}
      <AccountTypeSelector value={accountType} onChange={setAccountType} />

      {/* Current subscription */}
      {currentSub && (
        <CurrentSubscriptionCard
          endDate={currentSub.endDateOfSubscription}
          autoRenewal={currentSub.autoRenewal}
          formatDate={formatDate}
        />
      )}

      {/* Plans */}
      {accountType === 'BUSINESS' && plans.length > 0 && (
        <SubscriptionPlans
          plans={plans}
          value={currentSubscriptionId}
          onChange={setSelectedSubscriptionId}
          hasCurrentSubscription={hasCurrentSubscription}
          getSubscriptionLabel={getSubscriptionLabel}
        />
      )}

      {/* Payment buttons */}
      {accountType === 'BUSINESS' && selectedSubscription && (
        <div className={s.paymentSection}>
          <PaymentButton variant="paypal" disabled={isCreating} onClick={() => handlePaymentClick('PAYPAL')} />

          <Typography variant="regular_14" color="light" className={s.orText}>
            Or
          </Typography>

          <PaymentButton variant="stripe" disabled={isCreating} onClick={() => handlePaymentClick('STRIPE')} />
        </div>
      )}

      {/* Modals */}
      <PaymentModals
        createPaymentOpen={createPaymentOpen}
        successOpen={successOpen}
        errorOpen={errorOpen}
        agree={agree}
        isCreating={isCreating}
        onAgreeChange={setAgree}
        onConfirm={handleConfirmPayment}
        onCloseCreate={setCreatePaymentOpen}
        onCloseSuccess={setSuccessOpen}
        onCloseError={setErrorOpen}
      />
    </div>
  )
}
