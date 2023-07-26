import * as GraphqlTypes from '#veewme/gen/graphqlTypes'
import { OrderedService as OrderedServicePrisma, prisma, RealEstateUpdateWithoutOrderIdsDataInput, Service } from '#veewme/gen/prisma'
import { GeoCoordinates, OrderedService as OrderedServiceType } from '#veewme/graphql/types'
import { Context, LatLng } from '#veewme/lib/types'
import { fixFloatAfterDigit, formatDate, formatTime, getStringAddressFromObject } from '#veewme/lib/util'
import { UserInputError } from 'apollo-server-express'
import { GraphQLResolveInfo } from 'graphql'
import { sendOrderActivationEmail } from '../email'
import { ResolversRequired } from '../graphqlServer'
import { normalizeSearch } from '../search'
import { getAffiliateIdForUser, getObjectOrError } from './utils'

/** Returns a string document used to search real estates. */
export const getRealEstateSearchDocument = (realEstate: GraphqlTypes.RealEstateCreateWithoutOrderInput) => {
  const values = [realEstate.city, realEstate.street, realEstate.country, realEstate.zip, realEstate.state]
  return normalizeSearch(values.join(' '))
}

// deprecated
const resolveOrderStatus = async (parent: Partial<GraphqlTypes.Order | GraphqlTypes.OrderWithFlatennedServices>): Promise<GraphqlTypes.OrderStatus> => {
  interface OrderFragment {
    serviceIds: OrderedServiceType[]
  }
  const fragment = `
  fragment OrderedService on OrderedService {
    serviceIds {
      id
      status
      photographerScheduledAt
      event {
        photographer {
          id
        }
      }
    }
  }
  `
  const orderObj = await prisma.order({ id: parent.id })
  if (!orderObj) {
    throw new Error(`Order not found: ${ parent.id }`)
  }
  const orderServicesData = await prisma.order({ id: parent.id }).$fragment<OrderFragment>(fragment)
  const services = orderServicesData.serviceIds

  const payments = await prisma.payments({ where: { order: { id: parent.id }, status: 'PAID' } })
  const paidAmount = payments.map((payment => payment.amount)).reduce(((a, b) => a + b), 0)

  const now = Date.now()

  if (!services) {
    console.log('No services assigned to this order!') // tslint:disable-line
  }
  if (!services.find((service: OrderedServiceType) => service.status === 'Pending')) {
    return 'Completed'
  } else if (services.find((service: OrderedServiceType) => !!(service.event && !service.event.photographer))) {
    return 'Unassigned'
  } else if (services.find((service: OrderedServiceType) => !!(service.event && service.event.photographer && service.event.start < now))) {
    return 'Overdue'
  } else if (paidAmount >= orderObj.price) {
    return 'Paid'
  } else if (services.find((service: OrderedServiceType) => !service.event)) {
    return 'Unscheduled'
  } else {
    return 'Scheduled'
  }
}

const resolveOrderStatuses = async (
  parent: Partial<GraphqlTypes.Order | GraphqlTypes.OrderWithFlatennedServices>
): Promise<GraphqlTypes.OrderStatus[]> => {
  const orderObj = await prisma.order({ id: parent.id })
  if (!orderObj) {
    return []
  }

  const statuses: GraphqlTypes.OrderStatus[] = []

  if (orderObj.statusPublished) {
    statuses.push('Published')
  } else {
    statuses.push('Unpublished')
  }

  if (orderObj.statusCompleted) {
    statuses.push('Completed')
  } else {
    statuses.push('Uncompleted')
  }

  if (orderObj.statusOverdue) {
    statuses.push('Overdue')
  } else {
    statuses.push('Due')
  }

  if (orderObj.statusScheduled) {
    statuses.push('Scheduled')
  } else {
    statuses.push('Unscheduled')
  }

  if (orderObj.statusPaid) {
    statuses.push('Paid')
  } else {
    statuses.push('Unpaid')
  }

  if (orderObj.statusMediaOnly) {
    statuses.push('MediaOnly')
  }
  return statuses
}

