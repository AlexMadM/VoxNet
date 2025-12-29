import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ReactNode, Suspense } from 'react'
import { QueryProvider } from '@/app/providers/query-provider/query-provider'
import '@/app/ui/styles/index.css'
import { AuthProvider } from '@/shared/lib'

const interFont = localFont({
  src: [
    { path: '../../../../public/fonts/Inter-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../../../public/fonts/Inter-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../../../public/fonts/Inter-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../../../public/fonts/Inter-Bold.woff2', weight: '700', style: 'normal' }
  ],
  display: 'swap', // улучшает UX и performance
  preload: true //
})

export const metadata: Metadata = {
  title: 'Inctagram',
  description: 'Учебный проект'
}

export const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="en" className={interFont.className}>
      <body>
        <Suspense fallback={null}>
          <QueryProvider>
            <AuthProvider>
              <>{children}</>
            </AuthProvider>
          </QueryProvider>
        </Suspense>
      </body>
    </html>
  )
}
