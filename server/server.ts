import { IncomingMessage, ServerResponse, createServer } from 'http'
import passport from 'passport'
import next from 'next'
import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { router as authRouter } from './auth-router'
import { parse } from 'url'
import * as WebSocket from 'ws'
import { setupWSConnection } from './utils'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
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
  app.post('/*', (req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  // WebSocket
  const wss = new WebSocket.Server({server})
  wss.on('connection', setupWSConnection)

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
})
