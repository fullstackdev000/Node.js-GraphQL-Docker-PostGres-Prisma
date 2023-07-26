import { PhotoOrderByInput, ResolversTypes } from '#veewme/gen/graphqlTypes'
import { prisma } from '#veewme/gen/prisma'
import { createOnePageFlyerPdf } from '#veewme/lib/pdf/realEstateFlyerPdf'
import { FlyerImage } from '#veewme/lib/pdf/types'
import { FileUpload, getPublicUrl, saveFileToStorage } from '#veewme/lib/storage'
import { buildRemotePathForRealEstate } from '#veewme/server/resolvers/utils'
import { convertImageUrlToBase64 } from '#veewme/server/utils'
import { ResolversRequired } from '../graphqlServer'

const PUBLIC_URL = process.env.PUBLIC_URL

export const getRealEstateAddress = (parent: ResolversTypes['RealEstate']) => {
  const { city, state, street, zip } = parent
  return `${street} ${city}, ${state} ${zip}`
}

export const RealEstate: ResolversRequired['RealEstate'] = {
  address: parent => getRealEstateAddress(parent),
  agentCoListing: parent => prisma.realEstate({ id: parent.id }).agentCoListingId(),
  agentCoListingId: async parent => {
    const agent = await prisma.realEstate({ id: parent.id }).agentCoListingId()
    return agent && agent.id
  },
  agentPrimary: parent => prisma.realEstate({ id: parent.id }).agentPrimaryId(),
  agentPrimaryId: async parent => {
    const agent = await prisma.realEstate({ id: parent.id }).agentPrimaryId()
    return agent.id
  },
  mediaDocumentIds: async parent => {
    const documents = await prisma.realEstate({ id: parent.id }).mediaDocumentIds() || []
    return documents.map(({ id }) => id)
  },
  mediaDocuments: parent => prisma.realEstate({ id: parent.id }).mediaDocumentIds(),
  mediaInteractiveIds: async parent => {
    const interactives = await prisma.realEstate({ id: parent.id }).mediaInteractives() || []
    return interactives.map(item => item.id)
  },
  mediaInteractives: parent => prisma.realEstate({ id: parent.id }).mediaInteractives(),
  orderIds: async parent => {
    const orders = await prisma.realEstate({ id: parent.id }).orderIds() || []
    return orders.map(({ id }) => id)
  },
  orders: parent => prisma.realEstate({ id: parent.id }).orderIds(),
  panoramas: parent => prisma.realEstate({ id: parent.id }).panoramas(),
  photoIds: async (parent, args) => {
    const orderBy: PhotoOrderByInput = args.orderBy || 'realEstateOrder_ASC'
    const photos = await prisma.realEstate({ id: parent.id }).photoIds({ orderBy }) || []
    return photos.map(({ id }) => id)
  },
  photos: (parent, args) => {
    const orderBy: PhotoOrderByInput = args.orderBy || 'realEstateOrder_ASC'
    return prisma.realEstate({ id: parent.id }).photoIds({ orderBy })
  },
  tour: parent => prisma.realEstate({ id: parent.id }).tourId(),
  tourId: async parent => {
    const tour = await prisma.realEstate({ id: parent.id }).tourId()
    return tour && tour.id
  },
  videos: parent => prisma.realEstate({ id: parent.id }).videos(),
  zips: parent => prisma.realEstate({ id: parent.id }).zips()
}

export const realEstate: ResolversRequired['Query']['realEstate'] = async (_, args, context) => {
  return context.prismaBinding.query.realEstate({ ...args })
}

export const realEstates: ResolversRequired['Query']['realEstates'] = async (_, args, context) => {
  return context.prismaBinding.query.realEstates({ ...args })
}

