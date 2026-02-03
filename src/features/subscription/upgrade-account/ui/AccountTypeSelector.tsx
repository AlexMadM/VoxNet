import { Radio, RadioGroup, Typography } from '@/shared/ui'
import s from './UpgradeAccount.module.css'
import { AccountType } from './UpgradeAccount'

type Props = {
  value: AccountType
  onChange: (value: AccountType) => void
  disabledPersonal?: boolean
}

export const AccountTypeSelector = ({ value, onChange, disabledPersonal = false }: Props) => (
  <div className={s.section}>
    <Typography variant="h3" className={s.sectionTitle}>
      Account type:
    </Typography>

    <RadioGroup value={value} onValueChange={(v) => onChange(v as AccountType)} className={s.radioGroup}>
      <Radio value="PERSONAL" label="Personal" disabled={disabledPersonal} />
      <Radio value="BUSINESS" label="Business" />
    </RadioGroup>
  </div>
)
