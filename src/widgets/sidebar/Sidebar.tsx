'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type MouseEvent } from 'react'
import { clsx } from 'clsx'

import { Bookmark, Home, Message, Profile, Search } from '@/shared/ui'

import s from './sidebar.module.css'
import { ROUTES } from '@/shared/lib/routes'
import { LogoutButton } from '@/features/auth/logout'
import { useAuth } from '@/shared/lib'
import { CreatePostDialog } from '@/features/posts/create-post/ui/CreatePostDialog'
import { PlusSquare } from '@/shared/ui/icons/PlusSquare'
import { TrendingIcon } from '@/shared/ui/icons/TrendingIcon'

type NavItem = {
  name: string
  href?: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export const Sidebar = () => {
  const pathname = usePathname()
  const { user } = useAuth()

  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const handleCreateClick = (event: MouseEvent) => {
    event.preventDefault()
    setIsCreateOpen(true)
  }

  const navItems: NavItem[] = [
    { name: 'Feed', href: ROUTES.HOME, icon: Home },
    { name: 'Create', icon: PlusSquare, onClick: handleCreateClick },
    { name: 'My Profile', href: user ? ROUTES.APP.USER_PROFILE(user.userId) : '#', icon: Profile },
    { name: 'Messenger', href: ROUTES.APP.MESSENGER, icon: Message },
    { name: 'Search', href: ROUTES.APP.SEARCH, icon: Search },
    { name: 'Statistics', href: ROUTES.APP.STATISTICS, icon: TrendingIcon },
    { name: 'Favorites', href: ROUTES.APP.FAVORITES, icon: Bookmark }
  ]

  const isActive = (href?: string) => {
    if (!href || href === '/') {
      return false
    }
    return pathname?.startsWith(href)
  }

  return (
    <>
      <nav className={s.container}>
        <div className={s.content}>
          {navItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            const isSearch = item.name === 'Search'

            return (
              <Link
                key={item.name}
                href={item.href || '#'}
                {...(item.onClick && { onClick: item.onClick })}
                className={clsx(s.link, active && s.active, isSearch && s.searchItem)}
              >
                <Icon className={s.icon} />
                <span className={s.text}>{item.name}</span>
              </Link>
            )
          })}
          <LogoutButton className={s.logout} />
          {isCreateOpen && <CreatePostDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />}
        </div>
      </nav>
    </>
  )
}
