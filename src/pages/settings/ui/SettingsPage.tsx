import { SETTINGS_PART } from '@/shared/lib/routes'
import { EditPersonalDataForm } from '@/features/edit-personal-data'
import { UpgradeAccount } from '@/features/subscription/upgrade-account/ui/UpgradeAccount'

type Props = {
  searchParams: Promise<{
    part?: string
  }>
}
export const SettingsPage = async ({ searchParams }: Props) => {
  const { part } = await searchParams
  const currentPart = part ?? 'info'
  switch (currentPart) {
    case SETTINGS_PART.DEVICES:
      return <div>Устройства</div>

    case SETTINGS_PART.SUBSCRIPTIONS:
      return (
        <div>
          <UpgradeAccount />
        </div>
      )

    case SETTINGS_PART.PAYMENTS:
      return <div>Платежи</div>

    default:
      return (
        <div>
          <EditPersonalDataForm />
        </div>
      )
  }
}
//baseUrl: `${window.location.origin}/profile/settings?part=${SETTINGS_PART.SUBSCRIPTIONS}`
