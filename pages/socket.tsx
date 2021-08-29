import React from 'react'
import SocketIOClient from 'socket.io-client'

import dynamic from 'next/dynamic'
import { applyDelta } from '../lib/applyDelta'
const AceEditor = dynamic(import('react-ace'), {ssr: false})

interface Props {}
interface State {
  markdown: string
}

export default class Page extends React.Component<Props, State> {
  socket
  constructor(props: Props) {
    super(props)

    this.state = {
      markdown: '',
    }
  }

  componentDidMount() {
    this.socket = SocketIOClient.connect()

    this.socket.on('doc', (markdown) => {
      this.setState({markdown})
    })
    this.socket.on('insert', (delta) => {
      this.setState({
        markdown: applyDelta(this.state.markdown, delta)
      })
    })
    this.socket.on('delete', (delta) => {
      this.setState({
        markdown: applyDelta(this.state.markdown, delta)
      })
    })
  }

  onChange(value: string, e) {
    this.socket.emit(e.action, e)
  }

  render() {
    return <AceEditor value={this.state.markdown} mode='markdown' theme='github' name='editor' onChange={this.onChange.bind(this)} />
  }
}
