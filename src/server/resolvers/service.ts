import * as GraphqlTypes from '#veewme/gen/graphqlTypes'
import * as PrismaTypes from '#veewme/gen/prisma'
import {
  prisma,
  ServiceCreateInput,
  ServiceFeeAdjustedByRegion as ServiceFeeAdjustedByRegionType,
  ServiceFeeAdjustedByRegionUpdateManyWithoutServiceIdInput,
  ServiceFeeAdjustedByRegionUpdateManyWithoutServicePackageIdInput,
  ServicePackageCreateInput,
  ServicePackageUpdateInput,
  ServicePackageWhereUniqueInput,
  ServiceUpdateInput,
  ServiceWhereUniqueInput
} from '#veewme/gen/prisma'
import {
  Maybe,
  MutationUpdateServiceBasicArgs,
  MutationUpdateServicePackageArgs,
  ServiceBasicCreateInput,
  ServiceFeeAdjustedByRegionUpdateInput,
  ServicePackageCreateInput as ServicePackageCreateMutationInput,
  ServicePackageFeeAdjustedByRegionUpdateInput,
  WhereIdUniqueInput
} from '#veewme/graphql/types'
import { Context } from '#veewme/lib/types'
import { ForbiddenError, UserInputError } from 'apollo-server-express'
import { GraphQLResolveInfo } from 'graphql'
import { saveFileToStorage, unlink } from '../../lib/storage'
import { ResolversRequired } from '../graphqlServer'
import { normalizeSearch } from '../search'
import { buildRemotePathForService, getAffiliateIdForUser, getObjectOrError } from './utils'

export const Service: ResolversRequired['Service'] = {
  category: parent => prisma.service({ id: parent.id }).categoryId(),
  categoryId: async parent => {
    const category = await prisma.service({ id: parent.id }).categoryId()
    return category ? category.id : null
  },
  categoryLabel: async parent => {
    const category = await prisma.service({ id: parent.id }).categoryId()
    return category ? category.label : ''
  },
  orderNotifyEmails: parent => prisma.service({ id: parent.id }).orderNotifyEmails(),
  owner: parent => prisma.service({ id: parent.id }).ownerId(),
  ownerId: async parent => {
    const s = await prisma.service({ id: parent.id }).ownerId()
    return s.id
  },
  packageIds: async parent => {
    const s = await prisma.service({ id: parent.id }).packageIds()
    return s.map(({ id }) => id)
  },
  packages: parent => prisma.service({ id: parent.id }).packageIds(),
  processor: parent => prisma.service({ id: parent.id }).processorId(),
  processorId: async parent => {
    const s = await prisma.service({ id: parent.id }).processorId()
    return s ? s.id : null
  },
  regionFeeAdjustedIds: async parent => {
    const s = await prisma.service({ id: parent.id }).regionFeeAdjustedIds()
    return s.map(({ id }) => id)
  },
  regionFeesAdjusted: parent => prisma.service({ id: parent.id }).regionFeeAdjustedIds(),
  serviceImage: parent => prisma.service({ id: parent.id }).serviceImageId(),
  serviceImageId: async parent => {
    const s = await prisma.service({ id: parent.id }).serviceImageId()
    return s ? s.id : null
  },
  tourNotifyEmails: parent => prisma.service({ id: parent.id }).tourNotifyEmails()
}

export const ServiceCategoryState: ResolversRequired['ServiceCategoryState'] = {
  category: parent => prisma.serviceUIState({ id: parent.id }).categoryId()
}

export const ServiceCategory: ResolversRequired['ServiceCategory'] = {
  color: parent => prisma.serviceCategory({ id: parent.id }).color()
}

export const ServiceFeeAdjustedByRegion: ResolversRequired['ServiceFeeAdjustedByRegion'] = {
  region: parent => prisma.serviceFeeAdjustedByRegion({ id: parent.id }).regionId(),
  regionId: async parent => {
    const r = await prisma.serviceFeeAdjustedByRegion({ id: parent.id }).regionId()
    return r.id
  }
}

export const ServicePackageFeeAdjustedByRegion: ResolversRequired['ServicePackageFeeAdjustedByRegion'] = {
  region: parent => prisma.serviceFeeAdjustedByRegion({ id: parent.id }).regionId(),
  regionId: async parent => {
    const r = await prisma.serviceFeeAdjustedByRegion({ id: parent.id }).regionId()
    return r.id
  }
}

