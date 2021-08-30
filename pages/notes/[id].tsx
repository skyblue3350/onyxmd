import React, { useEffect, useRef, useState } from 'react'
import SocketIOClient from 'socket.io-client'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const AceEdit = dynamic(()=>import('../../components/AceEdit'), {ssr:false})

import { applyDelta } from '../../lib/applyDelta'

const Page = () => {
  const router = useRouter()
  const [markdown, setMarkdown] = useState('')
  const socketRef = useRef(null)

  useEffect(() => {
    if (router.isReady) {
      socketRef.current = SocketIOClient.connect()
      
      const socket = socketRef.current
      socket.on('doc', (markdown) => {
        setMarkdown(markdown)
      })
      socket.on('insert', (delta) => {
        setMarkdown(applyDelta(markdown, delta))
      })
      socket.on('remove', (delta) => {
        setMarkdown(applyDelta(markdown, delta))
      })
    }

    return () => {
      socketRef.current && socketRef.current.disconnect()
    }
  })

  return <AceEdit value={markdown} onChange={(value, e) => socketRef.current.emit(e.action, e)} setOptions={{useWorker: false}} />
}

export default Page
