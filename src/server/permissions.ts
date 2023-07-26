import { Role } from '#veewme/graphql/types'
import { AuthContext, Context } from '#veewme/lib/types'
import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import { allow, and, or, rule, shield } from 'graphql-shield'

/**
 * Restricts access to GraphQL resolvers to particular user roles. Admin and developer
 * roles are by default allowed to perform any operation and don't need to be provided
 * explicitly.
 * @param roles - list of roles that can perform given operation
 */
const allowRoles = (roles: Role[] = []) =>
  rule({ cache: 'contextual' })((_, __, context: Context) => {
    if (context.role) {
      const isAdmin = context.role === 'ADMIN'
      const isDeveloper = context.role === 'DEVELOPER'
      if (isAdmin || isDeveloper || roles.includes(context.role)) {
        return true
      }
    }
    return new ForbiddenError('Forbidden')
  })

/**
 * Restricts access to GraphQL resolvers to authenticated users.
 */
const isAuthenticated = rule({ cache: 'contextual' })(
  (_, __, context: Context) => !!(context.accountId && context.role) || new AuthenticationError('Unauthenticated')
)

/**
 * Restricts access to fetching or updating an account to owner of the account.
 * @param role - user role for which to run the validation.
 */
const canManageOwnAccount = (role: Role) =>
  rule({ cache: 'strict' })(async (_, args, ctx: AuthContext) => {
    if (ctx.role === role) {
      return !!(ctx.accountId === args.where.id) || new ForbiddenError('Forbidden')
    }
    return true
  })

