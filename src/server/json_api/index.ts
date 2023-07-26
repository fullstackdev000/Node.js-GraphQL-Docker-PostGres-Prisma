import { prisma } from '#veewme/gen/prisma'
import { isValidPassword } from '#veewme/helpers/password'
import * as express from 'express'
import { expressjwt, Request as JWTRequest } from 'express-jwt'
import * as jwt from 'jsonwebtoken'

export const jsonApiRouter = express.Router()

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET env variable not set.')
}
const JWT_EXPIRATION = '14d'

const responseUnauthorized = (response: express.Response, message: string) =>
  response.status(401).json({ error: message })

// Unprotected paths

jsonApiRouter.post('/token', async (request: express.Request, response: express.Response) => {
  const email = request.body.email
  if (!email) {
    return response.status(400).json({ error: 'Missing `email` field.' })
  }

  const inputPassword = request.body.password
  if (!inputPassword) {
    return response.status(400).json({ error: 'Missing `password` field.' })
  }

  let user
  try {
    user = await prisma.user({ email })
  } catch {
    return responseUnauthorized(response, 'Bad credentials.')
  }

  if (!user || !isValidPassword(inputPassword, user.password)) {
    return responseUnauthorized(response, 'Bad credentials.')
  }

  const payload = {
    userId: user.id
  }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
  return response.json({ token })
})

// Protected paths

const requireTokenAuth = expressjwt({
  algorithms: ['HS256'],
  secret: JWT_SECRET
})

jsonApiRouter.use(requireTokenAuth)

jsonApiRouter.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Invalid token' })
  } else {
    next(err)
  }
})

jsonApiRouter.get('/orders', async (request: JWTRequest, response: express.Response) => {
  if (!request.auth) {
    return responseUnauthorized(response, 'Bad credentials.')
  }

  const userId = request.auth.userId
  let affiliate
  try {
    affiliate = (await prisma.affiliates({ where: { user: { id: userId } } }))[0]
  } catch {
    return responseUnauthorized(response, 'Bad credentials.')
  }

  if (!affiliate) {
    return responseUnauthorized(response, 'Bad credentials.')
  }

  const query = `
    fragment Order on Order {
      id
      createdAt
      realEstateId {
        city
        country
        state
        street
        zip
      }
      updatedAt
    }
  `
  const orders = await prisma.orders({ where: { orderedFromAffiliateId: { id: affiliate.id } } }).$fragment(query)
  return response.json({ orders })
})