const resolveStatusToDisplay = async (
  parent: Partial<GraphqlTypes.Order | GraphqlTypes.OrderWithFlatennedServices>
): Promise<GraphqlTypes.OrderStatus | null> => {
  const orderObj = await prisma.order({ id: parent.id })
  if (!orderObj) {
    return null
  }
  if (orderObj.statusPublished) {
    return 'Published'
  }
  if (orderObj.statusCompleted) {
    return 'Completed'
  }
  if (orderObj.statusOverdue) {
    return 'Overdue'
  }
  if (!orderObj.statusScheduled) {
    return 'Unscheduled'
  }
  if (!orderObj.statusPaid) {
    return 'Unpaid'
  }
  if (orderObj.statusMediaOnly) {
    return 'MediaOnly'
  }
  // TODO: unhandled statuses
  // Unpublished
  // Uncompleted
  // Due
  // Scheduled
  // Paid
  return null
}

export const Order: ResolversRequired['Order'] = {
  date: async parent => {
    const createdAt = await prisma.order({ id: parent.id }).createdAt()
    const date = new Date(createdAt)
    return formatDate(date)
  },
  orderedFromAffiliate: parent => prisma.order({ id: parent.id }).orderedFromAffiliateId(),
  orderedFromAffiliateId: async parent => {
    const affiliate = await prisma.order({ id: parent.id }).orderedFromAffiliateId()
    return affiliate.id
  },
  payments: parent => prisma.order({ id: parent.id }).payments(),
  realEstate: parent => prisma.order({ id: parent.id }).realEstateId(),
  realEstateId: async parent => {
    const realEstate = await prisma.order({ id: parent.id }).realEstateId()
    return realEstate.id
  },
  serviceIds: async parent => {
    const orderedServicesList = await prisma.order({ id: parent.id }).serviceIds()
    return orderedServicesList.map(service => service.id)
  },
  servicePackages: async parent => {
    const orderedServicesIds = (await prisma.order({ id: parent.id }).serviceIds()).map(obj => obj.id)
    return prisma.servicePackages({ where: { orderedServicesIds_some: { id_in: orderedServicesIds } } })
  },
  services: parent => prisma.order({ id: parent.id }).serviceIds(),
  status: parent => resolveOrderStatus(parent),
  statuses: parent => resolveOrderStatuses(parent),
  statusToDisplay: parent => resolveStatusToDisplay(parent),
  thumb: parent => prisma.order({ id: parent.id }).thumb(),
  time: async parent => {
    const createdAt = await prisma.order({ id: parent.id }).createdAt()
    const date = new Date(createdAt)
    return formatTime(date)
  }
}

export const OrderWithFlatennedServices: ResolversRequired['OrderWithFlatennedServices'] = {
  date: async parent => {
    const createdAt = await prisma.order({ id: parent.id }).createdAt()
    const date = new Date(createdAt)
    return formatDate(date)
  },
  orderedFromAffiliate: parent => prisma.order({ id: parent.id }).orderedFromAffiliateId(),
  orderedFromAffiliateId: async parent => {
    const affiliate = await prisma.order({ id: parent.id }).orderedFromAffiliateId()
    return affiliate.id
  },
  payments: parent => prisma.order({ id: parent.id }).payments(),
  realEstate: parent => prisma.order({ id: parent.id }).realEstateId(),
  realEstateId: async parent => {
    const realEstate = await prisma.order({ id: parent.id }).realEstateId()
    return realEstate.id
  },
  serviceIds: async parent => {
    const services = await prisma.order({ id: parent.id }).serviceIds()
    return services.map((service: OrderedServicePrisma) => service.id)
  },
  services: (parent, args, context) => {
    const whereServices: GraphqlTypes.OrderedServiceWhereInput = {}
    if (context.role === 'PHOTOGRAPHER' && whereServices.event) {
      whereServices.event.photographer = { id: context.accountId }
    }
    if (context.role === 'PROCESSOR') {
      whereServices.processorId = { id: context.accountId }
    }
    return prisma.order({ id: parent.id }).serviceIds({ where: whereServices })
  },
  status: parent => resolveOrderStatus(parent),
  statuses: parent => resolveOrderStatuses(parent),
  statusToDisplay: parent => resolveStatusToDisplay(parent),
  thumb: parent => prisma.order({ id: parent.id }).thumb(),
  time: async parent => {
    const createdAt = await prisma.order({ id: parent.id }).createdAt()
    const date = new Date(createdAt)
    return formatTime(date)
  }
}

