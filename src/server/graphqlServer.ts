/* tslint:disable:no-console */

import { MutationResolvers, QueryResolvers, Resolvers, SubscriptionResolvers } from '#veewme/graphql/types'
import { requestResetPassword, resetPassword, updatePassword } from '#veewme/server/resolvers/password'
import * as Sentry from '@sentry/node'
import { ApolloError, ApolloServer, AuthenticationError, ForbiddenError, PubSub, UserInputError } from 'apollo-server-express'
import { Application, Request } from 'express'
import { ExecutionResult, GraphQLError } from 'graphql'
import { importSchema } from 'graphql-import'
import { applyMiddleware } from 'graphql-middleware'
import { makeExecutableSchema } from 'graphql-tools'
import { mocks } from './mocks'
import { admin, admins } from './resolvers/admin'
import {
  Affiliate,
  affiliate,
  affiliates,
  createAffiliate,
  deleteAffiliate,
  updateAffiliate
} from './resolvers/affiliate'
import { Agent, agent, agents, agentsConnection, createAgent, deleteAgent, moveBrokerAgents, updateAgent } from './resolvers/agent'
import { Account, logIn, logOut, me } from './resolvers/auth'
import {
  Brokerage,
  brokerage,
  brokerages,
  brokeragesConnection,
  createBrokerage,
  deleteBrokerage,
  toggleBrokerageActivityStatus,
  updateBrokerage
} from './resolvers/brokerage'
import {
  addDemoImages,
  createDemoThing,
  demoEvent,
  demoImages,
  demoReportPDF,
  demoThings,
  demoTriggerEvent,
  demoUpload
} from './resolvers/demo'
import { developer, developers } from './resolvers/developer'
import {
  addDomain,
  checkWhiteLabel,
  createDomain,
  deleteDomain,
  Domain,
  domain,
  domains,
  purchaseDomain,
  updateDomain
} from './resolvers/domains'
import { createEvent, deleteEvent, Event, event, events, updateEvent } from './resolvers/events'
import { File, Upload, zipFiles } from './resolvers/media'
import {
  deleteMediaDocument,
  MediaDocument,
  mediaDocument,
  mediaDocuments,
  updateMediaDocument,
  uploadMediaDocument
} from './resolvers/mediaDocuments'
import {
  createMediaInteractive,
  deleteMediaInteractive,
  mediaInteractive,
  MediaInteractive,
  MediaInteractiveFile,
  mediaInteractives,
  updateMediaInteractive
} from './resolvers/mediaInteractive'
import { checkDomainExist, getTopLevelDomainsPrice } from './resolvers/namecheap'
import {
  createOffice,
  deleteOffice,
  Office,
  office,
  offices,
  officesConnection,
  updateOffice
} from './resolvers/office'
import {
  acceptOrderedServices,
  activateOrder,
  coordinates,
  createOrder,
  deleteOrder,
  Order,
  order,
  OrderedService,
  orderedServices,
  orderedServicesConnection,
  orders,
  ordersConnection,
  ordersWithFlatennedServices,
  ordersWithFlatennedServicesConnection,
  orderWithFlatennedServices,
  OrderWithFlatennedServices,
  publishOrder,
  updateOrder,
  updateOrderedService
} from './resolvers/orders'
import {
  deleteManyPanoramas,
  deletePanorama,
  panorama,
  Panorama,
  panoramas,
  reorderPanoramas,
  updateManyPanoramas,
  updatePanorama,
  uploadRealEstatePanorama
} from './resolvers/panoramas'
import {
  createPayment,
  createPaymentSetupIntent,
  finalizeSplitPayment,
  Payment,
  updatePayment
} from './resolvers/payments/payments'
import {
  createPhotographer,
  deletePhotographer,
  Photographer,
  photographer,
  photographers,
  photographersConnection,
  updatePhotographer
} from './resolvers/photographer'
import {
  deleteManyPhotos,
  deletePhoto,
  Photo,
  photo,
  photos,
  reorderPhotos,
  updateManyPhotos,
  updatePhoto,
  uploadRealEstatePhoto,
  zipPhotos
} from './resolvers/photos'
import {
  createProcessor,
  deleteProcessor,
  Processor,
  processor,
  processors,
  processorsConnection,
  updateProcessor
} from './resolvers/processor'
import { createOnePageRealEstateFlyerPdf, RealEstate, realEstate, realEstates } from './resolvers/realEstate'
import { Region, region, regions } from './resolvers/region'
import { createSelfServiceAgent, SelfServiceAgent } from './resolvers/selfServiceAgent'
import {
  archivedServicePackages,
  archivedServices,
  archiveService,
  archiveServicePackage,
  createService,
  createServiceBasic,
  createServicePackage,
  deleteService,
  deleteServicePackage,
  reorderServicePackages,
  reorderServices,
  Service,
  serviceBasic,
  serviceCategories,
  ServiceCategory,
  ServiceCategoryState,
  ServiceFeeAdjustedByRegion,
  servicePackage,
  ServicePackage,
  ServicePackageFeeAdjustedByRegion,
  servicePackages,
  services,
  servicesConnection,
  servicesUIState,
  updateService,
  updateServiceBasic,
  updateServiceCategoryCollapse,
  updateServiceCategoryColor,
  updateServiceCategoryOrder,
  updateServicePackage
} from './resolvers/service'
import {
  createTourBanner,
  deleteTourBanner,
  tour,
  Tour,
  tourBanner,
  tourBanners,
  tourGallery,
  tourGalleryConnection,
  updateTourBanner
} from './resolvers/tour'
import { uploadRealEstatePhotoProgress } from './resolvers/uploadProgress'
import {
  createVideoEmbed,
  createVideoFaux,
  createVideoHosted,
  createVideoUrl,
  deleteVideo,
  reorderVideos,
  updateVideoEmbed,
  updateVideoFaux,
  updateVideoHosted,
  updateVideoUrl,
  Video,
  video,
  videos
} from './resolvers/videos'

