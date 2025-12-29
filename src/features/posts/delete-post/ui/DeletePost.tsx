import React from 'react'
import { Button, Spinner, TrashOutline, Typography } from '@/shared/ui'
import { AlertAction, AlertCancel, AlertDescription, AlertDialog } from '@/shared/ui/alert-dilog'
import s from './DeletePost.module.css'
import { useDeletePost } from '@/features/posts/delete-post/api'

type Props = {
  id: number
}
export const DeletePost = (props: Props) => {
  const { mutate: deletePost, isPending } = useDeletePost()

  const deletePostHandler = (id: number) => {
    deletePost(id, {
      onSuccess: () => {},
      onError: () => {}
    })
  }

  return (
    <>
      <AlertDialog
        title={'Logout'}
        trigger={
          <Button variant={'textButton'} className={s.trigger}>
            <TrashOutline />
            <Typography>Delete Post</Typography>
          </Button>
        }
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
            justifyContent: 'center',
            gap: '18px'
          }}
        >
          <>
            <AlertDescription asChild style={{ textAlign: 'left', width: '100%' }}>
              <Typography variant={'regular_16'}>Do you really want to delete this post?</Typography>
            </AlertDescription>
            <div style={{ display: 'flex', justifyContent: 'end', gap: '24px' }}>
              <AlertAction asChild>
                <Button variant={'outlined'} onClick={() => deletePostHandler(props.id)}>
                  {isPending ? <Spinner inline /> : 'OK'}
                </Button>
              </AlertAction>
              <AlertCancel asChild>
                <Button style={{ minWidth: '96px' }}>Cancel</Button>
              </AlertCancel>
            </div>
          </>
        </div>
      </AlertDialog>
    </>
  )
}