export const OrderedService: ResolversRequired['OrderedService'] = {
  event: parent => prisma.orderedService({ id: parent.id }).event(),
  includedInPackage: parent => prisma.orderedService({ id: parent.id }).includedInPackageId(),
  includedInPackageId: async parent => {
    const includedInPackage = await prisma.orderedService({ id: parent.id }).includedInPackageId()
    return includedInPackage ? includedInPackage.id : null
  },
  order: parent => prisma.orderedService({ id: parent.id }).orderId(),
  orderId: async parent => {
    const resolverOrder = await prisma.orderedService({ id: parent.id }).orderId()
    return resolverOrder.id
  },
  processor: parent => prisma.orderedService({ id: parent.id }).processorId(),
  processorId: async parent => {
    const processor = await prisma.orderedService({ id: parent.id }).processorId()
    return processor ? processor.id : null
  },
  promoCode: parent => prisma.orderedService({ id: parent.id }).promoCodeId(),
  promoCodeId: async parent => {
    const promoCode = await prisma.orderedService({ id: parent.id }).promoCodeId()
    return promoCode ? promoCode.id : null
  },
  service: parent => prisma.orderedService({ id: parent.id }).serviceId(),
  serviceId: async parent => {
    const service = await prisma.orderedService({ id: parent.id }).serviceId()
    return service.id
  }
}

const filterByMedia = (media: string | null | undefined, where: GraphqlTypes.OrderWhereInput) => {
  if (media) {
    if (media === 'VIDEO_ALL') {
      where.realEstateId = { AND: [{ videos_some: {} }, where.realEstateId || {}] }
    }
    if (media === 'VIDEO_FAUX') {
      where.realEstateId = { AND: [{ videos_some: { type: 'Faux' } }, where.realEstateId || {}] }
    }
    if (media === 'VIDEO_HOSTED') {
      where.realEstateId = { AND: [{ videos_some: { type: 'Hosted' } }, where.realEstateId || {}] }
    }
    if (media === 'INTERACTIVE_ALL') {
      where.realEstateId = { AND: [{ mediaInteractives_some: {} }, where.realEstateId || {}] }
    }
    if (media === 'INTERACTIVE_FLOOR_PLAN_PHOTOS') {
      where.realEstateId = { AND: [{ mediaInteractives_some: { type: 'FLOORPLAN_PHOTOS' } }, where.realEstateId || {}] }
    }
    if (media === 'EMBEDDED') {
      where.realEstateId = { AND: [{ mediaInteractives_some: { type: 'EMBEDDED' } }, where.realEstateId || {}] }
    }
    if (media === 'PANORAMA') {
      where.realEstateId = { AND: [{ panoramas_some: {} }, where.realEstateId || {}] }
    }
  }
}

