import * as GraphqlTypes from '#veewme/gen/graphqlTypes'
import * as PrismaTypes from '#veewme/gen/prisma'
import { prisma } from '#veewme/gen/prisma'
import { createRandomPassword, hashPassword } from '#veewme/helpers/password'
import { saveFileToStorage } from '#veewme/lib/storage'
import { Context } from '#veewme/lib/types'
import { sendWelcomeUserEmail } from '../email'
import { ResolversRequired } from '../graphqlServer'
import { normalizeSearch } from '../search'
import { buildRemotePathForPhotographer, getObjectOrError, updateSavedFile } from './utils'

export const getPhotographerSearchDocument = (data: GraphqlTypes.PhotographerCreateInput | GraphqlTypes.PhotographerUpdateInput) => {
  let values: string[] = []
  if (data && data.user) {
    values = [
      data.user.firstName || '',
      data.user.lastName || '',
      data.user.firstName || ''
    ]
  }
  return normalizeSearch(values.join(' '))
}

export const Photographer: ResolversRequired['Photographer'] = {
  affiliate: parent => prisma.photographer({ id: parent.id }).affiliateId(),
  affiliateId: async parent => {
    const aff = await prisma.photographer({ id: parent.id }).affiliateId()
    return aff.id
  },
  events: parent => prisma.photographer({ id: parent.id }).events(),
  profilePicture: parent => prisma.photographer({ id: parent.id }).profilePicture(),
  region: parent => prisma.photographer({ id: parent.id }).regionId(),
  regionId: async parent => {
    const region = await prisma.photographer({ id: parent.id }).regionId()
    return region.id
  },
  user: parent => prisma.photographer({ id: parent.id }).user()
}

const getPhotographersArgs = (args: GraphqlTypes.QueryPhotographersArgs, context: Context): any => {
  const { search, ...newArgs } = args
  const where: GraphqlTypes.PhotographerWhereInput = { ...args.where }
  if (context.role === 'AFFILIATE') {
    where.affiliateId = { id: context.accountId }
  }
  if (args.search) {
    const searchPhrase = normalizeSearch(args.search)
    where.searchDocument_contains = searchPhrase
  }
  newArgs.where = where
  return newArgs
}

const photographersByRole = async (args: GraphqlTypes.QueryPhotographersArgs, context: Context): Promise<any[]> => {
  const newArgs = getPhotographersArgs(args, context)
  return prisma.photographers({ ...newArgs })
}

export const photographer: ResolversRequired['Query']['photographer'] = (_, args, context, info) => {
  return getObjectOrError<GraphqlTypes.Photographer>(photographersByRole(args, context))
}

export const photographers: ResolversRequired['Query']['photographers'] = (_, args, context, info) => {
  return photographersByRole(args, context)
}

export const photographersConnection: ResolversRequired['Query']['photographersConnection'] = async (_, args, context) => {
  const newArgs = getPhotographersArgs(args, context)
  const totalCount = await prisma.photographersConnection({ where: newArgs.where }).aggregate().count()
  const objects = await photographersByRole(args, context)
  return { photographers: objects, totalCount }
}

export const createPhotographer: ResolversRequired['Mutation']['createPhotographer'] = async (_, args) => {
  const { affiliateId, profilePicture, regionId, user, ...data } = args.data

  let plainPassword = user.password
  let notifyTempPassword = false
  if (!plainPassword) {
    plainPassword = createRandomPassword()
    notifyTempPassword = true
  }
  const hashedPassword = hashPassword(plainPassword)

  let photographerObj = await prisma.createPhotographer({
    ...data,
    affiliateId: { connect: { id: affiliateId } },
    regionId: { connect: { id: regionId } },
    searchDocument: getPhotographerSearchDocument(args.data),
    user: {
      create: {
        ...user,
        password: hashedPassword,
        role: 'PHOTOGRAPHER'
      }
    }
  })

  if (notifyTempPassword) {
    sendWelcomeUserEmail(user.email, `${user.firstName}`, plainPassword).catch(reason => {
      console.error('Failed to send the agent welcome email: ', reason)  // tslint:disable-line
    })
  }

  // Save profile picture
  if (profilePicture && profilePicture.file) {
    const remotePath = await buildRemotePathForPhotographer(photographerObj)
    const storedProfilePicture = await saveFileToStorage({ fileUpload: profilePicture.file, remotePath })
    photographerObj = await prisma.updatePhotographer({
      data: { profilePicture: { create: storedProfilePicture } },
      where: { id: photographerObj.id }
    })
  }
  return photographerObj
}

export const updatePhotographer: ResolversRequired['Mutation']['updatePhotographer'] = async (
  _,
  args,
  context,
  info
) => {
  const { where, data: { user, ...data } } = args
  await getObjectOrError<GraphqlTypes.Photographer>(photographersByRole({ where }, context))

  const query = `{
    id
    connectedProfilePicture: profilePicture { path }
  }`
  const photographerObj = await getObjectOrError<PrismaTypes.Photographer>(
    context.prismaBinding.query.photographers({ where }, query)
  )

  type AliasedPhotographer = Omit<GraphqlTypes.Photographer, 'profilePicture'> & {
    connectedProfilePicture: GraphqlTypes.File
  }
  const { connectedProfilePicture } = (photographerObj as unknown) as AliasedPhotographer

  let regionId
  if (data.regionId) {
    regionId = { connect: { id: data.regionId } }
  }

  const password = user && user.password && hashPassword(user.password)

  const remotePath = await buildRemotePathForPhotographer(photographerObj)
  const profilePicture = await updateSavedFile(remotePath, connectedProfilePicture, data.profilePicture)

  return prisma.updatePhotographer({
    data: {
      ...data,
      profilePicture,
      regionId,
      searchDocument: getPhotographerSearchDocument(args.data),
      user: user && { update: { ...user, password } }
    },
    where: { id: args.where.id }
  })
}

export const deletePhotographer: ResolversRequired['Mutation']['deletePhotographer'] = async (
  _,
  args,
  context,
  info
) => {
  const photographerObj = await getObjectOrError<GraphqlTypes.Photographer>(
    photographersByRole({ where: args.where }, context)
  )
  return prisma.deletePhotographer({ id: photographerObj.id })
}
