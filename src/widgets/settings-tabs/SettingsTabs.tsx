'use client'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { SETTINGS_PART, SettingsPart } from '@/shared/lib/routes'
import { useRouter, useSearchParams } from 'next/navigation'
import s from './SettingsTabs.module.css'

export const SettingsTabs = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTab = searchParams?.get('part') ?? 'info'
  const onTabChange = (value: string) => {
    router.push(`/settings?part=${value as SettingsPart}`)
  }
  return (
    <Tabs defaultValue={'info'} value={currentTab} onValueChange={onTabChange}>
      <TabsList style={{ display: 'flex', justifyContent: 'space-between' }} className={s.tabList}>
        <TabsTrigger className={s.tab} value={SETTINGS_PART.INFO}>
          General information
        </TabsTrigger>
        <TabsTrigger className={s.tab} value={SETTINGS_PART.DEVICES}>
          Devices
        </TabsTrigger>
        <TabsTrigger className={s.tab} value={SETTINGS_PART.SUBSCRIPTIONS}>
          Account Management
        </TabsTrigger>
        <TabsTrigger className={s.tab} value={SETTINGS_PART.PAYMENTS}>
          My payments
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
