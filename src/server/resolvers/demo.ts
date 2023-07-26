import { reportPDF } from '#veewme/lib/pdf/reportPdf'
import { FileUpload, getPublicUrl, saveFileToStorage, unlink } from '#veewme/lib/storage'
import { forwardTo } from 'graphql-binding'
import { pubsub, ResolversRequired } from '../graphqlServer'

export const addDemoImages: ResolversRequired['Mutation']['addDemoImages'] = async (obj, args, context, info) => {
  const { data, where } = args
  const newImages = data && data.images && data.images.filter(image => !image.id)
  const creatableImages = await Promise.all(newImages.map(image => saveFileToStorage({ fileUpload: image.file })))
  const modifiedImages = data && data.images && data.images.filter(image => !!image.id && !!image.file)
  const filesToDeleteWhereInput = { AND: modifiedImages.map(({ id }) => ({ id })) }
  const filesToDelete = await context.prismaBinding.query.files({ where: filesToDeleteWhereInput })
  const updateableImages = await Promise.all(modifiedImages.map(async image => ({
    data: await saveFileToStorage({ fileUpload: image.file }),
    where: { id: image.id }
  })))
  if (filesToDelete) { filesToDelete.forEach(({ path }: { path: string }) => { unlink(path) }) }
  const newCropImages = data && data.cropImages && data.cropImages.filter(image => !image.id)
  const creatableCropImages = await Promise.all(newCropImages.map(image => saveFileToStorage({ fileUpload: image.file })))
  return context.prismaBinding.mutation.updateDemoImages({
    data: {
      cropImages: {
        create: creatableCropImages
      },
      images: {
        create: creatableImages,
        updateMany: updateableImages
      }
    },
    where
  })
}

export const createDemoThing: ResolversRequired['Mutation']['createDemoThing'] = forwardTo('prismaBinding')

export const demoUpload: ResolversRequired['Mutation']['demoUpload'] = async (obj, { data }: { data: FileUpload }, context, info) => {
  const storedFile = await saveFileToStorage({ fileUpload: data })

  const file = await context.prismaBinding.mutation.createFile({ data: storedFile })
  return getPublicUrl(file)
}

export const demoImages: ResolversRequired['Query']['demoImages'] = forwardTo('prismaBinding')
export const demoThings: ResolversRequired['Query']['demoThings'] = forwardTo('prismaBinding')

export const demoReportPDF: ResolversRequired['Query']['demoReportPDF'] = async (obj, args, context, info) => {
  const affiliate = await context.prismaBinding.query.affiliates(info)
  const listAgents = await context.prismaBinding.query.agents({
    where: {
      affiliate: { id: affiliate[0].id }
    }
  }, `{
        id
        phoneMobile
        user {
          firstName
          lastName
        }
      }`
  )

  const file = reportPDF(affiliate[0], listAgents)
  return {
    url: file
  }
}

export const demoTriggerEvent: ResolversRequired['Mutation']['demoTriggerEvent'] = (obj, args, context, info) => {
  pubsub.publish('DEMO_TRIGGER', { demoEvent: args.input }).catch(error => {
    // TODO add proper error handling
    console.log(error.message) // tslint:disable-line
  })
  return args.input
}

export const demoEvent: ResolversRequired['Subscription']['demoEvent'] = {
  resolve: (result: any) => {
    return result.demoEvent
  },
  subscribe: () => pubsub.asyncIterator(['DEMO_TRIGGER'])
}
