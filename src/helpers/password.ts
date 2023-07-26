import { randomInt } from '#veewme/lib/faker'
import bcrypt from 'bcrypt'
import * as crypto from 'crypto'

export const isValidPassword = (inputPassword: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(inputPassword, hashedPassword)
}

export const hashPassword = (password: string): string => {
  if (process.env.SALTING_ROUNDS) {
    const saltingRounds = parseInt(process.env.SALTING_ROUNDS, 0)
    const salt = bcrypt.genSaltSync(saltingRounds)
    return bcrypt.hashSync(password, salt)
  }
  throw new Error('No salting rounds provided')
}

export const createRandomPassword = (): string => {
  const size = randomInt(16, 32)
  const password = crypto.randomBytes(size).toString('hex')
  return password
}
