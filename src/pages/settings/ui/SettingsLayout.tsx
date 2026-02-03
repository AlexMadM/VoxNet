import { ReactNode } from 'react'
import { SettingsTabs } from '@/widgets'

export async function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      <SettingsTabs />
      <div>{children}</div>
    </section>
  )
}
