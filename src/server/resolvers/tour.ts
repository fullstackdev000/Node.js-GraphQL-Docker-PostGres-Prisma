import { ResolversTypes } from '#veewme/gen/graphqlTypes'
import * as GraphQLTypes from '#veewme/gen/graphqlTypes'
import { prisma } from '#veewme/gen/prisma'
import * as PrismaTypes from '#veewme/gen/prisma'
import { getPublicUrl } from '#veewme/lib/storage'
import { UserInputError } from 'apollo-server-express'
import { forwardTo } from 'graphql-binding'
import { Context } from 'graphql-binding/dist/types'
import { ResolversRequired } from '../graphqlServer'
import { searchRealEstates } from '../search'

const getTourOverviewPhotos = async (parent: ResolversTypes['Tour']) => {
  const realEstateId = await prisma.tour({ id: parent.id }).realEstateId()
  const photos =
    (await prisma.photos({
      orderBy: 'realEstateOrder_ASC',
      where: {
        featured: true,
        hidden: false,
        realEstateId: { id: realEstateId.id }
      }
    })) || []
  return photos
}

const getAllTourPhotos = async (parent: ResolversTypes['Tour']) => {
  const realEstateId = await prisma.tour({ id: parent.id }).realEstateId()
  const photos =
    (await prisma.photos({
      orderBy: 'realEstateOrder_ASC',
      where: {
        hidden: false,
        realEstateId: { id: realEstateId.id }
      }
    })) || []
  return photos
}

const getTourPanoramas = async (parent: ResolversTypes['Tour']) => {
  const realEstateId = await prisma.tour({ id: parent.id }).realEstateId()
  const panoramas =
    (await prisma.panoramas({
      orderBy: 'realEstateOrder_ASC',
      where: { realEstate: { id: realEstateId.id } }
    })) || []
  return panoramas
}

const getTourInteractives = async (parent: ResolversTypes['Tour']) => {
  const realEstateId = await prisma.tour({ id: parent.id }).realEstateId()
  const panoramas =
    (await prisma.mediaInteractives({
      // orderBy: 'realEstateOrder_ASC', // TODO: add possibility to order by 'realEstateOrder'
      where: { realEstate: { id: realEstateId.id } }
    })) || []
  return panoramas
}

const getTourVideos = async (parent: ResolversTypes['Tour']) => {
  const realEstateId = await prisma.tour({ id: parent.id }).realEstateId()
  const videos =
    (await prisma.videos({
      orderBy: 'realEstateOrder_ASC',
      where: { realEstate: { id: realEstateId.id } }
    })) || []
  return videos
}

export const Tour: ResolversRequired['Tour'] = {
  interactives: parent => getTourInteractives(parent),
  mainColor: async parent => {
    const realEstate = await prisma.tour({ id: parent.id }).realEstateId()
    const realEstateId = realEstate.id
    const agentPrimary = await prisma.realEstate({ id: realEstateId }).agentPrimaryId()

    const agentColorSchema = await prisma.agent({ id: agentPrimary.id }).defaultColorScheme()
    return agentColorSchema
  },
  overviewPhotoIds: async parent => {
    const photos = await getTourOverviewPhotos(parent)
    return photos.map(({ id }) => id)
  },
  overviewPhotos: parent => getTourOverviewPhotos(parent),
  panoramas: parent => getTourPanoramas(parent),
  photoIds: async parent => {
    const photos = await getAllTourPhotos(parent)
    return photos.map(({ id }) => id)
  },
  photos: parent => getAllTourPhotos(parent),
  price: async parent => {
    const realEstate = await prisma.tour({ id: parent.id }).realEstateId()
    return realEstate ? realEstate.price : 0
  },
  realEstate: parent => prisma.tour({ id: parent.id }).realEstateId(),
  realEstateId: async parent => {
    const realEstate = await prisma.tour({ id: parent.id }).realEstateId()
    return realEstate.id
  },
  videos: parent => getTourVideos(parent)
}

export const TourGallery: ResolversRequired['TourGallery'] = {}

export const createTourBanner: ResolversRequired['Mutation']['createTourBanner'] = async (_, { data }) => {
  return prisma.createTourBanner({
    blackText: data.blackText,
    color: {
      create: {
        a: data.color.a,
        b: data.color.b,
        g: data.color.g,
        r: data.color.r
      }
    },
    label: data.label
  })
}

export const deleteTourBanner: ResolversRequired['Mutation']['deleteTourBanner'] = forwardTo('prismaBinding')

export const updateTourBanner: ResolversRequired['Mutation']['updateTourBanner'] = async (_, args) => {
  return prisma.updateTourBanner({
    data: {
      blackText: args.data.blackText,
      color: { update: args.data.color },
      label: args.data.label
    },
    where: args.where
  })
}

