import React, { useEffect, useReducer, useRef, useState } from 'react'
import SocketIOClient from 'socket.io-client'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const AceEdit = dynamic(()=>import('../../components/AceEdit'), {ssr:false})

import { applyDelta } from '../../lib/applyDelta'
import Nav from '../../components/nav'
import { Container, Grid } from 'semantic-ui-react'
import Markdown from '../../components/markdown'

const Page = () => {
  const router = useRouter()
  const [noteId, setNoteId] = useState('')
  const [mode, setMode] = useState('edit')
  const socketRef = useRef(null)
  const editorRef = useRef(null)

  const mdReducer = (state, action) => {
    if (action.type === 'doc') {
      return {revision: action.r, markdown: action.md}
    } else if (action.type === 'apply') {
      return {revision: action.r, markdown: applyDelta(state.markdown, action.delta)}
    }
  }

  const [{ markdown, revision }, dispatch] = useReducer(mdReducer, {markdown: '', revision: 0})

  useEffect(() => {
    if (router.isReady) {
      setNoteId(router.query.id.toString())
      router.query.mode && setMode(router.query.mode.toString())
      socketRef.current = SocketIOClient()

      const socket = socketRef.current

      socket.emit('join', router.query.id)
      socket.on('doc', (r, md) => dispatch({type: 'doc', r, md}))
      socket.on('insert', (r, delta) => dispatch({type: 'apply', r, delta}))
      socket.on('remove', (r, delta) => dispatch({type: 'apply', r, delta}))
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
        <Grid.Column className='noPadding'>
          <AceEdit
            value={markdown}
            onLoad={(editor) => editorRef.current = editor}
            onChange={(value, e) => {
              socketRef.current.emit(e.action, revision, e)
              dispatch({type: 'doc', r: revision+1, md: value})
            }} />
        </Grid.Column>
        : null}
        {mode === 'view' || mode === 'both' ?
        <Grid.Column>
          <Container>
            <Markdown markdown={markdown}/>
          </Container>
        </Grid.Column>
        : null}
      </Grid>
      
    </>
  )
}

export default Page
