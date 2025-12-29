//кнопка  или пункт из dropwDoun

'use client'

import { useState } from 'react'
import { Button, EditIcon, Typography } from '@/shared/ui'
import s from './EditPostForm.module.css'
import { EditPostForm, EditPostFormProps } from './EditPostForm'

// Используем те же пропсы что и у EditPostForm, но без isOpen и onClose
type EditPostButtonProps = Omit<EditPostFormProps, 'isOpen' | 'onClose'>

export const EditPostButton = (props: EditPostButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant={'textButton'} className={s.editbutton} onClick={() => setIsOpen(true)}>
        {/*иконка*/}
        <EditIcon />
        <Typography>Edit Post</Typography>
      </Button>
      {/*form*/}
      <EditPostForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        {...props} // ← передаем все пропсы разом
      />
    </>
  )
}
