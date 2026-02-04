import { Card, Checkbox, Typography } from '@/shared/ui'
import s from './UpgradeAccount.module.css'

type Props = {
  endDate: string
  autoRenewal: boolean
  formatDate: (d: string) => string
}

export const CurrentSubscriptionCard = ({ endDate, autoRenewal, formatDate }: Props) => (
  <div className={s.section}>
    <Typography variant="h3" className={s.sectionTitle}>
      Current Subscription:
    </Typography>

    <Card className={s.subscriptionCard}>
      <div className={s.subscriptionInfo}>
        <div>
          <Typography variant="regular_14" style={{ color: '#8D9094' }}>
            Expire at
          </Typography>
          <Typography variant="regular_16">{formatDate(endDate)}</Typography>
        </div>

        <div>
          <Typography variant="regular_14" style={{ color: '#8D9094' }}>
            Next payment
          </Typography>
          <Typography variant="regular_16">{autoRenewal ? formatDate(endDate) : '-'}</Typography>
        </div>
      </div>
    </Card>
  </div>
)
