import {
  MediaAccessQuery,
  MediaAccessQueryVariables

} from '#veewme/graphql/types'
import { OrderPanorama, OrderPhoto } from '#veewme/web/components/media/types'

export { MediaAccessQueryVariables }

export type MediaAccessOrder = MediaAccessQuery['ordersConnection']['orders'][0]

export type MediaAccessData = MediaAccessQuery

export type PhotoBasic = Pick<OrderPhoto, 'fullUrl' | 'id' | 'thumbUrl' | 'webUrl'>
export type PanoramaBasic = Pick<OrderPanorama, 'id' | 'thumbUrl' | 'fullUrl'>
