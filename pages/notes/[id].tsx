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
  const [revision, setRevision] = useState(0)
  const socketRef = useRef(null)

  useEffect(() => {
    if (router.isReady) {
      const noteId = router.query.id
      socketRef.current = SocketIOClient()
      
      const socket = socketRef.current

      socket.emit('join', noteId)
      socket.on('doc', (r, md) => {
        setRevision(r)
        setMarkdown(md)
      })
      socket.on('insert', (r, delta) => {
        setRevision(r)
        setMarkdown((prevMarkdown) => applyDelta(prevMarkdown, delta))
      })
      socket.on('remove', (r, delta) => {
        setRevision(r)
        setMarkdown((prevMarkdown) => applyDelta(prevMarkdown, delta))
      })
    }

    return () => {
      socketRef.current && socketRef.current.disconnect()
    }
  }, [router, ])

  return (
    <>
      <Nav />
      <Grid columns={2} style={{paddingTop: 45}}>
        <Grid.Column>
        <AceEdit
          style={{width: '100%', height: '100vw'}}
          value={markdown}
          onChange={(value, e) => {
            socketRef.current.emit(e.action, revision, e)
            setMarkdown(value)
            setRevision((prevrevision) => prevrevision+1)
          }}
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
