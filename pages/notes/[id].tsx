import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import randomColor from 'randomcolor'
import { Dimmer, Loader } from 'semantic-ui-react'
import { useUpdateEffect } from 'ahooks'

import Nav from '../../components/nav'
import MDViewer from '../../components/MDViewer'
import { db } from '../../lib/db'
import { getMarkdown } from '../../lib/markdown'
const CodeMirror = dynamic(async ()=> await import('../../components/CodeMirror'), {ssr: false})

export default function Page() {
  const router = useRouter()
  const [mode, setMode] = useState('edit')
  const [markdown, setMarkdown] = useState('')
  const [userList, setUserList] = useState([])
  const [state, setState] = useState('connecting')

  useEffect(() => {
    if (router.isReady && router.query.mode) {
      setMode(router.query.mode.toString())
    }
  }, [router])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const code = useMemo(() => {
    if (!router.isReady) {
      return null
    }
    return <CodeMirror
      username={`user${('000'+Math.floor(Math.random() * 1000)).slice(-3)}`}
      color={randomColor()}
      room={router.query.id.toString()}
      onChange={(value) => setMarkdown(value)}
      onUserChange={(users) => setUserList(Array.from(users.values()).map(item => item.user))}
      onStatusChange={(state) => setState(state)} />
  }, [router])

  useUpdateEffect(() => {
    const env = getMarkdown(markdown).env
    const path = location.pathname
    db.noteHistories.where('path').equals(path).first().then(page => {
      if (page) {
        db.noteHistories.update(page.id, {
          updated_at: new Date(),
          title: env.title,
          description: env.excerpt.length === 0 ? '' : env.excerpt[0]
        })
      } else {
        db.noteHistories.add({
          created_at: new Date(),
          updated_at: new Date(),
          title: env.title,
          path,
          description: env.excerpt.length === 0 ? '' : env.excerpt[0]
        })
      }
    })
  }, [markdown])

  if (!router.isReady) {
    return (
    <Dimmer active>
      <Loader content='Loading' />
    </Dimmer>)
  }

  const changeMode = (mode: 'edit' | 'both' | 'view') => {
    const url = new URL(location.href)
    url.searchParams.set('mode', mode)
    history.replaceState({}, '', url.toString())
    setMode(mode)
  }

  return <div style={{height: '100vh'}}>
      <Nav mode={mode}
        state={state}
        userList={userList}
        onClickEdit={() => changeMode('edit')}
        onClickBoth={() => changeMode('both')}
        onClickView={() => changeMode('view')} />
      <div style={{height: 'calc(100% - 50px)', display: 'flex'}}>
        <div style={{width: mode === 'both'? '50%' : '100%', display: mode !== 'view' ? 'block' : 'none'}}>
          {code}
        </div>
        <div style={{width: mode === 'both'? '50%' : '100%', display: mode !== 'edit' ? 'block' : 'none', overflowY: 'auto'}}>
          <MDViewer markdown={markdown} />
        </div>
      </div>
    </div>
}