const getOrdersArgs = (args: GraphqlTypes.QueryOrdersArgs, context: Context): any => {
  const { search, ...newArgs } = args
  const where: GraphqlTypes.OrderWhereInput = { ...args.where }

  if (context.role === 'AFFILIATE') {
    where.orderedFromAffiliateId = { id: context.accountId }
  }
  if (context.role === 'AGENT') {
    const agentId = context.accountId
    where.realEstateId = {
      OR: [
        { agentPrimaryId: { id: agentId } },
        { agentCoListingId: { id: agentId } }
      ]
    }
  }
  if (context.role === 'PROCESSOR') {
    where.serviceIds_some = { processorId: { id: context.accountId } }
  }
  if (context.role === 'PHOTOGRAPHER') {
    where.serviceIds_some = { event: { photographer: { id: context.accountId } } }
  }

  if (args.search) {
    // First try to parse search phrase to a number and search by order ID.
    let orderId
    try {
      orderId = parseInt(args.search, 10)
    } catch {
      orderId = null
    }

    if (orderId && !where.id) {
      where.id = orderId
    } else {
      // Otherwise try to search by address.
      const searchPhrase = normalizeSearch(args.search)
      if (where.realEstateId) {
        where.realEstateId.searchDocument_contains = searchPhrase
      } else {
        where.realEstateId = { searchDocument_contains: searchPhrase }
      }
    }
  }

  // Handle media filter
  const { media } = where
  delete where.media
  filterByMedia(media, where)

  newArgs.where = where
  return newArgs
}

export const ordersByRole = async <T>(
  args: GraphqlTypes.QueryOrdersArgs,
  context: Context,
  info: GraphQLResolveInfo | string | undefined = undefined
): Promise<T[]> => {
  const newArgs = getOrdersArgs(args, context)
  const orderBy: GraphqlTypes.OrderOrderByInput = args.orderBy || 'createdAt_DESC'
  return context.prismaBinding.query.orders({ orderBy, ...newArgs }, info)
}
const fetchCoordinates = async (address: string): Promise<LatLng> => {
  const encodedAddress = encodeURIComponent(address)
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  const response = await fetch(apiUrl)
  const data = await response.json()
  if (data.status !== 'OK') {
    throw new Error(`Failed to get coordinates. ${data.error_message}`)
  }
  return data.results[0].geometry.location
}
export const coordinates: ResolversRequired['Mutation']['coordinates'] = async (_, args): Promise<GeoCoordinates> => {
  const coords = await fetchCoordinates(args.address)
  return { latitude: coords.lat, longitude: coords.lng }
}

export const order: ResolversRequired['Query']['order'] = (_, args, context, info) => {
  return getObjectOrError<GraphqlTypes.Order>(
    ordersByRole<GraphqlTypes.Order>({ where: { id: args.where.id } }, context, info)
  )
}

export const orders: ResolversRequired['Query']['orders'] = async (_, args, context, info) => {
  return ordersByRole<GraphqlTypes.Order>(args, context, info)
}

export const ordersConnection: ResolversRequired['Query']['ordersConnection'] = async (_, args, context, _info) => {
  const newArgs = getOrdersArgs(args, context)
  const totalCount = await prisma.ordersConnection({ where: newArgs.where }).aggregate().count()
  const ordersList = await ordersByRole<GraphqlTypes.Order>(args, context)
  return { orders: ordersList, totalCount }
}

export const orderWithFlatennedServices: ResolversRequired['Query']['orderWithFlatennedServices'] = (_, args, context, info) => {
  return getObjectOrError<GraphqlTypes.OrderWithFlatennedServices>(
    ordersByRole<GraphqlTypes.OrderWithFlatennedServices>({ where: { id: args.where.id } }, context, info)
  )
}

export const ordersWithFlatennedServices: ResolversRequired['Query']['ordersWithFlatennedServices'] = async (_, args, context, info) => {
  return ordersByRole<GraphqlTypes.OrderWithFlatennedServices>(args, context, info)
}

export const ordersWithFlatennedServicesConnection: ResolversRequired['Query']['ordersWithFlatennedServicesConnection'] = async (
  _,
  args,
  context
) => {
  const newArgs = getOrdersArgs(args, context)
  const totalCount = await prisma
    .ordersConnection({ where: newArgs.where })
    .aggregate()
    .count()
  const ordersList = await ordersByRole<GraphqlTypes.OrderWithFlatennedServices>(args, context)
  return { orders: ordersList, totalCount }
}

