import * as GraphqlTypes from '#veewme/gen/graphqlTypes'
import * as PrismaTypes from '#veewme/gen/prisma'
import { prisma } from '#veewme/gen/prisma'
import { createRandomPassword, hashPassword } from '#veewme/helpers/password'
import { saveFileToStorage, unlink } from '#veewme/lib/storage'
import { sendWelcomeAffiliateEmail } from '#veewme/server/email'
import { forwardTo } from 'graphql-binding'
import { ResolversRequired } from '../graphqlServer'
import { createCustomer } from '../payments/stripe'
import { resolvePaymentMethods } from './payments/payments'
import { buildRemotePathForAffiliate, getObjectOrError, updateSavedFile } from './utils'

export const Affiliate: ResolversRequired['Affiliate'] = {
  agents: parent => prisma.affiliate({ id: parent.id }).agents() || [],
  brokerages: parent => prisma.affiliate({ id: parent.id }).brokerages() || [],
  coverPhoto: parent => prisma.affiliate({ id: parent.id }).coverPhoto(),
  defaultColorScheme: parent => prisma.affiliate({ id: parent.id }).defaultColorScheme(),
  domainId: parent => prisma.affiliate({ id: parent.id }).domainId(),
  featuredRealEstateSites: parent => prisma.affiliate({ id: parent.id }).featuredRealEstateSites(),
  mediaExports: parent => prisma.affiliate({ id: parent.id }).mediaExports(),
  paymentMethods: parent => resolvePaymentMethods(parent),
  processors: parent => prisma.affiliate({ id: parent.id }).processors() || [],
  profilePicture: parent => prisma.affiliate({ id: parent.id }).profilePicture(),
  regions: parent => prisma.affiliate({ id: parent.id }).regions(),
  tourColor: parent => prisma.affiliate({ id: parent.id }).tourColor(),
  user: parent => prisma.affiliate({ id: parent.id }).user()
}

export const createAffiliate: ResolversRequired['Mutation']['createAffiliate'] = async (_, args) => {
  const { coverPhoto, socialMedia, profilePicture, ...data } = args.data

  let plainPassword = data.user.password
  let notifyTempPassword = false
  if (!plainPassword) {
    plainPassword = createRandomPassword()
    notifyTempPassword = true
  }
  const hashedPassword = hashPassword(plainPassword)

  // When affiliate is created, also create the first region which is assumed the default one and cannot be removed.
  const regions = { create: [{ default: true, label: 'Default Region' }] }

  let affiliateObj = await prisma.createAffiliate({
    ...data,
    ...socialMedia,
    agents: { create: [] },
    brokerages: { create: [] },
    defaultColorScheme: { create: { b: 62, g: 204, r: 159 } },
    domainId: { create: [] },
    featuredRealEstateSites: { create: [] },
    mediaExports: { create: [] },
    orders: { create: [] },
    processors: { create: [] },
    regions,
    tourColor: { create: { b: 204, g: 100, r: 9 } },
    user: {
      create: {
        ...data.user,
        password: hashedPassword,
        role: 'AFFILIATE'
      }
    }
  })

  // Save profile picture
  if (profilePicture && profilePicture.file) {
    const remotePath = await buildRemotePathForAffiliate(affiliateObj)
    const storedProfilePicture = await saveFileToStorage({ fileUpload: profilePicture.file, remotePath })
    affiliateObj = await prisma.updateAffiliate({
      data: { profilePicture: { create: storedProfilePicture } },
      where: { id: affiliateObj.id }
    })
  }
  // Save cover photo
  if (coverPhoto && coverPhoto.file) {
    const remotePath = await buildRemotePathForAffiliate(affiliateObj)
    const storedCoverPhoto = await saveFileToStorage({ fileUpload: coverPhoto.file, remotePath })
    affiliateObj = await prisma.updateAffiliate({
      data: { coverPhoto: { create: storedCoverPhoto } },
      where: { id: affiliateObj.id }
    })
  }

  // Create Stripe customer and save its ID in the affiliate instance.
  const name = `${data.user.firstName} ${data.user.lastName}`
  const stripeCustomer = await createCustomer(data.user.email, 'AFFILIATE', name)
  affiliateObj = await prisma.updateAffiliate({
    data: { stripeCustomerId: stripeCustomer.id },
    where: { id: affiliateObj.id }
  })

  // Send welcome email; include password if it was generated by us.
  const passwordToSend = notifyTempPassword ? plainPassword : ''
  await sendWelcomeAffiliateEmail(data.user.email, `${data.user.firstName}`, passwordToSend)

  return affiliateObj
}