export const ServicePackage: ResolversRequired['ServicePackage'] = {
  owner: parent => prisma.servicePackage({ id: parent.id }).ownerId(),
  ownerId: async parent => {
    const s = await prisma.servicePackage({ id: parent.id }).ownerId()
    return s.id
  },
  processor: parent => prisma.servicePackage({ id: parent.id }).processorId(),
  processorId: async parent => {
    const s = await prisma.servicePackage({ id: parent.id }).processorId()
    return s ? s.id : null
  },
  regionFeeAdjustedIds: async parent => {
    const s = await prisma.servicePackage({ id: parent.id }).regionFeeAdjustedIds()
    return s.map(({ id }) => id)
  },
  regionFeesAdjusted: parent => prisma.servicePackage({ id: parent.id }).regionFeeAdjustedIds(),
  serviceIds: async parent => {
    const s = await prisma.servicePackage({ id: parent.id }).serviceIds({ where: { archivised: false } })
    return s.map(({ id }) => id)
  },
  services: parent => prisma.servicePackage({ id: parent.id }).serviceIds({ where: { archivised: false } }),
  totalPrice: async parent => {
    const includedServices = await prisma.servicePackage({ id: parent.id }).serviceIds()
    const denominator = 100
    return Math.round(includedServices.reduce((totalPrice, { price }) => totalPrice += price, 0) * denominator) / denominator
  }
}

const getServicesArgs = async (args: GraphqlTypes.QueryServicesArgs, context: Context): Promise<any> => {
  const { search, ...newArgs } = args
  const where: GraphqlTypes.ServiceWhereInput = { ...args.where }
  if (context.role === 'AFFILIATE') {
    where.ownerId = { id: context.accountId }
  }
  if (context.role === 'AGENT') {
    const agentQuery = `{ id affiliate { id } }`
    const { affiliate: { id: affiliateId } } = await context.prismaBinding.query.agent(
      { where: { id: context.accountId } },
      agentQuery
    )
    where.ownerId = { id: affiliateId }
  }
  if (args.search && !where.name) {
    where.name_contains = normalizeSearch(args.search)
  }
  newArgs.where = where
  return newArgs
}

const servicesByRole = async (
  args: GraphqlTypes.QueryServicesArgs,
  context: Context,
  info: GraphQLResolveInfo | string | undefined = undefined
): Promise<GraphqlTypes.Service[]> => {
  const newArgs = await getServicesArgs(args, context)
  return context.prismaBinding.query.services({ orderBy: 'sortOrder_ASC', ...newArgs }, info)
}

const servicePackagesByRole = async (
  argsWhere: GraphqlTypes.ServicePackageWhereInput,
  context: Context,
  info: GraphQLResolveInfo | string
): Promise<GraphqlTypes.ServicePackage[]> => {
  const where: GraphqlTypes.ServicePackageWhereInput = { ...argsWhere }
  if (context.role === 'AFFILIATE') {
    where.ownerId = { id: context.accountId }
  }
  if (context.role === 'AGENT') {
    const agentQuery = `{ id affiliate { id } }`
    const { affiliate: { id: affiliateId } } = await context.prismaBinding.query.agent(
      { where: { id: context.accountId } },
      agentQuery
    )
    where.ownerId = { id: affiliateId }
  }
  return context.prismaBinding.query.servicePackages({ where, orderBy: 'sortOrder_ASC' }, info)
}

/** Get new service order within given ServiceCategory and ServiceType */
const _getNewServiceSortOrder = async (
  categoryId: number,
  serviceType: PrismaTypes.ServiceType,
  context: Context,
  info: GraphQLResolveInfo | string
) => {
  const currentServices = await servicesByRole({ where: { categoryId: { id: categoryId }, serviceType } }, context, info)
  return currentServices.length
}

/** Get new service package order */
const _getNewServicePackageSortOrder = async (context: Context, info: GraphQLResolveInfo | string) => {
  const currentServicePackages = await servicePackagesByRole({}, context, info)
  return currentServicePackages.length
}

