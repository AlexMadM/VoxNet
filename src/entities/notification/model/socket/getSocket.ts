import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

    socket = io('https://inctagram.work', {
      query: { accessToken },
      transports: ['websocket']
    })
  }
  return socket
}
