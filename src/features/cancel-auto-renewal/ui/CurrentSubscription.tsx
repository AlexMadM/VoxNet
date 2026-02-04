// 'use client'
// import s from './CurrentSubscription.module.css'
// import { Checkbox, Typography } from '@/shared/ui'
// import { useCurrentSubscription } from '../api/use-current-subscription'
// import { useCancelAutoRenewal } from '../api/use-cancel-auto-renewal'
// import { useRenewAutoRenewal } from '../api/use-renew-auto-renewal'
// import { useState } from 'react'
// import { format } from 'date-fns'
//
// // ДОБАВИТЬ новую версию , библиотеки:
// const formatSubscriptionDate = (isoString: string): string => {
//   if (!isoString) return ''
//   try {
//     return format(new Date(isoString), 'dd.MM.yyyy')
//   } catch {
//     return ''
//   }
// }
//
// export const UnsubscribeAutoRenewal = () => {
//   const { data: subscription } = useCurrentSubscription()
//   const { mutate: cancelAutoRenewal } = useCancelAutoRenewal()
//   const { mutate: renewAutoRenewal } = useRenewAutoRenewal()
//   const currentSub = subscription?.data?.[0]
//
//   const finalExpireDate = formatSubscriptionDate(currentSub?.endDateOfSubscription || '')
//   // const finalNextPaymentDate = formatSubscriptionDate(currentSub?.dateOfPayment || '') // finalExpireDate
//
//   // Вариант 1: Используем endDateOfSubscription и добавляем 1 день
//   const finalNextPaymentDate = currentSub?.endDateOfSubscription
//     ? (() => {
//         const date = new Date(currentSub.endDateOfSubscription)
//         date.setDate(date.getDate() + 1) // +1 день
//         return format(date, 'dd.MM.yyyy')
//       })()
//     : ''
//
//   const [isChecked, setIsChecked] = useState(subscription?.hasAutoRenewal ?? false)
//
//   const handleToggle = (checked: boolean) => {
//     if (!currentSub?.subscriptionId) return
//     setIsChecked(checked)
//
//     if (checked) {
//       renewAutoRenewal()
//     } else {
//       cancelAutoRenewal()
//     }
//   }
//
//   return (
//     <div className={s.wrapper}>
//       <Typography variant="h2" className={s.heading}>
//         Current Subscription:
//       </Typography>
//
//       <div className={s.infobox}>
//         <div className={s.column}>
//           <span className={s.label}>Expire at</span>
//           <span className={s.date}>{finalExpireDate}</span>
//         </div>
//
//         <div className={s.column}>
//           <span className={s.label}>Next payment</span>
//           <span className={s.date}>{finalNextPaymentDate}</span>
//         </div>
//       </div>
//
//       <div className={s.renewal}>
//         <Checkbox checked={subscription?.hasAutoRenewal} onCheckedChange={handleToggle} />
//         <span className={s.renewalText}>Auto-Renewal</span>
//       </div>
//     </div>
//   )
// }

'use client'
import s from './CurrentSubscription.module.css'
import { Checkbox, Typography } from '@/shared/ui'
import { useCurrentSubscription } from '../api/use-current-subscription'
import { useCancelAutoRenewal } from '../api/use-cancel-auto-renewal'
import { useRenewAutoRenewal } from '../api/use-renew-auto-renewal'
import { useState } from 'react'
import { format, parseISO, addDays } from 'date-fns'

// Используем parseISO для корректного парсинга дат из API
const formatSubscriptionDate = (isoString: string): string => {
  if (!isoString) return ''
  try {
    return format(parseISO(isoString), 'dd.MM.yyyy')
  } catch {
    return ''
  }
}

export const UnsubscribeAutoRenewal = () => {
  const { data: subscription } = useCurrentSubscription()
  const { mutate: cancelAutoRenewal } = useCancelAutoRenewal()
  const { mutate: renewAutoRenewal } = useRenewAutoRenewal()

  // Берем последнюю подписку по дате окончания
  const allSubscriptions = subscription?.data || []
  const currentSub = [...allSubscriptions].sort(
    (a, b) => parseISO(b.endDateOfSubscription).getTime() - parseISO(a.endDateOfSubscription).getTime()
  )[0]

  const finalExpireDate = formatSubscriptionDate(currentSub?.endDateOfSubscription || '')
  // Используем addDays из date-fns вместо setDate
  const finalNextPaymentDate = currentSub?.endDateOfSubscription
    ? format(addDays(parseISO(currentSub.endDateOfSubscription), 1), 'dd.MM.yyyy')
    : ''

  const [isChecked, setIsChecked] = useState(subscription?.hasAutoRenewal ?? false)

  const handleToggle = (checked: boolean) => {
    if (!currentSub?.subscriptionId) return
    setIsChecked(checked)

    if (checked) {
      renewAutoRenewal()
    } else {
      cancelAutoRenewal()
    }
  }
  if (!currentSub) return null

  return (
    <div className={s.wrapper}>
      <Typography variant="h2" className={s.heading}>
        Current Subscription:
      </Typography>

      <div className={s.infobox}>
        <div className={s.column}>
          <span className={s.label}>Expire at</span>
          <span className={s.date}>{finalExpireDate}</span>
        </div>

        <div className={s.column}>
          <span className={s.label}>Next payment</span>
          <span className={s.date}>{finalNextPaymentDate}</span>
        </div>
      </div>

      <div className={s.renewal}>
        <Checkbox checked={subscription?.hasAutoRenewal} onCheckedChange={handleToggle} />
        <span className={s.renewalText}>Auto-Renewal</span>
      </div>
    </div>
  )
}