export const createService: ResolversRequired['Mutation']['createService'] = async (obj, { data: initialData }, context, info) => {
  const { serviceType, ...data } = initialData
  if (serviceType === 'Package') {
    if (!data.serviceIds.length) {
      throw new Error('At least one service should be added to a package.')
    }
    data.categoryId && delete data.categoryId
    data.defaultCompensation && delete data.defaultCompensation
    data.link && delete data.link
    data.serviceImage && delete data.serviceImage
    const servicePackageInput = convertToServicePackageCreateInput(data, context)
    servicePackageInput.sortOrder = await _getNewServicePackageSortOrder(context, info)
    return prisma.createServicePackage(servicePackageInput)
  } else {
    if (!data.categoryId || !data.defaultCompensation) {
      throw new Error('Service needs to be assigned to a category.')
    }
    const service = await convertToServiceCreateInput({ ...data, serviceType }, context)
    if (data.categoryId) {
      service.sortOrder = await _getNewServiceSortOrder(data.categoryId, serviceType, context, info)
    }
    return prisma.createService(service)
  }
}

export const createServiceBasic: ResolversRequired['Mutation']['createServiceBasic'] = async (_, { data }, context, info) => {
  const service = await convertToServiceCreateInput(data, context)
  if (data.categoryId) {
    service.sortOrder = await _getNewServiceSortOrder(data.categoryId, data.serviceType, context, info)
  }
  return prisma.createService(service)
}

export const createServicePackage: ResolversRequired['Mutation']['createServicePackage'] = async (obj, { data }, context, info) => {
  const servicePackageInput = convertToServicePackageCreateInput(data, context)
  servicePackageInput.sortOrder = await _getNewServicePackageSortOrder(context, info)
  return prisma.createServicePackage(servicePackageInput)
}

export const deleteService: ResolversRequired['Mutation']['deleteService'] = async (_, args, context, info) => {
  const serviceObj = await getObjectOrError<GraphqlTypes.Service>(
    servicesByRole(args, context, info)
  )
  if (!serviceObj) throw new UserInputError('Service does not exist')
  const fileObj = await prisma.service({ id: args.where.id }).serviceImageId()
  if (fileObj) {
    unlink(fileObj.path)
  }
  return prisma.deleteService({ id: serviceObj.id })
}

export const deleteServicePackage: ResolversRequired['Mutation']['deleteServicePackage'] = async (_, args, context, info) => {
  const servicePackageObj = await getObjectOrError<GraphqlTypes.ServicePackage>(
    servicePackagesByRole(args.where, context, info)
  )
  return prisma.deleteService({ id: servicePackageObj.id })
}

export const archiveService: ResolversRequired['Mutation']['archiveService'] = async (_, args, context, info) => {
  const serviceObj = await getObjectOrError<GraphqlTypes.Service>(
    servicesByRole(args, context, info)
  )
  const serviceToArchive = await prisma.service({ id: serviceObj.id })
  if (serviceToArchive && serviceToArchive.archivised) {
    throw new Error('Service has already been sent to archive.')
  }
  return prisma.updateService({ data: { archivised: true }, where: { id: serviceObj.id } })
}

export const archiveServicePackage: ResolversRequired['Mutation']['archiveServicePackage'] = async (_, args, context, info) => {
  const servicePackageObj = await getObjectOrError<GraphqlTypes.ServicePackage>(
    servicePackagesByRole(args.where, context, info)
  )
  const serviceToArchive = await prisma.servicePackage({ id: servicePackageObj.id })
  if (serviceToArchive && serviceToArchive.archivised) {
    throw new Error('Service package has already been sent to archive.')
  }
  return prisma.updateServicePackage({ data: { archivised: true }, where: { id: servicePackageObj.id } })
}

export const updateService: ResolversRequired['Mutation']['updateService'] = async (obj, args, context, info) => {
  const { serviceType, ...data } = args.data
  if (serviceType === 'Package') {
    const currentPackage = await prisma.servicePackage(args.where)
    if (!currentPackage) {
      throw new Error('There\'s no Service Package with such id')
    }
    data.categoryId && delete data.categoryId
    data.defaultCompensation && delete data.defaultCompensation
    data.link && delete data.link
    data.serviceImage && delete data.serviceImage
    const packageInput = await convertToUpdateServicePackage({ data, where: args.where }, context)
    return prisma.updateServicePackage(packageInput)
  } else {
    const currentService = await prisma.service(args.where)
    if (!currentService) {
      throw new Error('There\'s no Service with such id')
    }
    data.serviceIds && delete data.serviceIds
    const serviceInput = await convertToUpdateService({ data, where: args.where }, context)
    return prisma.updateService(serviceInput)
  }
}

