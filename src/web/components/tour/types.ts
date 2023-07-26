import {
  MediaInteractive
} from '#veewme/gen/graphqlTypes'
import { VideoItem } from '#veewme/web/common/video'
import { EmbedVideo, OrderDocument, OrderDocumentBase, OrderPanorama, OrderPhoto, OrderVideo } from '#veewme/web/components/media/types'
import { RawDraftContentState } from 'draft-js'
import { RGBColor } from 'react-color'

import { LatLng } from '#veewme/lib/types'
import { NoNullableFields } from '#veewme/web/common/util'

type Tab = 'OVERVIEW' | 'PHOTOS' | 'VIDEO' | 'PANORAMAS' | 'INTERACTIVES'
export interface CustomBanner {
  background: RGBColor
  text: string
}
export type BannerPhoto = Pick<OrderPhoto, 'id' | 'fullUrl'>
export type Photo = Pick<OrderPhoto, 'id' | 'fullUrl' | 'thumbUrl' | 'title'>
export type DocumentItemData = OrderDocumentBase & Pick<OrderDocument, 'downloadUrl'>

export type Interactive = Pick<NoNullableFields<MediaInteractive>, 'id' | 'label' | 'type' | 'embeddedCode' | 'theaterMode'> & {
  files: Array<{
    id: number
    label: string
    file: {
      id: number
      path: string
    }
  }>
}

export type HorizontalDir = 'LEFT' | 'RIGHT' | 'CENTER'
export type VerticalDir = 'UP' | 'DOWN' | 'CENTER'
export type ZoomDir = 'IN' | 'OUT' | 'NO_ZOOM'

export type KenburnsBannerPhoto = BannerPhoto & {
  slideVerticalDir?: VerticalDir,
  slideHorizontalDir?: HorizontalDir,
  zoomDir?: ZoomDir
}

export type DescriptionName = 'BEDS' | 'BATHS/HALF' | 'GARAGES' | 'YEAR' | 'INTERIOR' | 'LOT'
export interface DescriptionItem {
  name: DescriptionName
  value: string | number
}

export interface ContactPerson {
  id?: number
  name: string
  title: string
  email?: string
  company: string
  faxNumber: string
  mobile: string
  officeNumber: string
  profileUrl?: string
  facebookUrl?: string
  websiteUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
  instagramUrl?: string
  pinterestUrl?: string
  profilePictureUrl?: string
}

export type VideoEmbeddedItem = Pick<EmbedVideo, 'embeddedCode'> & Pick<OrderVideo, 'id' | 'label' | 'theaterMode'> & {
  type: 'Embed'
}

export type VideoUrl = VideoItem & Pick<OrderVideo, 'theaterMode'>

export interface Tour {
  address: string
  addressFull: {
    city: string
    state: string
    street: string
    zip: string
  }
  amenities: string[]
  rawPrice: number
  price: string
  headerRightComponent: 'Price' | 'Call' | 'Logo'
  headerLogoUrl: string
  hideRealEstateHeadline?: boolean
  visibleTabs: Tab[]
  mainColor: RGBColor
  brochureUrl: string
  bannerPhotos: BannerPhoto[] | KenburnsBannerPhoto[]
  photos: Photo[]
  documents: DocumentItemData[]
  interactives: Interactive[]
  slideshowAudioSrc: string
  customBanner: CustomBanner
  title: string
  descriptionText?: RawDraftContentState
  descriptionItems: DescriptionItem[]
  contactPerson: ContactPerson
  contactPerson2?: ContactPerson
  bannerType?: 'SIMPLE' | 'KENBURNS'
  videos: Array<VideoUrl | VideoEmbeddedItem>
  panoramas: Array<Omit<OrderPanorama, 'fileName' | 'title' | 'date' | 'type'>>
  listingType: string
  coordinates: LatLng
  showMap?: boolean
  previewMode?: boolean
}