export const deleteAffiliate: ResolversRequired['Mutation']['deleteAffiliate'] = async (_, args, context, info) => {
  // TODO: Get orders from affiliate. Since Order schema isn't created.
  // filesToDelete.forEach(({ path }) => { unlink(path) })
  // Where 'path' should be [affiliate_id]/[order_id]
  // Folder creation isn't necessary since full-path file uploading also generates them properly.
  const affiliateObj = await getObjectOrError<GraphqlTypes.Affiliate>(
    context.prismaBinding.query.affiliates({ where: args.where }, info)
  )
  const profilePicFileObj = await prisma.affiliate({ id: args.where.id }).profilePicture()
  if (profilePicFileObj) {
    unlink(profilePicFileObj.path)
  }
  const coverPhotoFileObj = await prisma.affiliate({ id: args.where.id }).coverPhoto()
  if (coverPhotoFileObj) {
    unlink(coverPhotoFileObj.path)
  }
  return prisma.deleteAffiliate({ id: affiliateObj.id })
}

export const updateAffiliate: ResolversRequired['Mutation']['updateAffiliate'] = async (_, args, context, info) => {
  const { socialMedia, ...data } = args.data
  const affiliateId = args.where.id

  const query = `{
    id
    connectedCoverPhoto: coverPhoto { path }
    connectedProfilePicture: profilePicture { path }
    connectedRegions: regions { id default }
  }`

  const affiliateObj = await getObjectOrError<PrismaTypes.Affiliate>(
    context.prismaBinding.query.affiliates({ where: args.where }, query)
  )

  type AliasedAffiliate = Omit<GraphqlTypes.Affiliate, 'coverPhoto' | 'profilePicture' | 'regions'> & {
    connectedCoverPhoto: GraphqlTypes.File
    connectedProfilePicture: GraphqlTypes.File
    connectedRegions: GraphqlTypes.Region[]
  }
  const {
    connectedCoverPhoto,
    connectedProfilePicture,
    connectedRegions
  } = (affiliateObj as unknown) as AliasedAffiliate

  const password = data.user && data.user.password && hashPassword(data.user.password)

  const currentMediaExports = await context.prismaBinding.query.photoPresets({ where: { owner: { id: affiliateId } } })

  const remotePath = await buildRemotePathForAffiliate(affiliateObj)
  const profilePicture = await updateSavedFile(remotePath, connectedProfilePicture, data.profilePicture)
  const coverPhoto = await updateSavedFile(remotePath, connectedCoverPhoto, data.coverPhoto)

  const regions = await convertToRegionUpdateManyInput(affiliateObj, data.regions, connectedRegions)

  const af = await prisma.updateAffiliate({
    data: {
      ...data,
      ...socialMedia,
      coverPhoto,
      defaultColorScheme: { update: data.defaultColorScheme },
      // TODO handle featuredRealEstateSites connecting and disconnecting
      featuredRealEstateSites: data.featuredRealEstateSites && {
        connect: data.featuredRealEstateSites.map(realEstateId => ({ id: realEstateId }))
      },
      mediaExports: convertToPhotoPresetUpdateManyInput(data.mediaExports, currentMediaExports),
      profilePicture,
      regions,
      tourColor: { update: data.tourColor },
      user: {
        update: {
          ...data.user,
          password
        }
      }
    },
    where: {
      ...args.where,
      id: affiliateId
    }
  })
  return af
}