export const updateServiceBasic: ResolversRequired['Mutation']['updateServiceBasic'] = async (_, args, context, info) => {
  const serviceObj = await getObjectOrError<GraphqlTypes.Service>(
    servicesByRole(args, context, info)
  )
  const { data } = await convertToUpdateService(args, context)
  return prisma.updateService({ data, where: { id: serviceObj.id } })
}

export const updateServicePackage: ResolversRequired['Mutation']['updateServicePackage'] = async (_, args, context, info) => {
  const servicePackageObj = await getObjectOrError<GraphqlTypes.ServicePackage>(
    servicePackagesByRole(args.where, context, info)
  )
  const { data } = await convertToUpdateServicePackage(args, context)
  return prisma.updateServicePackage({ data, where: { id: servicePackageObj.id } })
}

export const reorderServices: ResolversRequired['Mutation']['reorderServices'] = async (_, args, context, info) => {
  const serviceObjs = await servicesByRole({ where: { id_in: args.ids } }, context, info)
  if (serviceObjs.length !== args.ids.length) {
    const foundIds = serviceObjs.map(obj => obj.id)
    const notFoundIds = args.ids.filter(id => !foundIds.includes(id))
    throw new UserInputError(`Services not found: ${notFoundIds.join(', ')}`)
  }

  const results: PrismaTypes.Service[] = []
  for (const [index, id] of args.ids.entries()) {
    const updatedService = await prisma.updateService({
      data: { sortOrder: index },
      where: { id }
    })
    results.push(updatedService)
  }
  return results
}

export const reorderServicePackages: ResolversRequired['Mutation']['reorderServicePackages'] = async (_, args, context, info) => {
  const servicePackageObjs = await servicePackagesByRole({ id_in: args.ids }, context, info)
  if (servicePackageObjs.length !== args.ids.length) {
    const foundIds = servicePackageObjs.map(obj => obj.id)
    const notFoundIds = args.ids.filter(id => !foundIds.includes(id))
    throw new UserInputError(`Service packages not found: ${notFoundIds.join(', ')}`)
  }

  const results: PrismaTypes.ServicePackage[] = []
  for (const [index, id] of args.ids.entries()) {
    const updatedServicePackage = await prisma.updateServicePackage({
      data: { sortOrder: index },
      where: { id }
    })
    results.push(updatedServicePackage)
  }
  return results
}

export const archivedServicePackages: ResolversRequired['Query']['archivedServicePackages'] = (_, args, context, info) => {
  const where: GraphqlTypes.ServiceWhereInput = { ...args.where, archivised: true }
  return servicePackagesByRole(where, context, info)
}

export const archivedServices: ResolversRequired['Query']['archivedServices'] = (_, args, context, info) => {
  args.where = { ...args.where, archivised: true }
  return servicesByRole(args, context, info)
}

export const serviceBasic: ResolversRequired['Query']['serviceBasic'] = async (_, args, context, info) => {
  if (args.where.id) {
    return (await servicesByRole(args, context, info))[0]
  }
  return null
}

export const serviceCategories: ResolversRequired['Query']['serviceCategories'] = async (_, args, context) => {
  return prisma.serviceCategories({
    orderBy: 'orderIndex_ASC'
  })
}

export const servicePackage: ResolversRequired['Query']['servicePackage'] = async (_, args, context, info) => {
  if (args.where.id) {
    return (await servicePackagesByRole(args.where, context, info))[0]
  }
  return null
}

export const servicePackages: ResolversRequired['Query']['servicePackages'] = (_, args, context, info) => {
  const where: GraphqlTypes.ServicePackageWhereInput = { ...args.where, archivised: false }
  return servicePackagesByRole(where, context, info)
}

export const services: ResolversRequired['Query']['services'] = (_, args, context, info) => {
  args.where = { ...args.where, archivised: false }
  return servicesByRole(args, context, info)
}

export const servicesConnection: ResolversRequired['Query']['servicesConnection'] = async (_, args, context) => {
  args.where = { ...args.where, archivised: false }
  const newArgs = await getServicesArgs(args, context)
  const totalCount = await prisma.servicesConnection({ where: newArgs.where }).aggregate().count()
  const objects = await servicesByRole(args, context)
  return { services: objects, totalCount }
}

