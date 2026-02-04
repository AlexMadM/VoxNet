import { getSocket } from './getSocket'

export const subscribeToEvent = <T>(event: string, callback: (data: T) => void): (() => void) => {
  const socket = getSocket()

  socket.on(event, callback)

  return () => {
    socket.off(event, callback)
  }
}
