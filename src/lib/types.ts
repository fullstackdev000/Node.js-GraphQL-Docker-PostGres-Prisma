// TODO replace those types with graphql ones when each is ready

import * as GraphQLTypes from '#veewme/graphql/types'
import { RawDraftContentState } from 'draft-js'
import { Request } from 'express'
import { Prisma as PrismaBinding } from 'prisma-binding'
import { RGBColor } from 'react-color'

export interface FileValue {
  id?: string
  file?: File
  filename?: string
  path?: string
}

export interface Affiliate {
  id: number
  name: string
  address: Address
  companyName: string
}

export interface AgentOfAffiliate {
  id: number
  phoneMobile: string,
  user: {
    firstName: string,
    lastName: string
  }
}

export interface Broker {
  id: string
  name: string
  logoUrl: string
}

export interface Card {
  id: number
  title: string
  suspended?: boolean
}

export interface PackageCard extends Card {
  services: Array<{ name: string }>
  price: number
  oldPrice?: number
}

export interface ServiceCard extends Card {
  longDescription: string
  image?: string
  price: number
  serviceCategoryId: number
  serviceType?: GraphQLTypes.ServiceType
  shortDescription?: RawDraftContentState
}

export interface Agent {
  id: number
  firstName: string
  lastName: string
  email: string
  pin: boolean // from faker order
}

export interface Country {
  id: string
  name: string
}

export interface State {
  id: string
  name: string
}

export interface Address {
  street: string
  city: string
  stateId: State['id']
  countryId: Country['id']
  zip: string
}

export interface AddressForGeoCoordinates {
  street: string
  city: string
  zip: string
  country: string
}

export type RealEstateAddress = {
  dontShowOnSite: boolean
} & Address

export enum Occupancy {
  Occupied = 'occupied',
  Vacant = 'vacant'
}

export interface ShootInfo {
  date?: Date
  time?: string
  occupancy: Occupancy
  note?: string
  lockBox: boolean
}

export enum RentalPeriod {
  Month = 'month',
  Week = 'week',
  Day = 'day'
}

export type Amenity = 'Air Conditioning' | 'Washer and Dryer' | 'Washer and Dryer Hookups' | 'Furniture' | 'Patio' | 'Fireplace' | 'Wi-Fi' | string

export interface LatLng {
  lat: number
  lng: number
}

export interface Location {
  dontDisplay: boolean
  name: string
  latLng: LatLng
  zoom: number
}

export interface CreditCard {
  cardNumber: string
  expiration: string
  CVC: string
}

export interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  address: {
    street: string
    city: string
    state: GraphQLTypes.State
    country: GraphQLTypes.Country
    zip: string
  }
}

export interface Job {
  id: string
}
// services order set up in services for New Order step 1
export type ServicesOrder = Array<Card['id']>

export interface ImageDimensions {
  height: number
  width: number
}

export type FlyerLayoutName =
  | 'featured1'
  | 'featured1minor5'
  | 'featured2minor3'
  | 'featured2minor6'
  | 'featured2minor6withHorizontalBars'

export interface DateRange {
  start: Date
  end: Date
}

export interface AffiliatePhotoExportPreset {
  id?: number
  name: string
  width: number
  height: number
  resolution: number
}

export interface PhotoExportPreset extends AffiliatePhotoExportPreset {
  id: number
}

export enum PromoCodeValidity {
  OnceOnly = 'Once Only',
  MultipleTimes = 'Multiple Times',
  OncePerAgent = 'Once per Agent',
  Unlimited = 'Unlimited'
}

export type DiscountType = 'amount' | 'percent'
export type DiscountExpireDate = 'unlimited' | Date

// TODO replace with graphql generated type
export interface PromoCode {
  id: number
  code: string
  affiliateId: Affiliate['id']
  serviceId?: GraphQLTypes.Service['id']
  description: string
  discount: number
  discountType: DiscountType
  expireDate: DiscountExpireDate
  usageCount: number
  validity: PromoCodeValidity
}

// TODO replace with graphql generated type
export interface PopupAd {
  id: string
  actionButtonNote?: string
  description: string
  footNote: string
  imageUrl: string
  region?: string
  headline: string
}

export interface TourBanner {
  id: number
  color: RGBColor
  label: string
  blackText?: boolean
}

export interface Color {
  a: number
  b: number
  g: number
  r: number
}

export function isDateRange (arg: any): arg is DateRange {
  // TODO: use ts-transformer-keys
  return arg && arg instanceof Object &&
    'start' in arg && arg.start instanceof Date &&
    'end' in arg && arg.end instanceof Date
}

export enum CnameStatus {
  WRONG_VALUE = 'WRONG_VALUE',
  SUCCESS = 'SUCCESS',
  NOT_EXIST = 'NOT_EXIST'
}

type AccountID =
  | GraphQLTypes.Admin['id']
  | GraphQLTypes.Affiliate['id']
  | GraphQLTypes.Agent['id']
  | GraphQLTypes.Developer['id']
  | GraphQLTypes.Photographer['id']
  | GraphQLTypes.Processor['id']

export interface Context {
  accountId?: AccountID
  prismaBinding: PrismaBinding
  request?: Request
  role?: GraphQLTypes.Role
  userId?: GraphQLTypes.User['id']
}

export interface AuthContext extends Context {
  accountId: AccountID
  role: GraphQLTypes.Role
  userId: GraphQLTypes.User['id']
}

export type SessionType = Pick<Express.SessionData, 'cookie'> & Pick<Context, 'accountId' | 'role' | 'userId'>