export const tourBanner: ResolversRequired['Query']['tourBanner'] = forwardTo('prismaBinding')
export const tourBanners: ResolversRequired['Query']['tourBanners'] = forwardTo('prismaBinding')

export const tour: ResolversRequired['Query']['tour'] = async (_, args) => {
  return prisma.tour({ id: args.where.id })
}

const getBannerUrl = async (tours: PrismaTypes.Tour[]) => {
  if (tours.length) {
    const [lastTour] = tours.slice(-1)
    const photos = await getAllTourPhotos(lastTour)

    if (photos.length) {
      const photo = photos[0]
      const file = await prisma.photo({ id: photo.id }).fileId()
      return file ? getPublicUrl(file.path) : ''
    }
  }
  return ''
}

export const tourGallery: ResolversRequired['Query']['tourGallery'] = async (_, args, context) => {
  const { search, type } = args

  let tours = []
  let resolverData: TourGalleryResolverData

  if (type === 'AGENT') {
    resolverData = await getAgentTourGallery(args, context, search || '')
  } else if (type === 'BROKERAGE') {
    resolverData = await getBrokerageTourGallery(args, context, search || '')
  } else if (type === 'AFFILIATE') {
    resolverData = await getAffiliateTourGallery(args, context, search || '')
  } else {
    throw new UserInputError(`Unsupported tourGallery type: ${type}`)
  }

  if (resolverData.where) {
    tours = await context.prismaBinding.query.tours({
      orderBy: 'createdAt_DESC',
      where: resolverData.where
    })
  }

  return { tours, bannerUrl: resolverData.bannerUrl, contact: resolverData.contact }
}

export const tourGalleryConnection: ResolversRequired['Query']['tourGalleryConnection'] = async (_, args, context) => {
  const { search, type } = args

  let tours = []
  let totalCount = 0
  let resolverData: TourGalleryResolverData

  if (type === 'AGENT') {
    resolverData = await getAgentTourGallery(args, context, search || '')
  } else if (type === 'BROKERAGE') {
    resolverData = await getBrokerageTourGallery(args, context, search || '')
  } else if (type === 'AFFILIATE') {
    resolverData = await getAffiliateTourGallery(args, context, search || '')
  } else {
    throw new UserInputError(`Unsupported tourGallery type: ${type}`)
  }

  if (resolverData.where) {
    tours = await context.prismaBinding.query.tours({
      after: args.after,
      before: args.before,
      first: args.first,
      last: args.last,
      orderBy: 'createdAt_DESC',
      skip: args.skip,
      where: resolverData.where
    })

    totalCount = await prisma
      .toursConnection({ where: resolverData.where })
      .aggregate()
      .count()
  }

  return { tours, totalCount, bannerUrl: resolverData.bannerUrl, contact: resolverData.contact, showSearchBar: resolverData.showSearchBar }
}

interface TourGalleryResolverData {
  bannerUrl: string
  contact: GraphQLTypes.Contact | null
  where?: GraphQLTypes.TourWhereInput
  showSearchBar?: boolean
}

const getAgentTourGallery = async (
  args: GraphQLTypes.QueryTourGalleryArgs,
  context: Context,
  searchPhrase?: string | null
): Promise<TourGalleryResolverData> => {
  let bannerUrl = ''
  let contact: GraphQLTypes.Contact | null = null
  let where
  let showSearchBar: boolean = true

  const agent = await prisma.agent({ id: args.where.id })

  if (agent) {
    const user = await prisma.agent({ id: agent.id }).user()
    const brokerage = await prisma.agent({ id: agent.id }).brokerage()
    const affiliateLogo = await prisma.agent({ id: agent.id }).affiliate().profilePicture()
    const profilePicture = await prisma.agent({ id: agent.id }).profilePicture()

    const whereAgentTours = {
      OR: [{ agentPrimaryId: { id: args.where.id } }, { agentCoListingId: { id: args.where.id } }]
    }

    // Get all agent's tours to get the banner URL from the last tour.
    const allAgentTours = await context.prismaBinding.query.tours({ where: { realEstateId: whereAgentTours } })
    bannerUrl = await getBannerUrl(allAgentTours)
    // TODO: add for other gallery types
    showSearchBar = agent.showSearchOnGalleryPage

    if (searchPhrase) {
      const searchResultIds = await searchRealEstates(searchPhrase)
      where = {
        AND: [{ realEstateId: whereAgentTours }, { realEstateId: { id_in: searchResultIds } }]
      }
    } else {
      where = { realEstateId: whereAgentTours }
    }

    contact = {
      bio: agent.bio,
      city: agent.city,
      company: brokerage ? brokerage.companyName : '',
      description: '',
      email: user.email,
      facebookUrl: agent.facebookLink,
      id: agent.id,
      imageUrl: (profilePicture && getPublicUrl(profilePicture.path)) || '',
      instagramUrl: agent.instagramLink,
      linkedinUrl: agent.linkedinLink,
      logo: (affiliateLogo && getPublicUrl(affiliateLogo.path)) || '',
      mobile: agent.phoneMobile || '',
      name: `${user.firstName} ${user.lastName}`,
      phone: agent.phone,
      pinterestUrl: agent.pinterestLink,
      title: agent.title || '',
      twitterUrl: agent.twitterLink,
      websiteUrl: agent.website
    }
  }
  return { bannerUrl, contact, showSearchBar, where }
}