import { UnreachableCaseError } from '#veewme/lib/error'
import { Context } from '../lib/types'
import { permissions } from './permissions'

const prismaBinding = require('./prismaBinding') // tslint:disable-line:no-var-requires

// make resolver functions required so a type checker can spot missing ones
export interface ResolversRequired extends Resolvers<Context> {
  Mutation: Required<MutationResolvers<Context>>
  Query: Required<QueryResolvers<Context>>
  Subscription: Required<SubscriptionResolvers<Context>>
}

export const pubsub = new PubSub()

export class GraphQLServer {
  prismaBinding = prismaBinding

  resolvers: ResolversRequired = {
    Account,
    AccountUnion: {
      __resolveType (obj, context: Context, info) {
        switch (context.role) {
          case 'ADMIN': return 'Admin'
          case 'AFFILIATE': return 'Affiliate'
          case 'AGENT': return 'Agent'
          case 'DEVELOPER': return 'Developer'
          case 'PHOTOGRAPHER': return 'Photographer'
          case 'PROCESSOR': return 'Processor'
          case 'SELFSERVICEAGENT': return 'SelfServiceAgent'
          case undefined: throw new UserInputError('Undefined role')
          default: throw new UnreachableCaseError(context.role)
        }
      }
    },
    Affiliate,
    Agent,
    Brokerage,
    Domain,
    Event,
    File,
    MediaDocument,
    MediaInteractive,
    MediaInteractiveFile,
    Mutation: {
      acceptOrderedServices,
      activateOrder,
      addDemoImages,
      addDomain,
      archiveService,
      archiveServicePackage,
      checkWhiteLabel,
      coordinates,
      createAffiliate,
      createAgent,
      createBrokerage,
      createDemoThing,
      createDomain,
      createEvent,
      createMediaInteractive,
      createOffice,
      createOnePageRealEstateFlyerPdf,
      createOrder,
      createPayment,
      createPaymentSetupIntent,
      createPhotographer,
      createProcessor,
      createSelfServiceAgent,
      createService,
      createServiceBasic,
      createServicePackage,
      createTourBanner,
      createVideoEmbed,
      createVideoFaux,
      createVideoHosted,
      createVideoUrl,
      deleteAffiliate,
      deleteAgent,
      deleteBrokerage,
      deleteDomain,
      deleteEvent,
      deleteManyPanoramas,
      deleteManyPhotos,
      deleteMediaDocument,
      deleteMediaInteractive,
      deleteOffice,
      deleteOrder,
      deletePanorama,
      deletePhoto,
      deletePhotographer,
      deleteProcessor,
      deleteService,
      deleteServicePackage,
      deleteTourBanner,
      deleteVideo,
      demoTriggerEvent,
      demoUpload,
      finalizeSplitPayment,
      logIn,
      logOut,
      moveBrokerAgents,
      publishOrder,
      purchaseDomain,
      reorderPanoramas,
      reorderPhotos,
      reorderServicePackages,
      reorderServices,
      reorderVideos,
      requestResetPassword,
      resetPassword,
      toggleBrokerageActivityStatus,
      updateAffiliate,
      updateAgent,
      updateBrokerage,
      updateDomain,
      updateEvent,
      updateManyPanoramas,
      updateManyPhotos,
      updateMediaDocument,
      updateMediaInteractive,
      updateOffice,
      updateOrder,
      updateOrderedService,
      updatePanorama,
      updatePassword,
      updatePayment,
      updatePhoto,
      updatePhotographer,
      updateProcessor,
      updateService,
      updateServiceBasic,
      updateServiceCategoryCollapse,
      updateServiceCategoryColor,
      updateServiceCategoryOrder,
      updateServicePackage,
      updateTourBanner,
      updateVideoEmbed,
      updateVideoFaux,
      updateVideoHosted,
      updateVideoUrl,
      uploadMediaDocument,
      uploadRealEstatePanorama,
      uploadRealEstatePhoto,
      zipFiles,
      zipPhotos
    },
    Office,
    Order,
    OrderedService,
    OrderWithFlatennedServices,
    Panorama,
    Payment,
    Photo,
    Photographer,
    Processor,
    Query: {
      admin,
      admins,
      affiliate,
      affiliates,
      agent,
      agents,
      agentsConnection,
      archivedServicePackages,
      archivedServices,
      brokerage,
      brokerages,
      brokeragesConnection,
      checkDomainExist,
      demoImages,
      demoReportPDF,
      demoThings,
      developer,
      developers,
      domain,
      domains,
      event,
      events,
      getTopLevelDomainsPrice,
      me,
      mediaDocument,
      mediaDocuments,
      mediaInteractive,
      mediaInteractives,
      office,
      offices,
      officesConnection,
      order,
      orderedServices,
      orderedServicesConnection,
      orders,
      ordersConnection,
      ordersWithFlatennedServices,
      ordersWithFlatennedServicesConnection,
      orderWithFlatennedServices,
      panorama,
      panoramas,
      photo,
      photographer,
      photographers,
      photographersConnection,
      photos,
      processor,
      processors,
      processorsConnection,
      realEstate,
      realEstates,
      region,
      regions,
      serviceBasic,
      serviceCategories,
      servicePackage,
      servicePackages,
      services,
      servicesConnection,
      servicesUIState,
      tour,
      tourBanner,
      tourBanners,
      tourGallery,
      tourGalleryConnection,
      video,
      videos
    },
    RealEstate,
    Region,
    SelfServiceAgent,
    Service,
    ServiceCategory,
    ServiceCategoryState,
    ServiceFeeAdjustedByRegion,
    ServicePackage,
    ServicePackageFeeAdjustedByRegion,
    Subscription: {
      demoEvent,
      uploadRealEstatePhotoProgress
    },
    Tour,
    Upload,
    Video
  }

