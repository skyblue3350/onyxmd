import { Button } from 'semantic-ui-react'
import socket from 'socket.io-client'

export default function Page() {
  const clinet = socket()

  return <>
      <Button as='a' href='/github'>github</Button>
  </>
}