export const convertToPhotoPresetUpdateManyInput: (
  media?: GraphqlTypes.AffiliateUpdateInput['mediaExports'] | null,
  currentMediaExports?: GraphqlTypes.PhotoPreset[] | null
) => PrismaTypes.PhotoPresetUpdateManyWithoutOwnerInput = (media, currentMediaExports) => {
  if (media) {
    const mediaExportsToDelete =
      currentMediaExports &&
      currentMediaExports.reduce(
        (
          toDelete: PrismaTypes.PhotoPresetScalarWhereInput[],
          currentMedium: PrismaTypes.PhotoPreset
        ): PrismaTypes.PhotoPresetScalarWhereInput[] => {
          if (!media.some(medium => medium.id === currentMedium.id)) {
            toDelete.push({ id: currentMedium.id })
          }
          return toDelete
        },
        []
      )
    return {
      create: media.filter(medium => !medium.hasOwnProperty('id')),
      deleteMany: mediaExportsToDelete,
      update: media
        .filter(medium => medium.hasOwnProperty('id'))
        .map(
          (medium: GraphqlTypes.PhotoPresetInput): PrismaTypes.PhotoPresetUpdateWithWhereUniqueWithoutOwnerInput => {
            const { id, ...data } = medium
            return {
              data,
              where: { id }
            }
          }
        )
    }
  }
  return {}
}

export async function convertToRegionUpdateManyInput (
  ownerAffiliate: PrismaTypes.Affiliate,
  inputRegions?: GraphqlTypes.RegionUpdateInput[] | null,
  connectedRegions?: GraphqlTypes.Region[] | null
): Promise<PrismaTypes.Maybe<PrismaTypes.RegionUpdateManyWithoutOwnerIdInput>> {
  const inputIds = inputRegions ? inputRegions.map(r => r.id) : []
  const connectedIds = connectedRegions ? connectedRegions.map(r => r.id) : []

  // Get default region for affiliate which cannot be removed. When removing other regions, all region-specific data is
  // reassigned to the default one.
  const defaultRegion = connectedRegions ? connectedRegions.filter(region => region.default)[0] : null
  if (!defaultRegion) {
    throw new Error(`No default region for affiliate: ${ownerAffiliate.id}`)
  }

  const toCreate = inputRegions
    ? inputRegions
        .filter(region => region.id === undefined || region.id === null)
        .map(region => ({ label: region.label }))
    : []

  const toUpdate = inputRegions
    ? inputRegions
        .filter(region => region.id && connectedIds.includes(region.id))
        .map(region => ({ where: { id: region.id }, data: { label: region.label } }))
    : []

  const toDelete = connectedIds
    .filter(id => !inputIds.includes(id) && (defaultRegion && id !== defaultRegion.id))
    .map(id => ({ id }))

  if (toDelete) {
    // Reassign relations to default region for each region being removed.
    const regionIds = toDelete.map(i => i.id)

    const brokerages = await prisma.brokerages({ where: { region: { id_in: regionIds } } })
    const offices = await prisma.offices({ where: { region: { id_in: regionIds } } })
    const serviceFees = await prisma.serviceFeeAdjustedByRegions({ where: { regionId: { id_in: regionIds } } })
    const agents = await prisma.agents({ where: { region: { id_in: regionIds } } })
    const photographers = await prisma.photographers({ where: { regionId: { id_in: regionIds } } })
    const processors = await prisma.processors({ where: { regionId: { id_in: regionIds } } })

    brokerages.forEach(async brokerage => {
      await prisma.updateBrokerage({
        data: { region: { connect: { id: defaultRegion.id } } },
        where: { id: brokerage.id }
      })
    })

    offices.forEach(async office => {
      await prisma.updateOffice({
        data: { region: { connect: { id: defaultRegion.id } } },
        where: { id: office.id }
      })
    })

    serviceFees.forEach(async serviceFee => {
      await prisma.updateServiceFeeAdjustedByRegion({
        data: { regionId: { connect: { id: defaultRegion.id } } },
        where: { id: serviceFee.id }
      })
    })

    agents.forEach(async agent => {
      await prisma.updateAgent({
        data: { region: { connect: { id: defaultRegion.id } } },
        where: { id: agent.id }
      })
    })

    photographers.forEach(async photographer => {
      await prisma.updatePhotographer({
        data: { regionId: { connect: { id: defaultRegion.id } } },
        where: { id: photographer.id }
      })
    })

    processors.forEach(async processor => {
      await prisma.updateProcessor({
        data: { regionId: { connect: { id: defaultRegion.id } } },
        where: { id: processor.id }
      })
    })
  }

  return {
    create: toCreate,
    delete: toDelete,
    update: toUpdate
  }
}

export const affiliate: ResolversRequired['Query']['affiliate'] = (_, args) => {
  return prisma.affiliate({ id: args.where.id })
}

export const affiliates: ResolversRequired['Query']['affiliates'] = forwardTo('prismaBinding')