  typeDefs = importSchema('src/lib/graphql/schema.graphql')

  schema = applyMiddleware(
    makeExecutableSchema({
      // XXX: cast resolvers to any due to incompatibility with types generated by graphql-code-generator
      // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/21359
      resolvers: this.resolvers as any,
      resolverValidationOptions: {
        requireResolversForResolveType: false
      },
      typeDefs: this.typeDefs
    }),
    permissions
  )

  apolloServer: ApolloServer = new ApolloServer({
    context: ({ req }: { req: Request }): Context => {
      // request exists for HTTP requests; for websocket connections it's undefined
      if (req) {
        return {
          accountId: req.session && req.session.accountId,
          prismaBinding: this.prismaBinding,
          request: req,
          role: req.session && req.session.role,
          userId: req.session && req.session.userId
        }
      } else {
        // TODO restore accountId, role and userId for websocket's context
        return { prismaBinding: this.prismaBinding }
      }
    },
    formatError: (error: GraphQLError) => {
      // TODO stack trace should not be passed to client
      console.log(error)
      return error
    },
    formatResponse: (response: ExecutionResult) => {
      const formatResolver: (resolver: ExecutionResult['data']) => ExecutionResult['data'] = resolver => {
        for (const key in resolver) {
          if (key in resolver) {
            if (resolver[key] === null) {
              resolver[key] = undefined
            }
            if (typeof resolver[key] === 'object') {
              resolver[key] = formatResolver(resolver[key])
            }
          }
        }
        return resolver
      }
      const formattedResponse = { ...response }
      if (formattedResponse && formattedResponse.data) {
        formattedResponse.data = formatResolver(formattedResponse.data)
      }
      return response
    },
    schema: this.schema,
    ...(process.env.GRAPHQL_MOCKS ? { mocks } : {}),
    playground: {
      settings: {
        'editor.cursorShape': 'line',
        'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
        'editor.fontSize': 14,
        'editor.reuseHeaders': true,
        'editor.theme': 'dark',
        'general.betaUpdates': false,
        'request.credentials': 'same-origin',
        'tracing.hideTracingResponse': true
      }
    },
    plugins: [
      {
        requestDidStart () {
          return {
            didEncounterErrors (ctx: any) {
              // If we couldn't parse the operation, don't do anything here
              if (!ctx.operation) {
                return
              }
              ctx.errors
                .filter((err: GraphQLError) => !(err.originalError instanceof ApolloError))
                .map((err: GraphQLError) => {
                  // Add scoped report details and send to Sentry
                  Sentry.withScope(scope => {
                    scope.setTag('kind', ctx.operation.operation)
                    scope.setExtra('query', ctx.request.query)
                    scope.setExtra('variables', ctx.request.variables)
                    if (err.path) {
                      scope.addBreadcrumb({
                        category: 'query-path',
                        level: Sentry.Severity.Debug,
                        message: err.path.join(' > ')
                      })
                    }
                    Sentry.captureException(err)
                  })
                })
            },
            willSendResponse (ctx: any) {
              const { response } = ctx
              const { errors } = response
              if (response && response.http && errors) {
                if (errors.find((err: GraphQLError) => err.originalError instanceof AuthenticationError)) {
                  response.data = undefined
                  response.http.status = 401
                } else if (errors.find((err: GraphQLError) => err.originalError instanceof ForbiddenError)) {
                  response.data = undefined
                  response.http.status = 403
                }
              }
            }
          }
        }
      }
    ]
  })

  applyMiddleware (app: Application) {
    this.apolloServer.applyMiddleware({ app, path: process.env.GRAPHQL_ENDPOINT })
  }
}
