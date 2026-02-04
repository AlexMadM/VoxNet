'use client'

import { Button } from '@/shared/ui'
import { SvgImage } from '@/shared/ui/icons/SvgImage'
import s from './CreatePostDialog.module.css'

type Props = {
  onSelectFromComputer: () => void
}

export const SelectPostPhotoStep = ({ onSelectFromComputer }: Props) => {
  return (
    <>
      <div className={s.placeholder}>
        <SvgImage width={48} height={48} />
      </div>
      <div className={s.containerBtn}>
        <Button onClick={onSelectFromComputer}>Select from Computer</Button>
        <Button>Open Draft</Button>
      </div>
    </>
  )
}