const getOrderedServicesArgs = (args: GraphqlTypes.QueryOrderedServicesArgs, context: Context): any => {
  const { ...newArgs } = args
  const where: GraphqlTypes.OrderedServiceWhereInput = { ...args.where }
  let query
  if (context.role === 'AFFILIATE') {
    query = { orderedFromAffiliateId: { id: context.accountId } }
  }
  if (context.role === 'AGENT') {
    const agentId = context.accountId
    query = {
      realEstateId: {
        OR: [
          { agentPrimaryId: { id: agentId } },
          { agentCoListingId: { id: agentId } }
        ]
      }
    }
  }
  if (context.role === 'PHOTOGRAPHER') {
    query = { serviceIds_some: { event: { photographer: { id: context.accountId } } } }
  }

  if (query) {
    where.orderId = where.orderId ? { AND: [ where.orderId, query ] } : query
  }

  if (context.role === 'PROCESSOR') {
    where.orderId = undefined
    where.processorId = { id: context.accountId }
  }
  if (args.search) {
    // First try to parse search phrase to a number and search by order ID.
    let orderId
    try {
      orderId = parseInt(args.search, 10)
    } catch {
      orderId = null
    }

    if (orderId && !where.orderId) {
      where.orderId = { id: orderId }
    } else {
      // Otherwise try to search by address.
      const searchPhrase = normalizeSearch(args.search)
      where.orderId = { AND: [ where.orderId || {}, { realEstateId: { searchDocument_contains: searchPhrase } } ] }
    }
  }
  newArgs.where = where
  return newArgs
}

export const orderedServicesByRole = async <T>(
  args: GraphqlTypes.QueryOrderedServicesArgs,
  context: Context,
  info: GraphQLResolveInfo | string | undefined = undefined
): Promise<T[]> => {
  const newArgs = getOrderedServicesArgs(args, context)
  const orderBy: GraphqlTypes.OrderedServiceOrderByInput = args.orderBy || 'createdAt_DESC'
  return context.prismaBinding.query.orderedServices({ orderBy, ...newArgs }, info)
}

export const orderedServices: ResolversRequired['Query']['orderedServices'] = async (_, args, context, info) => {
  return orderedServicesByRole<GraphqlTypes.OrderedService>(args, context, info)
}

export const orderedServicesConnection: ResolversRequired['Query']['orderedServicesConnection'] = async (_, args, context, _info) => {
  const newArgs = getOrderedServicesArgs(args, context)
  const totalCount = await prisma.orderedServicesConnection({ where: newArgs.where }).aggregate().count()
  const servicesList = await orderedServicesByRole<GraphqlTypes.OrderedService>(args, context)
  return { orderedServices: servicesList, totalCount }
}

const getShootDate = (
  prefferedShootDate: string
): Date | undefined => {
  let shootDate: Date | undefined
  if (prefferedShootDate) {
    shootDate = new Date(prefferedShootDate)
  }
  return shootDate
}

