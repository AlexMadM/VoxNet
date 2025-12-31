import { ReactNode, Suspense } from 'react'
import { SettingsTabs } from '@/widgets'

export async function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      <Suspense fallback={null}>
        <SettingsTabs />
      </Suspense>
      <div>{children}</div>
    </section>
  )
}
