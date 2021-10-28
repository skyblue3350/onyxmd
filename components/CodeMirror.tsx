import { useEffect, useState } from 'react'
import { CodemirrorBinding } from 'y-codemirror'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import { UnControlled as CodeMirrorEditor } from "react-codemirror2"
import 'codemirror/mode/markdown/markdown'
import 'codemirror/keymap/vim'
import 'codemirror/keymap/sublime'
import 'codemirror/keymap/emacs'
import { Menu, Dropdown, Input } from 'semantic-ui-react'
import { useSession } from 'next-auth/client'

interface Awareness {
  [key:string]: any
}

interface Props {
  room: string
  color: string
  username: string
  onChange?: (value: string) => void
  onUserChange?: (users: Map<number, Awareness>) => void
  onStatusChange?: (state: 'connecting' | 'connected' | 'disconnected') => void
}

const CodeMirror = (props: Props) => {
  const [ session, loading ] = useSession()
  const keyMaps = ['sublime', 'vim', 'emacs']
  const themes = ['material', 'idea', 'monokai']

  const [EditorRef, setEditorRef] = useState(null)
  const [code, setCode] = useState('')
  const [keyMap, setKeyMap] = useState(keyMaps[0])
  const [theme, setTheme] = useState(themes[0])
  const [tabSize, setTabSize] = useState(2)

  useEffect(() => {
    if (EditorRef !== null && !loading) {
      const ydoc = new Y.Doc()
      const wsProvider = new WebsocketProvider(`ws://${location.host}`, props.room, ydoc)
      const yText = ydoc.getText('codemirror')
      const yUndoManager = new Y.UndoManager(yText)
      const awareness = wsProvider.awareness
      awareness.setLocalStateField('user', {
        name: session ? session.user.name : props.username,
        color: props.color,
        icon: session ? session.user.image : undefined,
      })
  
      const getBinding = new CodemirrorBinding(yText, EditorRef, awareness, {
        yUndoManager,
      })

      awareness.on('change', () => {
        props.onUserChange && props.onUserChange(awareness.getStates())
      })

      wsProvider.on('status', ({status}) => {
        props.onStatusChange && props.onStatusChange(status)
      })

      return () => {
        if (wsProvider.wsconnected) {
          wsProvider.disconnect()
          ydoc.destroy()
        }
      }
    }
  }, [EditorRef, props, session, loading])

return <>
      <CodeMirrorEditor
          className='CodeMirror-css'
          options={{
            mode: 'markdown',
            theme: theme,
            keyMap: keyMap,
            lineNumbers: true,
            lineWrapping: true,
            tabSize: tabSize,
          }}
          onChange={(editor, data, value) => {
            setCode(value);
            props.onChange && props.onChange(value)
          }}
          editorDidMount={(editor) => {
            setEditorRef(editor)
          }}
       />
       <Menu className='editor-menu' inverted>
        <Dropdown item text={keyMap} style={{width: 100}}>
          <Dropdown.Menu>
            {keyMaps.map(km => {
              return <Dropdown.Item key={km} text={km} active={km===keyMap} onClick={() => setKeyMap(km)} />
            })}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown item text={theme} style={{width: 100}}>
          <Dropdown.Menu>
            {themes.map(item => {
              return <Dropdown.Item key={item} text={item} active={item===theme} onClick={() => setTheme(item)} />
            })}
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item>
          <Input type='number' min={1} max={10} label='tab size' value={tabSize} onChange={(e, data) => setTabSize(parseInt(data.value))} />
        </Menu.Item>
       </Menu>
    </>
}

export default CodeMirror
