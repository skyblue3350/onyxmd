import { useEffect, useRef, useState } from 'react'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { Menu, Dropdown, Input } from 'semantic-ui-react'
import { useSession } from 'next-auth/react'
import { yCollab } from 'y-codemirror.next'
import { highlightActiveLineGutter, lineNumbers } from '@codemirror/gutter'
import { markdown } from '@codemirror/lang-markdown'
import { closeBrackets } from '@codemirror/closebrackets'
import { history, historyKeymap } from '@codemirror/history'
import { defaultHighlightStyle, classHighlightStyle } from '@codemirror/highlight'
import { oneDarkTheme } from '@codemirror/theme-one-dark'
import { autocompletion, CompletionContext } from '@codemirror/autocomplete'
import { rectangularSelection } from '@codemirror/rectangular-selection'
import { emojiEmotion } from 'emoji-emotion'
import { indentWithTab } from '@codemirror/commands'

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
  const { data: session } = useSession()
  const keyMaps = ['sublime', 'vim', 'emacs']
  const themes = ['material', 'idea', 'monokai']

  const editorRef = useRef()
  const [keyMap, setKeyMap] = useState(localStorage.getItem('keymap') || keyMaps[0])
  const [theme, setTheme] = useState(localStorage.getItem('theme') || themes[0])
  const [tabSize, setTabSize] = useState(parseInt(localStorage.getItem('tabSize') || '2'))

  useEffect(() => {
    localStorage.setItem('keymap', keyMap)
    localStorage.setItem('theme', theme)
    localStorage.setItem('tabSize', tabSize.toString())
  }, [keyMap, theme, tabSize])

  useEffect(() => {
    if (editorRef.current && !session) {
      const ydoc = new Y.Doc()
      const wsProvider = new WebsocketProvider(`ws://${location.host}`, props.room, ydoc)
      const yText = ydoc.getText('codemirror')
      wsProvider.awareness.setLocalStateField('user', {
        name: session ? session.user.name : props.username,
        color: props.color,
        icon: session ? session.user.image : undefined,
      })
  
      const editor = new EditorView({
        state: EditorState.create({
          doc:yText.toString(),
          extensions: [
            defaultHighlightStyle,
            classHighlightStyle,
            EditorState.allowMultipleSelections.of(true),
            oneDarkTheme,
            history(),
            closeBrackets(),
            lineNumbers(),
            highlightActiveLineGutter(),
            rectangularSelection(),
            markdown(),
            keymap.of([
              indentWithTab,
              ...historyKeymap,
            ]),
            yCollab(yText, wsProvider.awareness, {undoManager: false}),
            EditorView.updateListener.of((update) => {
              update.docChanged && props.onChange && props.onChange(update.state.doc.toString())
            }),
            autocompletion({
              override: [(context: CompletionContext) => {
                let word = context.matchBefore(/[:\w]*/)
                if (word.from == word.to && !context.explicit)
                  return null
                return {
                  from: word.from,
                  options: emojiEmotion.map(e => ({
                    label: `:${e.name}:`,
                    type: 'keyword',
                    info: e.emoji
                  }))
                }
              }]
            })
          ]
        }),
        parent: editorRef.current
      })

      wsProvider.awareness.on('change', () => {
        props.onUserChange && props.onUserChange(wsProvider.awareness.getStates())
      })

      wsProvider.on('status', ({status}) => {
        props.onStatusChange && props.onStatusChange(status)
      })

      return () => {
        editor.destroy()
      }
    }
  }, [editorRef, props, session])

return (
    <>
      <div className='CodeMirror-css'
           ref={editorRef} />
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
    </>)
}

export default CodeMirror