export const createOrder: ResolversRequired['Mutation']['createOrder'] = async (_, args, context) => {
  const {
    prefferedShootDate,
    realEstate: { tour, ...realEstate },
    serviceIds,
    servicePackageId,
    ...data
  } = args.data
  const address = getStringAddressFromObject(realEstate)
  const coords = await fetchCoordinates(address)
  const affiliateId = await getAffiliateIdForUser(context)
  const shootDate = getShootDate(prefferedShootDate)

  const serviceQuery = `
  {
    id
    mediaOnly
    price
    processorId {
      id
    }
  }
  `
  const services = serviceIds.length > 0
    ? await context.prismaBinding.query.services({ where: { id_in: serviceIds } }, serviceQuery)
    : []

  const servicePackage =
    servicePackageId &&
    (await context.prismaBinding.query.servicePackage(
      { where: { id: servicePackageId } },
      `{
        id
        mediaOnly
        price
        services: serviceIds {
          id
          price
          mediaOnly
          processorId {
            id
          }
        }
        processorId {
          id
        }
      }`
    ))

  interface OrderedServiceData {
    id: number
    mediaOnly: boolean,
    processorId: number
    servicePackageId: number
  }

  const prices: number[] = services.map(({ price }: Service) => price) || []

  let orderedServiceData: OrderedServiceData[] = services.map(
    (service: any) => ({
      id: service.id,
      mediaOnly: service.mediaOnly,
      processorId: service.processorId ? service.processorId.id : undefined
    })
  )

  if (servicePackage) {
    prices.push(servicePackage.price)
    orderedServiceData = orderedServiceData.concat(
      servicePackage.services.map(
        (service: any) => ({
          id: service.id,
          mediaOnly: service.mediaOnly,
          processorId: service.processorId ? service.processorId.id : undefined,
          servicePackageId: servicePackage.id
        })
      )
    )
  }

  if (orderedServiceData.length === 0) {
    throw new Error('At least one service must be ordered.')
  }

  const mediaOnlyAll = orderedServiceData.map(item => item.mediaOnly)
  if (servicePackage) {
    mediaOnlyAll.push(servicePackage.mediaOnly)
  }
  const isOrderMediaOnly = mediaOnlyAll.every(item => item === true)

  if (!affiliateId) {
    throw new UserInputError('Failed to get the related affiliate account.')
  }

  return prisma.createOrder({
    ...data,
    orderedFromAffiliateId: { connect: { id: affiliateId } },
    prefferedShootTime: shootDate,
    price: fixFloatAfterDigit(prices.reduce((totalPrice, price) => (totalPrice += price), 0)),
    realEstateId: {
      create: {
        ...realEstate,
        agentCoListingId: realEstate.agentCoListingId ? { connect: { id: realEstate.agentCoListingId } } : undefined,
        agentPrimaryId: { connect: { id: realEstate.agentPrimaryId } },
        amenities: { set: realEstate.amenities },
        customLatitude: realEstate.customLatitude || coords.lat,
        customLongitude: realEstate.customLongitude || coords.lng,
        latitude: coords.lat,
        longitude: coords.lng,
        searchDocument: getRealEstateSearchDocument(realEstate),
        tourId: tour ? { create: tour } : undefined
      }
    },
    serviceIds: {
      create: orderedServiceData.map(serviceDataItem => ({
        includedInPackageId: serviceDataItem.servicePackageId ? { connect: { id: serviceDataItem.servicePackageId } } : {},
        processorId: serviceDataItem.processorId ? { connect: { id: serviceDataItem.processorId } } : undefined,
        serviceId: { connect: { id: serviceDataItem.id } }
      }))
    },
    statusMediaOnly: isOrderMediaOnly
  })
}

export const activateOrder: ResolversRequired['Mutation']['activateOrder'] = async (_, args, context, info) => {
  const orderObj = await getObjectOrError<GraphqlTypes.Order>(
    ordersByRole<GraphqlTypes.Order>({ where: { id: args.where.id } }, context, info)
  )
  // TODO: Add validation to check if order is in "TODO" status; only this status can be activated
  // TODO: store "activated" status in DB
  // TODO: handle ON_DELIVERY payment flow
  const agentPrimary = await prisma.order({ id: orderObj.id }).realEstateId().agentPrimaryId().user()
  const agentSecondary = await prisma.order({ id: orderObj.id }).realEstateId().agentCoListingId().user()
  if (agentPrimary) {
    await sendOrderActivationEmail(agentPrimary.email)
  }
  if (agentSecondary) {
    await sendOrderActivationEmail(agentSecondary.email)
  }

  // Change payment statusPaid to true if payment was COMPANY_PAY type.
  const payments = await prisma.order({ id: orderObj.id }).payments()
  if (payments && payments[0].type === 'COMPANY_PAY') {
    await prisma.updateOrder({ where: { id: orderObj.id }, data: { statusPaid: true } })
  }
  return orderObj
}

