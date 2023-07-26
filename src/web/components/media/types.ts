
// TODO rename star to featured
export interface OrderPhoto {
  id: number
  title: string
  thumbUrl: string
  fullUrl: string
  hidden: boolean
  inVideo?: boolean
  star: boolean
  date: string
  createdAt?: string
  inFlyer?: boolean
  fileName: string
  webUrl: string
}

export type PanoramaType = 'SPHERICAL' | 'CYLINDRICAL'

export interface OrderPanorama {
  id: number
  fileName: string
  date: string
  title: string
  thumbUrl: string
  initialZoom: number
  initialHorizontalAngle: number
  initialVerticalAngle: number
  type: PanoramaType
  theaterMode: boolean
  hfov: number
  fullUrl: string
}

export interface PanoramaToUpload {
  id: string
  name: string
  type: PanoramaType
  hfov: number
  thumb: string
  size: number
}

export interface PhotosSelection {
  [photoId: number]: boolean
}

export interface Sort {
  fieldName: keyof OrderPhoto,
  orderDesc: boolean
}

export interface OrderDocument {
  id: number
  size: number
  extension: string
  label: string
  appearance: Appearance
  downloadUrl: string
}

export type OrderDocumentBase = Pick<OrderDocument, 'id' | 'label' | 'extension' | 'size'>

export type OrderDocumentDetails = Pick<OrderDocument, 'id' | 'label' | 'appearance' | 'downloadUrl'>

export type Appearance = 'Always' | 'Branded' | 'Hide' | 'Unbranded'

export enum DefaultMedia {
  Video = 'Video',
  Interactive = 'Interactive',
  Overview = 'Overview'
}

export type InteractiveType = 'EMBEDDED' | 'FLOORPLAN_PHOTOS'
export interface InteractivePhoto {
  id?: number
  file?: File
  label: string
  fullUrl: string
}

export interface OrderInteractive {
  id: number
  label: string
  type: InteractiveType
  appearance: Appearance
  embeddedCode: string
  url: string
  photos?: InteractivePhoto[]
  theaterMode?: boolean
}

export type OrderInteractiveBase = Pick<OrderInteractive, 'id' | 'label' | 'type'>

export type OrderInteractiveDetails = Pick<OrderInteractive, 'appearance' | 'embeddedCode' | 'url' | 'label' | 'type' | 'photos' | 'theaterMode'>

export type VideoTypes = 'Hosted' | 'URL' | 'Embed' | 'Faux'

export type VideoCategory = 'Properties' | 'Agents' | 'Flyover' | 'Developments' | 'Neighborhoods'
| 'MarketReports'

export interface OrderVideo {
  appearance: Appearance
  id: number
  category: VideoCategory
  date: string
  fileName?: string
  thumbUrl?: string
  type: VideoTypes
  error?: boolean
  label: string
  theaterMode: boolean
  url?: string
  embeddedCode?: string
}

export type OrderVideoBase = Omit<OrderVideo, 'theaterMode'> & {
  photos?: Array<Pick<OrderPhoto, 'thumbUrl'>>
}

export type VideoBasicDetails = Pick<OrderVideo, 'appearance' | 'theaterMode' | 'label'>

export interface EmbedVideo extends VideoBasicDetails {
  embeddedCode: string
}

export interface UrlVideo extends VideoBasicDetails {
  url: string
}

export interface HostedVideo extends VideoBasicDetails {
  category?: VideoCategory
  overview?: boolean
  file?: File
  thumbId?: OrderPhoto['id']
}

export type GenerateOption = 'Branded' | 'Unbranded' | 'Package'

export interface FauxVideo extends VideoBasicDetails {
  audio: string
  generateOption: GenerateOption
  includeCaptions: boolean
  thumbId?: OrderPhoto['id']
  photos: Array<OrderPhoto['id']>
  slideDuration: number
  slideTransition: 'Fade' | 'Slide' | 'Crossfade'
}
