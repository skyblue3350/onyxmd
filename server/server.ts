import { IncomingMessage, ServerResponse, createServer } from 'http'
import passport from 'passport'
import next from 'next'
import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import io from 'socket.io'
import { router as authRouter } from './auth-router'
import { parse } from 'url'
import { SessionSocket } from '../@types/socket'
import { applyDelta } from '../lib/applyDelta'
import { Notes } from '../@types/note'
import { Delta } from '../@types/ace'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  const app = express()
  const server = createServer(app)
  const sessionMiddleware = session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  })

  // Middleware
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(sessionMiddleware)
  app.use(passport.initialize())
  app.use(passport.session())

  // Router
  app.use(authRouter)

  // NextJS
  app.get('/*', (req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  // WebSocket
  const ioserver = new io.Server(server, {
  })
  const data: Notes = new Proxy({}, {
    get: (target, name) => {
      return target.hasOwnProperty(name) ? target[name] : {
        revision: 0,
        data: '',
      }
    }
  })

  ioserver.on('connection', (socket: SessionSocket) => {
    // console.log('connect', socket.request.session)
    let noteId = null

    socket.on('join', async (id) => {
      noteId = id

      const d = data[noteId]
      await socket.join(noteId)
      socket.emit('doc', d.revision, d.data)
    })
    socket.on('insert', (revision: number, delta: Delta) => {
      const d = data[noteId]

      if (d.revision !== revision) {
        socket.emit('doc', d.revision, d.data)
      }

      const doc = applyDelta(d.data, delta)
      d.revision += 1
      d.data = doc
      data[noteId] = d

      // send other clients
      socket.broadcast.to(noteId).emit(delta.action, d.revision, delta)
    })
    socket.on('remove', (revision: number, delta: Delta) => {
      const d = data[noteId]

      if (d.revision !== revision) {
        socket.emit('doc', d.revision, d.data)
      }

      const doc = applyDelta(d.data, delta)
      d.revision += 1
      d.data = doc
      data[noteId] = d

      // send other clients
      socket.broadcast.to(noteId).emit(delta.action, d.revision, delta)
    })
  })

  ioserver.use((socket ,next) => {
    sessionMiddleware(socket.request, {}, next)
  })

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
})