export const updateOrder: ResolversRequired['Mutation']['updateOrder'] = async (_, args, context, info) => {
  await getObjectOrError<GraphqlTypes.Order>(
    ordersByRole<GraphqlTypes.Order>({ where: { id: args.where.id } }, context, info)
  )
  const { prefferedShootDate, realEstate, orderedFromAffiliateId, serviceIds, ...data } = args.data

  const shootDate = getShootDate(prefferedShootDate)

  let realEstateUpdate: RealEstateUpdateWithoutOrderIdsDataInput = {}
  if (realEstate) {
    const address = getStringAddressFromObject(realEstate)
    const coords = await fetchCoordinates(address)
    const { agentCoListingId, agentPrimaryId, amenities, tour, ...realEstateData } = realEstate
    realEstateUpdate = {
      latitude: coords.lat,
      longitude: coords.lng,
      ...realEstateData,
      ...(agentCoListingId && { agentCoListingId: { connect: { id: agentCoListingId } } }),
      ...(agentPrimaryId && { agentPrimaryId: { connect: { id: agentPrimaryId } } }),
      ...(amenities && { amenities: { set: amenities } }),
      ...(tour && { tourId: { update: { ...tour } } })
    }
  }

  return prisma.updateOrder({
    data: {
      ...data,
      prefferedShootTime: shootDate,
      realEstateId: { update: { ...realEstateUpdate } },
      ...(orderedFromAffiliateId && { orderedFromAffiliateId: { connect: { id: orderedFromAffiliateId } } })
    },
    where: { id: args.where.id }
  })
}

export const deleteOrder: ResolversRequired['Mutation']['deleteOrder'] = async (_, args, context, info) => {
  const orderObj = await getObjectOrError<GraphqlTypes.Order>(
    ordersByRole<GraphqlTypes.Order>({ where: { id: args.where.id } }, context, info)
  )
  if (orderObj) {
    await prisma.deleteManyOrderedServices({ orderId: { id: args.where.id } })
    return prisma.deleteOrder({ id: args.where.id })
  }
  throw new UserInputError(`Order ${args.where.id} does not exists or you have no access.`)
}

export const updateOrderedService: ResolversRequired['Mutation']['updateOrderedService'] = async (_, args, context) => {
  const orderedServiceObj = await context.prismaBinding.query.orderedService(
    { where: { id: args.where.id } },
    `{ id orderId { id } }`
  )
  if (!orderedServiceObj) {
    throw new UserInputError(`Ordered service not found: ${args.where.id}`)
  }

  // Try to get the order to check if the requestor owns it, thus can edit the ordered service.
  const orderId = orderedServiceObj.orderId.id
  await getObjectOrError(ordersByRole({ where: { id: orderId } }, context))

  const { message, processorId } = args.data

  return prisma.updateOrderedService({
    data: {
      message,
      processorId:
        processorId === null ? { disconnect: true } : processorId ? { connect: { id: processorId } } : undefined
    },
    where: { id: args.where.id }
  })
}

export const acceptOrderedServices: ResolversRequired['Mutation']['acceptOrderedServices'] = async (
  _,
  args,
  context,
  info
) => {
  const orderId = args.where.id
  const orderObj = await getObjectOrError<GraphqlTypes.Order>(
    ordersByRole<GraphqlTypes.Order>({ where: { id: orderId } }, context, info)
  )
  if (orderObj) {
    await prisma.updateManyOrderedServices({
      data: { status: 'Completed' },
      where: { id_in: args.ids, orderId: { id: orderId } }
    })
    const orderedServicesList = await prisma.orderedServices({ where: { id_in: args.ids, orderId: { id: orderId } } })
    const statuses = orderedServicesList.map(obj => obj.status)
    if (statuses.length && statuses.every(status => status === 'Completed')) {
      // If all ordered services are completed, mark the order as completed.
      await prisma.updateOrder({ data: { statusCompleted: true }, where: { id: orderId } })
    }
  }
  return orderObj
}

export const publishOrder: ResolversRequired['Mutation']['publishOrder'] = async (_, args, context) => {
  const orderObj = await getObjectOrError<GraphqlTypes.Order>(
    ordersByRole<GraphqlTypes.Order>({ where: { id: args.where.id } }, context)
  )
  if (orderObj) {
    await prisma.updateOrder({ data: { statusPublished: true }, where: { id: args.where.id } })
  }
  return orderObj
}