export const permissions = shield(
  {
    Account: {
      accountId: isAuthenticated,
      role: isAuthenticated
    },
    Mutation: {
      acceptOrderedServices: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      activateOrder: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      addDemoImages: and(isAuthenticated, allowRoles()),
      addDomain: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      archiveService: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      archiveServicePackage: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      checkWhiteLabel: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      createAffiliate: allow,
      createAgent: allow,
      createBrokerage: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      createDemoThing: and(isAuthenticated, allowRoles()),
      createEvent: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE', 'PHOTOGRAPHER', 'PROCESSOR'])),
      createMediaInteractive: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      createOffice: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      createOnePageRealEstateFlyerPdf: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      createOrder: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      createPayment: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      createPaymentSetupIntent: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      createPhotographer: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      createProcessor: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      createSelfServiceAgent: allow,
      createService: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      createServiceBasic: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      createServicePackage: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      createTourBanner: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT'])),
      createVideoEmbed: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      createVideoFaux: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      createVideoHosted: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      createVideoUrl: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      deleteAffiliate: and(isAuthenticated, allowRoles()),
      deleteAgent: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      deleteBrokerage: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      deleteDomain: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      deleteEvent: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE', 'PHOTOGRAPHER', 'PROCESSOR'])),
      deleteManyPanoramas: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      deleteManyPhotos: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      deleteMediaDocument: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      deleteMediaInteractive: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      deleteOffice: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      deleteOrder: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      deletePanorama: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      deletePhoto: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      deletePhotographer: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      deleteProcessor: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      deleteService: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      deleteServicePackage: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      deleteTourBanner: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT'])),
      deleteVideo: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      demoTriggerEvent: and(isAuthenticated, allowRoles()),
      demoUpload: and(isAuthenticated, allowRoles()),
      finalizeSplitPayment: and(isAuthenticated, allowRoles(['AGENT'])),
      logIn: allow,
      logOut: allow,
      moveBrokerAgents: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      publishOrder: and(isAuthenticated, allowRoles(['AFFILIATE', 'PROCESSOR', 'PHOTOGRAPHER'])),
      purchaseDomain: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      reorderPanoramas: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      reorderPhotos: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT'])),
      reorderServicePackages: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      reorderServices: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      reorderVideos: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      requestResetPassword: allow,
      resetPassword: allow,
      toggleBrokerageActivityStatus: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      updateAffiliate: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      updateAgent: and(isAuthenticated, or(canManageOwnAccount('AGENT'), allowRoles(['AFFILIATE', 'AGENT']))),
      updateBrokerage: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      updateDomain: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      updateEvent: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE', 'PHOTOGRAPHER', 'PROCESSOR'])),
      updateManyPanoramas: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      updateManyPhotos: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      updateMediaDocument: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      updateMediaInteractive: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      updateOffice: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      updateOrder: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      updateOrderedService: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      updatePanorama: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      updatePassword: and(isAuthenticated),
      updatePayment: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      updatePhoto: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      updatePhotographer: and(
        isAuthenticated,
        or(canManageOwnAccount('PHOTOGRAPHER'), allowRoles(['AFFILIATE', 'PHOTOGRAPHER']))
      ),
      updateProcessor: and(
        isAuthenticated,
        or(canManageOwnAccount('PROCESSOR'), allowRoles(['AFFILIATE', 'PROCESSOR']))
      ),
      updateService: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      updateServiceBasic: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      updateServiceCategoryCollapse: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      updateServiceCategoryColor: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      updateServicePackage: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      updateTourBanner: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT'])),
      updateVideoEmbed: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      updateVideoFaux: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      updateVideoHosted: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      updateVideoUrl: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      uploadMediaDocument: isAuthenticated,
      uploadRealEstatePanorama: isAuthenticated,
      uploadRealEstatePhoto: isAuthenticated,
      zipFiles: isAuthenticated,
      zipPhotos: isAuthenticated
    },
    Query: {
      admin: and(isAuthenticated, allowRoles()),
      admins: and(isAuthenticated, allowRoles()),
      affiliate: and(isAuthenticated, or(canManageOwnAccount('AFFILIATE'), allowRoles(['AFFILIATE']))),
      affiliates: and(isAuthenticated, allowRoles()),
      agent: and(isAuthenticated, or(canManageOwnAccount('AGENT'), allowRoles(['AFFILIATE', 'AGENT']))),
      agents: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT'])),
      agentsConnection: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT'])),
      archivedServicePackages: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      archivedServices: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      brokerage: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      brokerages: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      brokeragesConnection: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      checkDomainExist: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      demoImages: and(isAuthenticated, allowRoles()),
      demoReportPDF: and(isAuthenticated, allowRoles()),
      demoThings: and(isAuthenticated, allowRoles()),
      developer: and(isAuthenticated, allowRoles()),
      developers: and(isAuthenticated, allowRoles()),
      domain: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      domains: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      event: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE', 'PHOTOGRAPHER', 'PROCESSOR'])),
      events: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE', 'PHOTOGRAPHER', 'PROCESSOR'])),
      getTopLevelDomainsPrice: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      me: isAuthenticated,
      mediaDocument: allowRoles(['AFFILIATE', 'AGENT']),
      mediaDocuments: allowRoles(['AFFILIATE', 'AGENT']),
      mediaInteractive: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      mediaInteractives: and(isAuthenticated, allowRoles(['AGENT', 'AFFILIATE'])),
      office: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      offices: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      officesConnection: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      order: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT'])),
      orderedServices: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT', 'PROCESSOR'])),
      orders: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT'])),
      ordersConnection: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT'])),
      ordersWithFlatennedServices: and(
        isAuthenticated,
        allowRoles(['AFFILIATE', 'AGENT', 'PHOTOGRAPHER', 'PROCESSOR'])
      ),
      ordersWithFlatennedServicesConnection: and(
        isAuthenticated,
        allowRoles(['AFFILIATE', 'AGENT', 'PHOTOGRAPHER', 'PROCESSOR'])
      ),
      orderWithFlatennedServices: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT', 'PHOTOGRAPHER', 'PROCESSOR'])),
      panorama: isAuthenticated,
      panoramas: isAuthenticated,
      photo: isAuthenticated,
      photographer: and(
        isAuthenticated,
        or(canManageOwnAccount('PHOTOGRAPHER'), allowRoles(['AFFILIATE', 'PHOTOGRAPHER']))
      ),
      photographers: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      photographersConnection: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      photos: isAuthenticated,
      processor: and(isAuthenticated, or(canManageOwnAccount('PROCESSOR'), allowRoles(['AFFILIATE', 'PROCESSOR']))),
      processors: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      processorsConnection: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      realEstate: isAuthenticated,
      realEstates: isAuthenticated,
      region: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      regions: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      serviceBasic: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      serviceCategories: and(isAuthenticated, allowRoles(['AFFILIATE'])),
      servicePackage: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT'])),
      servicePackages: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT'])),
      services: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT'])),
      servicesConnection: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT'])),
      servicesUIState: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT'])),
      tour: allow,
      tourBanner: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT'])),
      tourBanners: and(isAuthenticated, allowRoles(['AFFILIATE', 'AGENT'])),
      tourGallery: allow,
      tourGalleryConnection: allow,
      video: isAuthenticated,
      videos: isAuthenticated
    }
  },
  {
    fallbackError: (error: any) => {
      return error
    }
  }
)
