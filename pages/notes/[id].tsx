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
  const [noteId, setNoteId] = useState('')
  const [mode, setMode] = useState('edit')
  const socketRef = useRef(null)

  useEffect(() => {
    if (router.isReady) {
      setNoteId(router.query.id.toString())
      router.query.mode && setMode(router.query.mode.toString())
      socketRef.current = SocketIOClient()

      const socket = socketRef.current

      socket.emit('join', router.query.id)
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

  const changeMode = (mode: 'edit' | 'both' | 'view') => {
    router.push({pathname: '', query: {mode: mode, id: noteId}}, '', {shallow: true})
    setMode(mode)
  }

  return (
    <>
      <Nav mode={mode}
        onClickEdit={() => changeMode('edit')}
        onClickBoth={() => changeMode('both')}
        onClickView={() => changeMode('view')} />
      <Grid columns={mode === 'both'? 2 : 1}>
        {mode === 'edit' || mode === 'both' ?
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
        : null}
        {mode === 'view' || mode === 'both' ?
        <Grid.Column>
          <Markdown markdown={markdown}/>
        </Grid.Column>
        : null}
      </Grid>
      
    </>
  )
}

export default Page
