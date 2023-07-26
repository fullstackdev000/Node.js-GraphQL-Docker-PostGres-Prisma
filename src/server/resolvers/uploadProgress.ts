import { PhotoProgress } from '#veewme/graphql/types'
import { pubsub, ResolversRequired } from '../graphqlServer'

export type UploadProgressInput = Exclude<PhotoProgress, '__typename'>

const PUBSUB_KEY = 'UPLOAD_PROGRESS'

export const publishUploadProgress = async (subscription: UploadProgressInput) => {
  const payload = { uploadProgress: subscription }
  await pubsub.publish(PUBSUB_KEY, payload)
}

export const uploadRealEstatePhotoProgress: ResolversRequired['Subscription']['uploadRealEstatePhotoProgress'] = {
  resolve: (payload: any, args) => {
    const realEstateId = args.where.realEstateId
    if (payload.uploadProgress.realEstateId === realEstateId) {
      return payload.uploadProgress
    }
  },
  subscribe: () => pubsub.asyncIterator([PUBSUB_KEY])
}
