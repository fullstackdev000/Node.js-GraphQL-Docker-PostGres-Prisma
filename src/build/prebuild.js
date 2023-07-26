/* tslint:disable:no-console */

const appRootPath = require('app-root-path')
const { getEnv } = require('./env')
const chokidar = require('chokidar')
const { generate } = require('@graphql-codegen/cli')
const path = require('path')
const sh = require('shelljs')
const util = require('util')

const env = getEnv()
const graphqlDocuments = ['./src/lib/graphql/queries.ts', './src/lib/graphql/queries/*']
const graphqlSchema = './src/lib/graphql/schema.graphql'
const prismaDatamodel = './src/lib/graphql/datamodel.prisma'
const prismaSchema = './build/gen/prisma/prisma.graphql'

async function generateGraphQLTypes () {
  sh.mkdir('-p', './build')
  sh.mkdir('-p', './build/gen')
  return generate({
    documents: graphqlDocuments,
    generates: {
      './build/gen/graphqlTypes.tsx': {
        config: {
          defaultMapper: 'Partial<{T}>'
        },
        plugins: [
          { add: '/* eslint-disable */\n/* tslint:disable */' },
          { typescript: { enumsAsTypes: 'true' } },
          'fragment-matcher',
          'typescript-operations',
          'typescript-resolvers',
          'typescript-react-apollo'
        ]
      }
    },
    overwrite: true,
    schema: graphqlSchema,
    silent: true
  }, true).then(generatedFiles => {
    for (const { filename } of generatedFiles) {
      console.log(`Generated GraphQL types in ${filename}`)
    }
  }).catch(err => {
    console.error(`Couldn't generate GraphQL types`)
    console.error(err)
  })
}

async function generatePrismaThings () {
  sh.env.PRISMA_HOST = env.PRISMA_HOST
  sh.env.PRISMA_STAGE = env.PRISMA_STAGE
  return util.promisify(sh.exec)('prisma generate', { async: true }).catch(err => {
    console.error(`Couldn't generate Prisma-related code`)
    console.error(err)
  })
}

async function prebuild () {
  sh.mkdir('-p', './build')
  await generatePrismaThings()
  await generateGraphQLTypes()
}

const normalizePath = p =>
  path.isAbsolute(p) ? path.normalize(p) : appRootPath.resolve(p)

class PrebuildWatchPlugin {
  constructor () {
    this.graphqlInputFiles = [graphqlSchema, prismaSchema, ...graphqlDocuments]
      .map(normalizePath)
    this.prismaInputFiles = [prismaDatamodel].map(normalizePath)
    this.filesToWatch = [
      ...this.graphqlInputFiles,
      ...this.prismaInputFiles
    ].map(normalizePath)
  }

  handleFileModification (filePath) {
    if (this.graphqlInputFiles.includes(filePath)) {
      // tslint:disable-next-line:no-floating-promises
      generateGraphQLTypes()
    } else if (this.prismaInputFiles.includes(filePath)) {
      // tslint:disable-next-line:no-floating-promises
      generatePrismaThings()
    }
  }

  apply (compiler) {
    if (env.DEV_MODE && !this.watcher) {
      this.watcher = chokidar.watch(this.filesToWatch, {
        persistent: true
      })

      // generate gql types when gql-related files change
      // this.watcher.on('add', this.handleFileModification.bind(this))
      this.watcher.on('change', this.handleFileModification.bind(this))
      this.watcher.on('unlink', this.handleFileModification.bind(this))
    }
  }
}

module.exports = {
  generateGraphQLTypes,
  prebuild,
  PrebuildWatchPlugin
}
