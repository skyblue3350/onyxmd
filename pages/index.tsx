import router from "next/router"
import React, { useState } from "react"
import { Container, Form, Header, Segment } from "semantic-ui-react"

export default function Page() {
  const [room, setRoom] = useState('')

  return <Container>
    <Segment>
      <Header content='TopPage' />
      <Form onSubmit={() => {
        if (room.length > 0) {
          router.push(`/notes/${room}`)
        }
      }}>
        <Form.Group>
          <Form.Input
            placeholder='room id'
            value={room}
            onChange={(event, data) => setRoom(data.value.toString())} />
          <Form.Button
            content='join'
            submit />
        </Form.Group>
      </Form>
    </Segment>
  </Container>
}
