import { api } from '@/shared/api'
import type { NotificationsResponse } from './notification-types'

export type GetNotificationsParams = {
  cursor?: number
  sortBy?: 'notifyAt'
  isRead?: boolean
  pageSize?: number
  sortDirection?: 'asc' | 'desc'
}

export const notificationApi = {
  getAll: async (params: GetNotificationsParams = {}): Promise<NotificationsResponse> => {
    const { cursor, sortBy = 'notifyAt', sortDirection = 'desc', isRead } = params

    const path = typeof cursor === 'number' ? `/notifications/${cursor}` : '/notifications'
    const { data } = await api.get<NotificationsResponse>(path, {
      params: {
        sortBy,
        pageSize: 100,
        sortDirection,
        ...(typeof isRead === 'boolean' ? { isRead } : {})
      }
    })
    return data
  },

  markAsRead: async (ids: number[]): Promise<void> => {
    await api.put('/notifications/mark-as-read', { ids })
  }
}
