import {
  Agent,
  CreateOrderMutationVariables,
  PaymentType,
  RealEstateCreateWithoutOrderInput,
  Service,
  ServiceCategoryState,
  TourWithoutRealEstateInput,
  User
} from '#veewme/gen/graphqlTypes'
import { CreditCard, Location, PromoCode, ShippingInfo } from '#veewme/lib/types'
import { PackageCard } from '#veewme/web/components/services/types'

export type ServiceCard = Pick<Service,
  | 'id'
  | 'category'
  | 'categoryLabel'
  | 'longDescription'
  | 'name'
  | 'serviceImage'
  | 'shortDescription'
  | 'suspended'
  | 'price'
  | 'note'
  | 'serviceType'
  | 'title'
> & {
  serviceImage?: Exclude<Service['serviceImage'], null>
}

export type ConvertedAgent = Pick<Agent,
  'id' |
  'showInternalNoteUponOrder' |
  'internalNote'> & Pick<User, 'firstName' | 'lastName'>

export type FetchedAgent = Pick<Agent,
  'id' |
  'showInternalNoteUponOrder' |
  'internalNote'> & { user: Pick<User, 'firstName' | 'lastName'> }

export interface OrderFormQueryData {
  addOnServices: ServiceCard[]
  agents: FetchedAgent[]
  servicePackages: PackageCard[]
  primaryServices: ServiceCard[]
  adminServices: ServiceCard[]
  addOnCategories: ServiceCategoryState[]
  primaryCategories: ServiceCategoryState[]
}

export interface NewOrderValues {
  amenityToAdd?: string
  orderTotal: number
  promoCodeId?: PromoCode['id']
  promoCodeToCheck?: string
  location: Location
  creditCard: CreditCard
  shippingInfo: ShippingInfo
  prefferedShootTime?: string
}

export interface TourFormData {
  descriptionFull?: NonNullable<TourWithoutRealEstateInput['descriptionFull']>
  descriptionShort?: NonNullable<TourWithoutRealEstateInput['descriptionShort']>
  displayAddress?: TourWithoutRealEstateInput['displayAddress']
  hideRealEstateHeadline?: NonNullable<TourWithoutRealEstateInput['hideRealEstateHeadline']>
  realEstateHeadline?: NonNullable<TourWithoutRealEstateInput['realEstateHeadline']>
}

export type RealEstateFormData = Pick<
  RealEstateCreateWithoutOrderInput,
  | 'agentPrimaryId'
  | 'city'
  | 'country'
  | 'state'
  | 'street'
  | 'zip'
> & {
  agentCoListingId?: NonNullable<RealEstateCreateWithoutOrderInput['agentCoListingId']>
  amenities: NonNullable<RealEstateCreateWithoutOrderInput['amenities']>
  bedrooms?: NonNullable<RealEstateCreateWithoutOrderInput['bedrooms']>
  bedroomsAboveGrade?: NonNullable<RealEstateCreateWithoutOrderInput['bedroomsAboveGrade']>
  bedroomsBelowGrade?: NonNullable<RealEstateCreateWithoutOrderInput['bedroomsBelowGrade']>
  customLatitude?: NonNullable<RealEstateCreateWithoutOrderInput['customLatitude']>
  customLongitude?: NonNullable<RealEstateCreateWithoutOrderInput['customLongitude']>
  showOnMap?: NonNullable<RealEstateCreateWithoutOrderInput['showOnMap']>
  billingFrequency?: NonNullable<RealEstateCreateWithoutOrderInput['billingFrequency']>
  currency?: NonNullable<RealEstateCreateWithoutOrderInput['currency']>
  fullBathrooms?: NonNullable<RealEstateCreateWithoutOrderInput['fullBathrooms']>
  garages?: NonNullable<RealEstateCreateWithoutOrderInput['garages']>
  halfBathrooms?: NonNullable<RealEstateCreateWithoutOrderInput['halfBathrooms']>
  homeSize?: NonNullable<RealEstateCreateWithoutOrderInput['homeSize']>
  homeSizeUnit?: NonNullable<RealEstateCreateWithoutOrderInput['homeSizeUnit']>
  listingType?: NonNullable<RealEstateCreateWithoutOrderInput['listingType']>
  lockBox?: NonNullable<RealEstateCreateWithoutOrderInput['lockBox']>
  lotSize?: NonNullable<RealEstateCreateWithoutOrderInput['lotSize']>
  lotSizeUnit?: NonNullable<RealEstateCreateWithoutOrderInput['lotSizeUnit']>
  name?: NonNullable<RealEstateCreateWithoutOrderInput['name']>
  occupied?: NonNullable<RealEstateCreateWithoutOrderInput['occupied']>
  parkingSpaces?: NonNullable<RealEstateCreateWithoutOrderInput['parkingSpaces']>
  price?: NonNullable<RealEstateCreateWithoutOrderInput['price']>
  realEstateStatus?: NonNullable<RealEstateCreateWithoutOrderInput['realEstateStatus']>
  rental?: NonNullable<RealEstateCreateWithoutOrderInput['rental']>
  tour?: TourFormData
  yearBuilt?: NonNullable<RealEstateCreateWithoutOrderInput['yearBuilt']>
}

export type CreateOrderVariables = Pick<CreateOrderMutationVariables,
  | 'serviceIds'
  | 'servicePackageId'
  | 'mlsPrimary'
  | 'mlsSecondary'
> & {
  notesForPhotographer?: NonNullable<CreateOrderMutationVariables['notesForPhotographer']>
  prefferedShootDate?: NonNullable<CreateOrderMutationVariables['prefferedShootDate']>
  promoCode?: NonNullable<CreateOrderMutationVariables['promoCode']>
  realEstate: RealEstateFormData
}

export type CreateOrderFormValues = NewOrderValues & CreateOrderVariables

// TODO: remove when 'rental' type is fixed in API
type EstateUpdateOmitProps = 'rental'
| 'agentPrimaryId'
| 'agentCoListingId'

type UpdateRealEstate = Omit<CreateOrderVariables['realEstate'], EstateUpdateOmitProps>

type UpdateOmitProps = 'serviceIds'
| 'servicePackageId'

export type UpdateOrderFormValues = Partial<Omit<CreateOrderVariables, UpdateOmitProps | 'realEstate'>> & {
  createdAt: string
  realEstate: UpdateRealEstate
  prefferedShootTime?: string
  templateId?: number
}

type RealEstateInit = UpdateRealEstate & {
  agentPrimary?: Pick<Agent, 'templateId'>
}
export interface UpdateOrderFormInitValues extends UpdateOrderFormValues {
  realEstate: RealEstateInit
}

export type OrderPaymentType = Exclude<PaymentType, 'GENERIC' | 'ON_DELIVERY'>
