'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/shared/ui/textarea'
import { Card } from '@/shared/ui'
import s from './EditPostForm.module.css'
import { Button } from '@/shared/ui/button/Button'
import { useEditPost } from '../api/use-edit-post'
import { Dialog, DialogClose } from '@/shared/ui/temp/dialog'
import { editPostFormSchema, EditPostFormValues } from '@/shared/ui/textarea/textarea-validation'
import { CharacterCounter } from '@/shared/ui/character-counter'
import { Typography } from '@/shared/ui/typography/Typography'
import Avatar from '@/shared/ui/Avatar/Avatar'

export type EditPostFormProps = {
  isOpen: boolean
  onClose: () => void
  postId: number
  userName: string
  userAvatar: string
  postImage: string
  initialDescription?: string
}

export const EditPostForm = ({
  isOpen,
  onClose,
  postId,
  userName,
  userAvatar,
  postImage,
  initialDescription
}: EditPostFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues
  } = useForm<EditPostFormValues>({
    resolver: zodResolver(editPostFormSchema),
    mode: 'onChange',
    defaultValues: {
      description: initialDescription || ''
    }
  })

  const { mutateAsync: editPost, isPending: isSaving } = useEditPost()
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      const currentDescription = getValues('description')
      if (currentDescription !== initialDescription && !isSaving) {
        setShowCloseConfirm(true)
        return false
      } else {
        onClose()
      }
    }
    return true
  }

  const onSubmit = (data: EditPostFormValues) => {
    if (data.description === initialDescription) {
      onClose()
      return
    }

    editPost(
      { postId, description: data.description },
      {
        onSuccess: () => {
          onClose()
        },
        onError: (error) => {
          console.error('Failed to save post:', error)
        }
      }
    )
  }

  return (
    <>
      <Dialog title="Edit Post" open={isOpen} onOpenChange={handleDialogClose} className={s.dialog}>
        {/* обертка контента*/}
        <Card className={s.wrapper}>
          <div className={s.imgBox}>
            <Image src={postImage} alt="Post" width={490} height={503} className={s.img} priority />
          </div>

          <div className={s.form}>
            {/*<PostCard userName={userName} avatar={userAvatar} className={s.postContainer} />*/}

            {/* аватарка  колеги */}
            <div className={s.description}>
              <div className={s.avatar}>
                <Avatar src={userAvatar} alt={userName} size="small" />
                <Typography variant="h3" className={s.descriptionUser}>
                  {userName}
                </Typography>
              </div>
            </div>

            {/*текстерия*/}
            <Textarea
              label="Add publication descriptions"
              {...register('description')}
              error={errors.description?.message}
              maxLength={500}
            />
            {/*Счетчик*/}
            <CharacterCounter current={watch('description')?.length || 0} max={500} />
            {/*кнопка*/}
            <Button
              variant="primary"
              className={s.button}
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid || isSaving}
            >
              {isSaving ? 'Saving' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </Dialog>

      {showCloseConfirm && (
        // маленкое мадальное окно
        <Dialog
          title="Close Post"
          open={showCloseConfirm}
          onOpenChange={(open) => !open && setShowCloseConfirm(false)}
          className={s.confirmDialog}
        >
          <div className={s.confirmContent}>
            <p className={s.confirmText}>
              Do you really want to finish editing? If you close the changes you have made will not be saved
            </p>
            <div className={s.confirmButtons}>
              <DialogClose asChild>
                <Button variant="outlined" onClick={onClose} className={s.buttoninfo}>
                  Yes
                </Button>
              </DialogClose>
              <Button className={s.buttoninfo} onClick={() => setShowCloseConfirm(false)}>
                No
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  )
}
