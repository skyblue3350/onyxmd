import React, { useEffect, useRef, useState } from 'react'
import SocketIOClient from 'socket.io-client'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const AceEdit = dynamic(()=>import('../../components/AceEdit'), {ssr:false})

import { applyDelta } from '../../lib/applyDelta'
import Nav from '../../components/nav'
import { Grid } from 'semantic-ui-react'
import Markdown from '../../components/markdown'

const Page = () => {
  const router = useRouter()
  const [markdown, setMarkdown] = useState('')
  const socketRef = useRef(null)

  useEffect(() => {
    if (router.isReady) {
      const noteId = router.query.id
      socketRef.current = SocketIOClient.connect()
      
      const socket = socketRef.current

      socket.emit('join', noteId)
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

  return (
    <>
      <Nav />
      <Grid columns={2} style={{paddingTop: 45}}>
        <Grid.Column>
        <AceEdit
          style={{width: '100%', height: '100vw'}}
          value={markdown}
          onChange={(value, e) => socketRef.current.emit(e.action, e)}
          setOptions={{useWorker: false}} />
        </Grid.Column>
        <Grid.Column>
          <Markdown markdown={markdown}/>
        </Grid.Column>
      </Grid>
      
    </>
  )
}

export default Page
