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
          <Typography variant="regular_14" color="light">
            Expire at
          </Typography>
          <Typography variant="regular_16">{formatDate(endDate)}</Typography>
        </div>

        <div>
          <Typography variant="regular_14" color="light">
            Next payment
          </Typography>
          <Typography variant="regular_16">{autoRenewal ? formatDate(endDate) : '-'}</Typography>
        </div>
      </div>

      <div className={s.autoRenewal}>
        <Checkbox label="Auto-Renewal" checked={autoRenewal} disabled />
      </div>
    </Card>
  </div>
)
