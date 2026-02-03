'use client'

import { useEffect, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '../api/notification'
import type { Notification, NotificationsResponse } from '../api/notification-types'
import { SOCKET_EVENTS } from '../api/notification-types'
import { subscribeToEvent } from './socket/subscribeToEvent'

const QUERY_KEY = ['notifications'] as const

function mergeNewItems(
  current: NotificationsResponse | undefined,
  incoming: Notification[]
): NotificationsResponse | undefined {
  const items = current?.items ?? []
  const ids = new Set(items.map((n) => n.id))
  const newItems = incoming.filter((n) => !ids.has(n.id))
  if (newItems.length === 0) return current ?? undefined

  const nextItems = [...newItems, ...items]
  const addedUnread = newItems.filter((n) => !n.isRead).length

  return {
    items: nextItems,
    totalCount: (current?.totalCount ?? 0) + newItems.length,
    notReadCount: (current?.notReadCount ?? 0) + addedUnread
  }
}

export const useNotifications = () => {
  const queryClient = useQueryClient()
  const pendingRef = useRef<Notification[]>([])

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => notificationApi.getAll(),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1
  })

  useEffect(() => {
    const unsubscribe = subscribeToEvent<Notification | Notification[]>(SOCKET_EVENTS.NOTIFICATIONS, (payload) => {
      const incoming = Array.isArray(payload) ? payload : [payload]

      queryClient.setQueryData<NotificationsResponse>(QUERY_KEY, (current) => {
        const merged = mergeNewItems(current, incoming)
        if (!merged) return current ?? undefined
        if (!current) {
          pendingRef.current = [...pendingRef.current, ...incoming]
          return undefined
        }
        return merged
      })
    })
    return () => {
      unsubscribe()
    }
  }, [queryClient])

  useEffect(() => {
    if (!data || pendingRef.current.length === 0) return
    const pending = pendingRef.current
    pendingRef.current = []
    queryClient.setQueryData<NotificationsResponse>(
      QUERY_KEY,
      (current) => mergeNewItems(current ?? data, pending) ?? current
    )
  }, [data, queryClient])

  // markAsRead с оптимистичным обновлением (как RTK mutation)
  const markAsReadMutation = useMutation<void, Error, number[], { previous?: NotificationsResponse }>({
    mutationFn: (ids: number[]) => notificationApi.markAsRead(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previous = queryClient.getQueryData<NotificationsResponse>(QUERY_KEY)

      queryClient.setQueryData<NotificationsResponse>(QUERY_KEY, (current) => {
        if (!current) return current
        const idsSet = new Set(ids)
        const items = current.items.map((n) => (idsSet.has(n.id) ? { ...n, isRead: true } : n))
        const newlyRead = current.items.filter((n) => idsSet.has(n.id) && !n.isRead).length
        return {
          ...current,
          items,
          notReadCount: Math.max(0, current.notReadCount - newlyRead)
        }
      })
      return { previous }
    },
    onError: (_err, _ids, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEY, context.previous)
      }
    }
  })

  const notifications = [...(data?.items ?? [])].sort((a, b) => {
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1
    const timeA = Date.parse((b.notifyAt ?? b.createdAt) as string)
    const timeB = Date.parse((a.notifyAt ?? a.createdAt) as string)
    return timeA - timeB
  })

  const unreadCount = data?.notReadCount ?? notifications.filter((n) => !n.isRead).length

  return {
    isLoading,
    notifications,
    unreadCount,
    markAsRead: (id: number, isRead: boolean) => {
      if (!isRead) markAsReadMutation.mutate([id])
    }
  }
}
