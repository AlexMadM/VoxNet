'use client'

import { useState } from 'react'
import { Dropdown } from './Dropdown'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import s from './Dropdown.module.css'
import { DeleteIcon, DotsIcon, EditIcon, FollowIcon, UnfollowIcon } from '@/shared/ui'
import { useAuth } from '@/shared/lib'

type DropMenuProps = {
  onEdit?: () => void
  onDelete?: () => void
  onFollow?: () => void
  onUnfollow?: () => void
  onCopyLink?: () => void
  ownerId: number
  currentUserId?: number | null
}

export const DropMenu = ({ onEdit, onDelete, onFollow, onUnfollow, ownerId, currentUserId }: DropMenuProps) => {
  const [open, setOpen] = useState(false)

  const { user } = useAuth()

  // Показываем Edit/Delete только если это пост текущего пользователя
  const canEdit = !!currentUserId && currentUserId === ownerId
  // Показываем Follow/Unfollow только если пользователь авторизован и это не его пост
  const canFollow = !!user && !!currentUserId && currentUserId !== ownerId

  const myTrigger = (
    // обертка

    <button type="button" className={s.IconButton} aria-label="Post options">
      {/*три точки*/}
      <DotsIcon className={s.dots} />
    </button>
  )

  return (
    <Dropdown trigger={myTrigger} align="end" open={open} onOpenChange={setOpen}>
      {canEdit && (
        <>
          <DropdownMenu.Item
            className={s.DropdownMenuItem}
            onSelect={(event) => {
              event.preventDefault()
              setOpen(false)
              onEdit?.()
            }}
          >
            <EditIcon className={s.icon} />
            Edit Post
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className={s.DropdownMenuItem}
            onSelect={(event) => {
              event.preventDefault()
              setOpen(false)
              onDelete?.()
            }}
          >
            <DeleteIcon className={s.icon} />
            Delete Post
          </DropdownMenu.Item>
        </>
      )}

      {canFollow && (
        <>
          {/* Пункт "Подписаться" (с иконкой плюса) */}
          <DropdownMenu.Item
            className={s.DropdownMenuItem}
            onSelect={(event) => {
              event.preventDefault()
              setOpen(false)
              onFollow?.()
            }}
          >
            <FollowIcon className={s.icon} />
            Follow
          </DropdownMenu.Item>
          {/* Пункт "Отписаться" (с иконкой минус) */}
          <DropdownMenu.Item
            className={s.DropdownMenuItem}
            onSelect={(event) => {
              event.preventDefault()
              setOpen(false)
              onUnfollow?.()
            }}
          >
            <UnfollowIcon className={s.icon} />
            Unfollow
          </DropdownMenu.Item>
        </>
      )}
    </Dropdown>
  )
}

export default DropMenu