export const updateServiceCategoryCollapse: ResolversRequired['Mutation']['updateServiceCategoryCollapse'] = async (_, args, context) => {
  const { collapsed, serviceCategory, serviceType } = args
  const affiliateId = await getAffiliateIdForUser(context)
  const serviceUIState = (await prisma.serviceUIStates({
    where: { affiliateId: { id: affiliateId }, serviceType, categoryId: { id: serviceCategory } }
  }))[0]

  let updatedServiceUIState

  if (serviceUIState) {
    updatedServiceUIState = await prisma.updateServiceUIState({
      data: { collapsed },
      where: { id: serviceUIState.id }
    })
  } else {
    // Validate that a Service of given ServiceCategory and ServiceType exists in the affiiliate's services.
    const hasService = (await prisma.services({
      where: {
        categoryId: { id: serviceCategory },
        ownerId: { id: affiliateId },
        serviceType
      }
    }))[0]

    if (!hasService) {
      throw new UserInputError(
        `There is no available service with ServiceCategory:${serviceCategory} and ServiceType:${serviceType} for this user.`
      )
    }

    updatedServiceUIState = await prisma.createServiceUIState({
      affiliateId: { connect: { id: affiliateId } },
      categoryId: { connect: { id: serviceCategory } },
      collapsed,
      serviceType
    })
  }

  return updatedServiceUIState
}

export const servicesUIState: ResolversRequired['Query']['servicesUIState'] = async (_, args, context) => {
  const affiliateId = await getAffiliateIdForUser(context)

  // If ServiceUIState instances don't exist for all categories, create them first.
  const allCategories = await prisma.serviceCategories()
  const promises = []

  for (const [index, category] of allCategories.entries()) {
    const uiState = (await prisma.serviceUIStates({
      where: {
        affiliateId: { id: affiliateId },
        categoryId: { id: category.id },
        serviceType: args.serviceType
      }
    }))[0]
    if (!uiState) {
      const uiStatePromise = prisma.createServiceUIState({
        affiliateId: { connect: { id: affiliateId } },
        categoryId: { connect: { id: category.id } },
        collapsed: false,
        serviceType: args.serviceType,
        sortOrder: index
      })
      promises.push(uiStatePromise)
    }
  }

  if (promises.length) {
    await Promise.all(promises)
  }

  // Query all service UI states.
  return prisma.serviceUIStates({
    orderBy: 'sortOrder_ASC',
    where: { affiliateId: { id: affiliateId }, serviceType: args.serviceType }
  })
}

export const updateServiceCategoryOrder: ResolversRequired['Mutation']['updateServiceCategoryOrder'] = async (_, args, context) => {
  const { serviceType, sortOrder } = args
  const affiliateId = await getAffiliateIdForUser(context)

  const results: PrismaTypes.ServiceUIState[] = []
  for (const [index, id] of sortOrder.entries()) {
    const serviceUIState = (await prisma.serviceUIStates({
      where: { affiliateId: { id: affiliateId }, serviceType, categoryId: { id } }
    }))[0]

    let updatedServiceUIState

    if (serviceUIState) {
      // update if already exists
      updatedServiceUIState = await prisma.updateServiceUIState({
        data: { sortOrder: index },
        where: { id: serviceUIState.id }
      })
    } else {
      updatedServiceUIState = await prisma.createServiceUIState({
        affiliateId: { connect: { id: affiliateId } },
        categoryId: { connect: { id } },
        serviceType,
        sortOrder: index
      })
    }

    results.push(updatedServiceUIState)
  }
  return results
}

export const updateServiceCategoryColor: ResolversRequired['Mutation']['updateServiceCategoryColor'] = async (_, args) => {
  const serviceCategoryIdToColor = args.data.reduce((acc, item) => ({ ...acc, [item.id]: item.color }), {} as any)
  const ids = Object.keys(serviceCategoryIdToColor).map(key => parseInt(key, 10))
  const allCategories = await prisma.serviceCategories({ where: { id_in: ids } })
  const promises = []
  for (const categoryObj of allCategories) {
    const id = categoryObj.id
    const color = serviceCategoryIdToColor[id]
    if (color) {
      promises.push(
        prisma.updateServiceCategory({
          data: { color: { update: { r: color.r, g: color.g, b: color.b, a: color.a } } },
          where: { id }
        })
      )
    }
  }
  await Promise.all(promises)
  return prisma.serviceCategories({ where: { id_in: ids } })
}

