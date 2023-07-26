import { Prisma } from '#veewme/gen/prisma'
import { SessionType } from '#veewme/lib/types'
import { Store } from 'express-session'

const oneDay = 86400000

function getTTL (options: Options, sess: SessionType, sid: string) {

  if (options.ttl) return options.ttl

  const maxAge = (sess && sess.cookie) ? sess.cookie.maxAge : null
  return (maxAge !== null ? Math.floor(maxAge) : oneDay)
}

async function prune (prisma: Prisma) {

  const sessions = await prisma.sessions()

  for (const session of sessions) {

    const s = session
    const now = new Date()

    if (s.expires && now.valueOf().toString() >= s.expires.valueOf()) {
      await prisma.deleteSession({ sid: s.sid })
    }
  }
}

const defer = setImmediate

interface Options {
  checkPeriod: number
  stale?: boolean
  ttl?: number
}

class PrismaSession extends Store {
  private prisma: Prisma
  private serializer: JSON
  private options: Options
  private _checkInterval!: number

  constructor (config: Options, prisma: Prisma) {
    super()
    this.prisma = prisma
    this.options = config
    this.serializer = JSON
    this.startInterval()
  }

  get = async (sid: string, fn: ((err?: any) => void)) => {
    const prisma = this.prisma
    const serializer = this.serializer

    const session = await prisma.session({ sid })
    if (!session) return fn()

    let result = null
    if (session.data) {
      result = serializer.parse(session.data)
    }
    fn && defer(fn, null, result)
  }

  set = async (sid: string, sess: SessionType, fn?: ((err?: any) => void)) => {
    const prisma = this.prisma

    const ttl = getTTL(this.options, sess, sid)
    const expires = new Date((new Date()).valueOf() + ttl)

    let jsess = null
    try {
      jsess = this.serializer.stringify(sess)
    } catch (e) {
      fn && defer(fn, e)
    }

    const data = {
      data: jsess,
      expires,
      sid
    }

    const existingSession = await prisma.session({ sid })

    if (existingSession) {
      await prisma.updateSession({
        data,
        where: { sid }
      })
    } else {
      await prisma.createSession(data)
    }

    fn && defer(fn, null)
  }

  destroy = async (sid: string, fn?: ((err?: any) => void)) => {
    const prisma = this.prisma

    if (Array.isArray(sid)) {
      sid.forEach(async () => {
        await prisma.deleteSession({ sid })
      })
    } else {
      await prisma.deleteSession({ sid })
    }

    fn && defer(fn, null)
  }

  touch = async (sid: string, sess: SessionType, fn?: ((err?: any) => void)) => {
    const prisma = this.prisma

    const ttl = getTTL(this.options, sess, sid)
    const expires = new Date((new Date()).valueOf() + ttl)

    let err = null
    try {
      const existingSession = await prisma.session({ sid })

      if (existingSession) {
        const existingSessionData = existingSession.data ? this.serializer.parse(existingSession.data) : ''
        existingSessionData.cookie = sess.cookie

        await prisma.updateSession({
          data: {
            data: this.serializer.stringify(existingSessionData),
            expires,
            sid
          },
          where: { sid: existingSession.sid }
        })
      }
    } catch (e) {
      err = e
    }

    fn && defer(fn, err)
  }

  ids = async (fn?: ((err?: any) => void)) => {
    const prisma = this.prisma

    const sessions = await prisma.sessions()
    const sids = []
    for (let i = 0; i < sessions.length; i++) {
      sids[i] = sessions[i].sid
    }

    fn && defer(fn, null, sids)
  }

  all = async (fn?: ((err?: any) => void)) => {
    const prisma = this.prisma
    const serializer = this.serializer

    let err = null
    const result: { [key: string]: any[] } = {}
    try {
      const sessions = await prisma.sessions()
      for (const session of sessions) {
        result[session.sid] = session.data ? serializer.parse(session.data) : serializer.parse('')
      }
    } catch (e) {
      err = e
    }

    fn && defer(fn, err, result)
  }

  clear = async (fn?: ((err?: any) => void)) => {
    const prisma = this.prisma

    await prisma.deleteManySessions()

    fn && defer(fn, null)
  }

  length = async (fn?: ((err?: any) => void)) => {
    const prisma = this.prisma

    const sessions = await prisma.sessions()

    const itemCount = sessions.length

    fn && defer(fn, null, itemCount)
  }

  startInterval = () => {
    const prisma = this.prisma
    const ms = this.options.checkPeriod

    clearInterval(this._checkInterval)
    this._checkInterval = setInterval(async () => {
      await prune(prisma)
    }, Math.floor(ms))
  }

  stopInterval = () => {
    clearInterval(this._checkInterval)
  }

  prune = async () => {
    const prisma = this.prisma
    await prune(prisma)
  }

}

export default PrismaSession
