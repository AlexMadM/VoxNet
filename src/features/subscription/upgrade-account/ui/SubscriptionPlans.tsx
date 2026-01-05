import { Radio, RadioGroup, Typography } from '@/shared/ui'
import s from './UpgradeAccount.module.css'
import { SubscriptionType } from '@/entities/subscription/api/types'

type Plan = {
  amount: number
  typeDescription: SubscriptionType
}

type Props = {
  plans: Plan[]
  value: string
  onChange: (id: string) => void
  hasCurrentSubscription: boolean
  getSubscriptionLabel: (item: Plan) => string
}

export const SubscriptionPlans = ({ plans, value, onChange, hasCurrentSubscription, getSubscriptionLabel }: Props) => (
  <div className={s.section}>
    <Typography variant="h3" className={s.sectionTitle}>
      {hasCurrentSubscription ? 'Change your subscription:' : 'Your subscription costs:'}
    </Typography>

    <RadioGroup value={value} onValueChange={onChange} className={s.radioGroup}>
      {plans.map((item) => {
        const key = `${item.amount}-${item.typeDescription}`
        return <Radio key={key} value={key} label={`$${item.amount} per ${getSubscriptionLabel(item)}`} />
      })}
    </RadioGroup>
  </div>
)
