import {
  Photo,
  RealEstate
} from '#veewme/gen/graphqlTypes'
import { RawDraftContentState } from 'draft-js'

export type RealEstateProps = 'street' | 'city' | 'state' | 'zip' | 'id' | 'homeSize' | 'listingType' | 'fullBathrooms' | 'halfBathrooms' | 'price' | 'currency' | 'bedrooms'
export type GalleryRealEstate = Pick<RealEstate, RealEstateProps> & {
  photos: Array<Pick<Photo, 'id' | 'thumbUrl'>>
  status?: 'Sold' | 'Pending'
}

export interface Contact {
  id?: number
  bio?: RawDraftContentState
  email: string
  name: string
  title: string
  description?: RawDraftContentState
  company: string
  mobile: string
  phone: string
  facebookUrl?: string
  websiteUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
  instagramUrl?: string
  pinterestUrl?: string
  imageUrl: string
  logo: string
}

export type Tours = Array<{
  id: number
  realEstate: GalleryRealEstate
}>

export interface Gallery {
  bannerUrl: string
  contact: Contact
  tours?: Tours
}
