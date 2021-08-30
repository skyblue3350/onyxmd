import React from "react"
import dynamic from 'next/dynamic'

import type { IAceEditorProps } from 'react-ace'

const AceEditor = dynamic(async () => {
    const ace = await import('react-ace');
    require('ace-builds/src-noconflict/mode-markdown')
    require('ace-builds/src-noconflict/theme-terminal')
    return ace
  })

export default function CodeEditor(props: IAceEditorProps) {
    return (
      <AceEditor
        mode="markdown"
        theme="terminal"
        fontSize="14"
        setOptions={{
          tabSize:2,
          useWorker:false,
        }}
        commands={[
            {
                name: 'Indent',
                bindKey: {win: 'Tab', mac: 'Tab'},
                exec: (editor) => {
                    // TODO: only list
                    editor.blockIndent()
                },
            }
        ]}
        {...props}
      />
    )
  }
