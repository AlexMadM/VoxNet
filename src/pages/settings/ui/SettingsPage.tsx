import { SETTINGS_PART } from '@/shared/lib/routes'
import { EditPersonalDataForm } from '@/features/edit-personal-data'

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
      return <div>Подписки</div>

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