const getAffiliateTourGallery = async (
  args: GraphQLTypes.QueryTourGalleryArgs,
  context: Context,
  searchPhrase?: string | null
): Promise<TourGalleryResolverData> => {
  let bannerUrl = ''
  let contact: GraphQLTypes.Contact | null = null
  let where

  const affiliate = await prisma.affiliate({ id: args.where.id })

  if (affiliate) {
    const user = await prisma.affiliate({ id: affiliate.id }).user()
    const agents = await prisma.agents({ where: { affiliate: { id: args.where.id } } })
    const agentIds = agents.map(agent => agent.id)
    const logo = await prisma.affiliate({ id: args.where.id }).profilePicture()

    const whereAffiliateTours = {
      OR: [{ agentPrimaryId: { id_in: agentIds } }, { agentCoListingId: { id_in: agentIds } }]
    }

    // Get all affiiliate's tours to get the banner URL from the last tour.
    const allAffiliateTours = await context.prismaBinding.query.tours({ where: { realEstateId: whereAffiliateTours } })
    bannerUrl = await getBannerUrl(allAffiliateTours)

    if (searchPhrase) {
      const searchResultIds = await searchRealEstates(searchPhrase)
      where = {
        AND: [{ realEstateId: whereAffiliateTours }, { realEstateId: { id_in: searchResultIds } }]
      }
    } else {
      where = { realEstateId: whereAffiliateTours }
    }

    contact = {
      city: affiliate.city,
      company: affiliate.companyName,
      description: affiliate.areasCovered,
      email: user.email,
      facebookUrl: affiliate.facebookLink,
      id: affiliate.id,
      imageUrl: '',
      instagramUrl: affiliate.instagramLink,
      linkedinUrl: affiliate.linkedinLink,
      logo: (logo && getPublicUrl(logo.path)) || '',
      mobile: affiliate.phone,
      name: `${user.firstName} ${user.lastName}`,
      phone: affiliate.phone,
      pinterestUrl: affiliate.pinterestLink,
      title: '',
      twitterUrl: affiliate.twitterLink,
      websiteUrl: affiliate.website
    }
  }
  return { bannerUrl, contact, where }
}

const getBrokerageTourGallery = async (
  args: GraphQLTypes.QueryTourGalleryArgs,
  context: Context,
  searchPhrase?: string | null
): Promise<TourGalleryResolverData> => {
  let bannerUrl = ''
  let contact: GraphQLTypes.Contact | null = null
  let where

  const brokerage = await prisma.brokerage({ id: args.where.id })

  if (brokerage) {
    const agents = await prisma.agents({ where: { brokerage: { id: args.where.id } } })
    const agentIds = agents.map(agent => agent.id)
    const logo = await prisma.brokerage({ id: args.where.id }).profilePicture()

    const whereBrokerageTours = {
      OR: [{ agentPrimaryId: { id_in: agentIds } }, { agentCoListingId: { id_in: agentIds } }]
    }

    // Get all brokerage's tours to get the banner URL from the last tour.
    const allBrokerageTours = await context.prismaBinding.query.tours({ where: { realEstateId: whereBrokerageTours } })
    bannerUrl = await getBannerUrl(allBrokerageTours)

    if (searchPhrase) {
      const searchResultIds = await searchRealEstates(searchPhrase)
      where = {
        AND: [{ realEstateId: whereBrokerageTours }, { realEstateId: { id_in: searchResultIds } }]
      }
    } else {
      where = { realEstateId: whereBrokerageTours }
    }

    contact = {
      city: brokerage.city,
      company: brokerage.companyName,
      description: '',
      email: brokerage.emailOffice || '',
      facebookUrl: '',
      id: brokerage.id,
      imageUrl: '',
      instagramUrl: '',
      linkedinUrl: '',
      logo: (logo && getPublicUrl(logo.path)) || '',
      mobile: '',
      name: '',
      phone: brokerage.phone,
      pinterestUrl: '',
      title: '',
      twitterUrl: '',
      websiteUrl: brokerage.website
    }
  }
  return { bannerUrl, contact, where }
}
