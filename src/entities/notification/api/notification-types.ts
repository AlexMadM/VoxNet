import type { ISOStringFormat } from 'date-fns'

export type Notification = {
  id: number
  message: string
  isRead: boolean
  createdAt: ISOStringFormat
  notifyAt?: ISOStringFormat
}

export type NotificationsResponse = {
  items: Notification[]
  totalCount: number
  notReadCount: number
}

export const SOCKET_EVENTS = {
  NOTIFICATIONS: 'notifications'
} as const
