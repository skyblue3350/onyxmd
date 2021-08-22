import SocketIOClient from 'socket.io-client'
import { useEffect } from 'react'

export default function Page() {
  useEffect((): any => {
    const socket = SocketIOClient.connect()
    socket.on("connect", () => {
      console.log('connect')
    })
    socket.on('disconnect', () => {
      console.log('disconnect')
    })    
  })

  return <div>socket test page</div>
}
