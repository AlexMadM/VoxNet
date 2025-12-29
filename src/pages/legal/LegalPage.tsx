'use client'
import { Typography } from '@/shared/ui'
import { usePathname } from 'next/navigation'
import { LEGAL_CONTENT, LegalPageType } from '@/shared/lib'
import s from './legalPage.module.css'

export const LegalPage = () => {
  const pathName = usePathname() as LegalPageType
  const content = LEGAL_CONTENT[pathName]

  return (
    <section className={s.legal}>
      <Typography variant="h1" asChild>
        <h1>{content.title}</h1>
      </Typography>

      <Typography variant="regular_14" className={s.content}>
        {content.content}
      </Typography>
    </section>
  )
}