export const createOnePageRealEstateFlyerPdf: ResolversRequired['Mutation']['createOnePageRealEstateFlyerPdf'] = async (obj, args, context, info) => {
  const realEstateFragment = `
    fragment RealEstateData on RealEstate {
      id
      fullBathrooms
      city
      state
      price
      lotSize
      halfBathrooms
      rental
      bedrooms
      homeSizeUnit
      street
      yearBuilt
      orderIds {
        templateId
      }
      tourId {
        id
        descriptionShort
      }
      agentPrimaryId {
        city
        phone
        emailCC
        others
        website
        templateId
          user {
            firstName
            lastName
          }
          profilePicture {
            path
          }
          brokerage {
            city
            state
            street
            zip
            website
            profilePicture {
              path
            }
          }
        }

    }
`
  const imagesFragment = `
    fragment Images on Photo {
      id
      fileId {
        path
      }
    }
`
  const [realEstateData] = await prisma.realEstates({ where: { id: args.data.realEstateId } }).$fragment(realEstateFragment)
  const images: FlyerImage[] = await prisma.photos({ where: { id_in: [args.data.bigImgId, args.data.coverImgId, args.data.firstSideImgId, args.data.secondSideImgId] } }).$fragment(imagesFragment)
  const bigImg = images.find(img => img.id === args.data.bigImgId)
  const coverImg = images.find(img => img.id === args.data.coverImgId)
  const firstSideImg = images.find(img => img.id === args.data.firstSideImgId)
  const secondSideImg = images.find(img => img.id === args.data.secondSideImgId)
  if (realEstateData === null) {
    return 'RealEstate with the specified id does not exist'
  }
  if (!bigImg || !coverImg || !firstSideImg || !secondSideImg) {
    return 'Incorrect image id'
  }
  try {
    const dataForPdfFlyer = {
      agentCity: realEstateData.agentPrimaryId.city || '',
      agentEmail: realEstateData.agentPrimaryId.emailCC || '',
      agentFirstName: realEstateData.agentPrimaryId.user.firstName,
      agentImg: realEstateData.agentPrimaryId.profilePicture !== null ? await convertImageUrlToBase64(realEstateData.agentPrimaryId.profilePicture.path) : '',
      agentLastName: realEstateData.agentPrimaryId.user.lastName,
      agentOthers: realEstateData.agentPrimaryId.others || '',
      agentPhone: realEstateData.agentPrimaryId.phone,
      agentWebsite: realEstateData.agentPrimaryId.website || '',
      brokerageCity: realEstateData.agentPrimaryId.brokerage.city,
      brokerageLogoImg: realEstateData.agentPrimaryId.brokerage.profilePicture ? await convertImageUrlToBase64(realEstateData.agentPrimaryId.brokerage.profilePicture.path) : '',
      brokerageState: realEstateData.agentPrimaryId.brokerage.state,
      brokerageStreet: realEstateData.agentPrimaryId.brokerage.street,
      brokerageWebsite: realEstateData.agentPrimaryId.brokerage.website || '',
      brokerageZip: realEstateData.agentPrimaryId.brokerage.zip,
      realEstateBedrooms: realEstateData.bedrooms,
      realEstateBigImg: await convertImageUrlToBase64(bigImg.fileId.path),
      realEstateCity: realEstateData.city,
      realEstateCoverImg: await convertImageUrlToBase64(coverImg.fileId.path),
      realEstateDescriptionShort: realEstateData.tourId.descriptionShort || '',
      realEstateFullBathrooms: realEstateData.fullBathrooms,
      realEstateHalfBathrooms: realEstateData.halfBathrooms,
      realEstateHomeSizeUnit: realEstateData.homeSizeUnit,
      realEstateLotSize: realEstateData.lotSize || 0,
      realEstatePeriod: realEstateData.rental || '',
      realEstatePrice: realEstateData.price,
      realEstateSideImg1: await convertImageUrlToBase64(firstSideImg.fileId.path),
      realEstateSideImg2: await convertImageUrlToBase64(secondSideImg.fileId.path),
      realEstateState: realEstateData.state,
      realEstateStreet: realEstateData.street,
      realEstateYearBuilt: realEstateData.yearBuilt,
      urlForQrCode: realEstateData.orderIds.templateId ? `${PUBLIC_URL}/tour/${realEstateData.tourId.id}/l/${realEstateData.orderIds.templateId}` : `${PUBLIC_URL}/tour/${realEstateData.tourId.id}/l/${realEstateData.agentPrimaryId.templateId}`
    }
    const flyerFile: FileUpload = createOnePageFlyerPdf(dataForPdfFlyer)
    const remotePath = await buildRemotePathForRealEstate(args.data.realEstateId)
    const uploadedFile = await saveFileToStorage({ fileUpload: flyerFile, remotePath })
    const fileDataForDB = { ...uploadedFile, path: getPublicUrl(uploadedFile.path) }
    await prisma.createFile({ ...fileDataForDB })
    const updatedRealEstate = await prisma.updateRealEstate({ where: { id: args.data.realEstateId }, data: { flyerUrl: fileDataForDB.path } })
    return updatedRealEstate.flyerUrl
  } catch (error) {
    return error
  }
}
