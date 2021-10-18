import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import randomColor from 'randomcolor'
import { Dimmer, Loader } from 'semantic-ui-react'

import Nav from '../../components/nav'
import Markdown from '../../components/markdown'
const CodeMirror = dynamic(async ()=> await import('../../components/CodeMirror'), {ssr: false})

export default function Page() {
  const router = useRouter()
  const [mode, setMode] = useState('edit')
  const [markdown, setMarkdown] = useState('')
  const [userList, setUserList] = useState([])

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
      onUserChange={(users) => setUserList(Array.from(users.values()).map(item => item.user))} />
  }, [router])

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
        userList={userList}
        onClickEdit={() => changeMode('edit')}
        onClickBoth={() => changeMode('both')}
        onClickView={() => changeMode('view')} />
      <div style={{height: 'calc(100% - 50px)', display: 'flex'}}>
      {mode === 'edit' || mode === 'both' ?
        <div style={{width: mode === 'both'? '50%' : '100%'}}>
          {code}
        </div>
      :null}
      {mode === 'view' || mode === 'both' ?
        <div style={{width: mode === 'both'? '50%' : '100%', padding: 10, overflowY: 'auto'}}>
          <Markdown markdown={markdown} />
        </div>
      :null}
      </div>
    </div>
}
