/* tslint:disable:no-console */
import { prisma } from '#veewme/gen/prisma'
import PrismaSession from '#veewme/lib/session'
import * as Sentry from '@sentry/node'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as session from 'express-session'
import http from 'http'
import * as proxy from 'http-proxy-middleware'
import ms from 'ms'
import { Client } from 'pg'
import { jsonApiRouter } from './json_api'
import { stripeWebhook } from './payments/webhook'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.PRISMA_STAGE || ''
})

// Create a Postgres client to access the database directly (e.g. to handle full-text search, which is not supported
// by Prisma). Connection config values must be the same as in docker-compose.yml in PRISMA_CONFIG.
export const postgresClient = new Client({
  database: 'prisma',
  host: process.env.POSTGRES_HOST || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: 5432,
  user: process.env.POSTGRES_USER || 'postgres'
})

import { GraphQLServer } from './graphqlServer'

async function startServer () {
  const app = express()

  app.use(Sentry.Handlers.requestHandler() as express.RequestHandler)

  app.get('/', (req, res, next) => {
    req.url = req.originalUrl = '/public/static/index.html'
    next()
  })

  app.use(session({
    cookie: {
      httpOnly: true,
      maxAge: ms(process.env.AUTH_SESSION_MAX_AGE || ''),
      secure: process.env.AUTH_SESSION_SECURE === 'true'
    },
    name: 'id',
    resave: false,
    saveUninitialized: false,
    secret: process.env.AUTH_SESSION_SECRET || '',
    store: new PrismaSession(
      { checkPeriod: 120000 },
      prisma
    ),
    unset: 'destroy'
  }))

  // JSON API router
  app.use('/api', bodyParser.json(), jsonApiRouter)

  // Stripe webhook handler
  app.post('/webhook', bodyParser.raw({ type: 'application/json' }), stripeWebhook)

  const graphQLserver = new GraphQLServer()
  graphQLserver.applyMiddleware(app)

  if (process.env.DEV_MODE) {
    app.use(proxy('/public', {
      target: `http://${process.env.DEV_MODE_HOST}:${process.env.DEV_MODE_PORT}/`,
      ws: true
    }))
  } else {
    app.use('/public/', express.static('dist/web'))
  }

  if (process.env.STORAGE_TYPE === 'local') {
    app.use('/storage', express.static('tmp/storage'))
  }

  // XXX: working but a bit hacky, consider using express-history-api-fallback
  app.get('*', (req, res) => {
    req.url = req.originalUrl = '/'
    app.handle(req, res)
  })

  app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler)

  const httpServer = http.createServer(app)
  graphQLserver.apolloServer.installSubscriptionHandlers(httpServer)

  // connect to Postgres client
  await postgresClient.connect()

  const port = process.env.SERVER_HTTP_PORT
  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}.`)
  })
}

// tslint:disable-next-line:no-floating-promises
startServer()
