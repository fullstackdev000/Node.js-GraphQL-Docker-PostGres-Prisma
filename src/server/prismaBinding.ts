// tslint:disable:no-var-requires
const Prisma = require('prisma-binding').Prisma

const prismaBinding = new Prisma({
  debug: !!process.env.PRISMA_DEBUG,
  endpoint: `http://${process.env.PRISMA_HOST}:4466/veewme/${process.env.PRISMA_STAGE}`,
  secret: process.env.PRISMA_SECRET,
  typeDefs: './build/gen/prisma/prisma.graphql'
})

module.exports = prismaBinding
