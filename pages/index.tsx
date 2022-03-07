import { useLiveQuery } from 'dexie-react-hooks'
import router from 'next/router'
import React, { useState } from 'react'
import { Card, Container, Form, Grid, Header, Pagination, Segment } from 'semantic-ui-react'
import { db } from '../lib/db'

const pageSize = parseInt(process.env.ONYXMD_PAGE_HISTORY_SIZE) || 20

export default function Page() {
  const [room, setRoom] = useState('')
  const [pageNo, setPageNo] = useState(1)

  const histories = useLiveQuery(async () => {
    return await db.noteHistories.orderBy('updated_at').reverse().offset((pageNo-1) * pageSize).limit(pageSize).toArray()
  }, [pageNo])
  const totalPage = useLiveQuery(async () => {
    return Math.ceil((await db.noteHistories.count())/pageSize)
  })

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
            submit={+true} />
        </Form.Group>
      </Form>
    </Segment>
    <Segment>
      <Grid stackable columns={3}>
        {histories?.map(history => {
          return (
            <Grid.Column key={history.path}>
              <Card fluid href={history.path} header={history.title} description={history.description} />
            </Grid.Column>
          )
        })}
      </Grid>
      <Segment textAlign='center' basic>
        <Pagination
          activePage={pageNo}
          onPageChange={(e, data) => setPageNo(parseInt(data.activePage.toString()))}
          totalPages={totalPage ? totalPage : 0} />
      </Segment>
    </Segment>
  </Container>
}