export const convertToServiceCreateInput = async (initialData: ServiceBasicCreateInput, context: Context): Promise<ServiceCreateInput> => {
  const { regionFeesAdjusted, serviceImage, ...data } = initialData
  const ownerId = context.role === 'AFFILIATE' ? context.accountId : undefined
  if (!ownerId) {
    throw new ForbiddenError('Only affiliate can do this action.')
  }

  const remotePath = buildRemotePathForService(ownerId)
  const createServiceImage =
    serviceImage && serviceImage.file && (await saveFileToStorage({ fileUpload: serviceImage.file, remotePath }))
  return {
    ...data,
    categoryId: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
    orderNotifyEmails: { set: data.orderNotifyEmails },
    ownerId: { connect: { id: ownerId } },
    processorId: data.processorId ? { connect: { id: data.processorId } } : undefined,
    regionFeeAdjustedIds: regionFeesAdjusted ? {
      create: regionFeesAdjusted.map(regionFee => ({
        ...regionFee,
        regionId: { connect: { id: regionFee.regionId } }
      }))
    } : undefined,
    serviceImageId: createServiceImage && { create: createServiceImage },
    tourNotifyEmails: { set: data.tourNotifyEmails }
  }
}

export const convertToServicePackageCreateInput = (inputData: ServicePackageCreateMutationInput, context: Context): ServicePackageCreateInput => {
  const { regionFeesAdjusted, ...data } = inputData
  const ownerId = context.role === 'AFFILIATE' ? context.accountId : undefined
  if (!ownerId) {
    throw new ForbiddenError('Only affiliate can do this action.')
  }

  return {
    ...data,
    orderNotifyEmails: { set: data.orderNotifyEmails },
    ownerId: { connect: { id: ownerId } },
    processorId: data.processorId ? { connect: { id: data.processorId } } : undefined,
    regionFeeAdjustedIds: regionFeesAdjusted ? {
      create: regionFeesAdjusted.map(regionFee => ({
        ...regionFee,
        regionId: { connect: { id: regionFee.regionId } }
      }))
    } : undefined,
    serviceIds: { connect: data.serviceIds.map(id => ({ id })) },
    tourNotifyEmails: { set: data.tourNotifyEmails }
  }
}

export const convertToUpdateService = async (args: MutationUpdateServiceBasicArgs, context: Context): Promise<{
  data: ServiceUpdateInput
  where: ServiceWhereUniqueInput
}> => {
  const { regionFeesAdjusted, serviceImage, ...data } = args.data
  const ownerId = context.role === 'AFFILIATE' ? context.accountId : undefined
  if (!ownerId) {
    throw new ForbiddenError('Only affiliate can do this action.')
  }

  const remotePath = buildRemotePathForService(ownerId)
  const createServiceImage =
    serviceImage && serviceImage.file && await saveFileToStorage({ fileUpload: serviceImage.file, remotePath })
  return {
    data: {
      ...data,
      categoryId: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
      orderNotifyEmails: { set: data.orderNotifyEmails },
      ownerId: { connect: { id: ownerId } },
      processorId: data.processorId ? { connect: { id: data.processorId } } : {},
      regionFeeAdjustedIds: await updateServiceFeeAdjustedByRegion({ serviceId: args.where }, regionFeesAdjusted),
      serviceImageId: createServiceImage && { create: createServiceImage },
      tourNotifyEmails: { set: data.tourNotifyEmails }
    },
    where: args.where
  }
}

export const convertToUpdateServicePackage = async (args: MutationUpdateServicePackageArgs, context: Context): Promise<{
  data: ServicePackageUpdateInput
  where: ServicePackageWhereUniqueInput
}> => {
  const { regionFeesAdjusted, serviceIds, ...data } = args.data
  const ownerId = context.role === 'AFFILIATE' ? context.accountId : undefined
  if (!ownerId) {
    throw new ForbiddenError('Only affiliate can do this action.')
  }

  const currentServiceIds = (await prisma.servicePackage({ id: args.where.id }).serviceIds()).map(({ id }) => id)
  const toRemoveServiceIds = serviceIds && currentServiceIds.filter(id => !serviceIds.includes(id))

  return {
    data: {
      ...data,
      orderNotifyEmails: { set: data.orderNotifyEmails },
      ownerId: { connect: { id: ownerId } },
      processorId: data.processorId ? { connect: { id: data.processorId } } : {},
      regionFeeAdjustedIds: await updateServiceFeeAdjustedByRegion({ servicePackageId: args.where }, regionFeesAdjusted),
      serviceIds: {
        connect: serviceIds && serviceIds.map(id => ({ id })),
        disconnect: toRemoveServiceIds && toRemoveServiceIds.map(id => ({ id }))
      },
      tourNotifyEmails: { set: data.tourNotifyEmails }
    },
    where: args.where
  }
}

export async function deleteFeesAdjustedToRegion <
  Input extends ServiceFeeAdjustedByRegionUpdateInput,
  Output extends ServiceFeeAdjustedByRegionUpdateManyWithoutServicePackageIdInput['delete'],
  Where = { serviceId: WhereIdUniqueInput }
> (
  serviceFeeAdjustedByRegionWhereInput: Where,
  regionFeesAdjusted?: Maybe<Input[]>
)
: Promise<Output>
export async function deleteFeesAdjustedToRegion <
  Input extends ServicePackageFeeAdjustedByRegionUpdateInput,
  Output extends ServiceFeeAdjustedByRegionUpdateManyWithoutServiceIdInput['delete'],
  Where = { servicePackageId: WhereIdUniqueInput }
> (
  serviceFeeAdjustedByRegionWhereInput: Where,
  regionFeesAdjusted?: Maybe<Input[]>
)
: Promise<Output> {
  const inputFeeIds = regionFeesAdjusted ? regionFeesAdjusted.reduce(
    (ids: number[], fee: Input): number[] => {
      if (fee.id) {
        ids.push(fee.id)
      }
      return ids
    },
    []
  ) : []

  const currentFees = await prisma.serviceFeeAdjustedByRegions({ where: serviceFeeAdjustedByRegionWhereInput }) || []

  return regionFeesAdjusted ? currentFees.reduce(
    (toDelete: any, currentFee: ServiceFeeAdjustedByRegionType): Output => {
      if (!inputFeeIds.includes(currentFee.id)) {
        toDelete.push({ id: currentFee.id })
      }
      return toDelete
    },
    [] as unknown as Output
  ) : [] as unknown as Output
}

export async function updateServiceFeeAdjustedByRegion <
  Input extends ServicePackageFeeAdjustedByRegionUpdateInput,
  Output extends ServiceFeeAdjustedByRegionUpdateManyWithoutServicePackageIdInput,
  Where = { servicePackageId: WhereIdUniqueInput }
> (
  serviceFeeAdjustedByRegionWhereInput: Where,
  regionFeesAdjusted?: Maybe<Input[]>
): Promise<Output>
export async function updateServiceFeeAdjustedByRegion <
  Input extends ServiceFeeAdjustedByRegionUpdateInput,
  Output extends ServiceFeeAdjustedByRegionUpdateManyWithoutServiceIdInput,
  Where = { serviceId: WhereIdUniqueInput }
> (
  serviceFeeAdjustedByRegionWhereInput: Where,
  regionFeesAdjusted?: Maybe<Input[]>
): Promise<Output> {
  const regionFeeAdjustedIds: Output = regionFeesAdjusted ? regionFeesAdjusted.reduce(
    (fees: any, regionFee: Input): Output => {
      const { regionId: rId, ...fee } = regionFee
      const regionId = { connect: { id: rId } }
      if (fee.id) {
        const { id, ...feeUpdate } = fee
        if (!fees.update) {
          fees.update = []
        }
        fees.update.push({
          data: {
            ...feeUpdate,
            regionId
          },
          where: { id }
        })
      } else {
        if (!fees.create) {
          fees.create = []
        }
        fees.create.push({
          ...fee,
          regionId
        })
      }
      return fees
    },
    {} as unknown as Output
  ) : {} as unknown as Output
  regionFeeAdjustedIds.delete = await deleteFeesAdjustedToRegion(serviceFeeAdjustedByRegionWhereInput, regionFeesAdjusted)
  return regionFeeAdjustedIds
}
