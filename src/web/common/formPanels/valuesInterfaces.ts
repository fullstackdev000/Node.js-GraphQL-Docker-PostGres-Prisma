import {
  Affiliate,
  Brokerage,
  Country,
  FlyerLayoutName,
  PhotoDownloadTriggers,
  RealEstateSiteMediaStyles,
  State,
  UserCreateInput,
  UserSignupInput
} from '#veewme/gen/graphqlTypes'
import { FileValue, PhotoExportPreset } from '#veewme/lib/types'
import { DaysOfWeek } from '#veewme/web/components/calendar/types'
import { EditorState } from 'draft-js'
import { RGBColor } from 'react-color'

// TODO import from '#veewme/gen/graphqlTypes' when ready
export type BillingFrequency = 'BIWEEKLY' | 'DAILY' | 'MONTHLY' | 'WEEKLY'

export interface Address {
  city: string
  country: Country
  state: State
  street: string
  zip: string
}

// TODO remove logo from Company when added to CompanyCreateInput
export interface Company {
  companyName: string
  logo?: string
  profilePicture?: File
}

// TODO most probably remove (to check if still needed)
export interface ContactInfo {
  emailCC?: string
  emailCCorderPlaced?: boolean
  emailCCorderCompleted?: boolean
  emailOffice?: string
  phone: string
  phoneAlternate?: string
  phoneMobile?: string
  phoneOffice?: string
  regionId: number
  website?: string
}

export interface DefaultColorSchemeValues {
  defaultColorScheme: RGBColor
}

export interface FeesValues {
  brokerSubsidy?: boolean
  collectPayment?: 'ORDER' | 'DELIVERY'
  companyPay?: boolean
  discount?: string
  specialPricing?: boolean
}

export interface PaymentMethod {
  cardName: 'American Express' | 'MasterCard' | 'Visa'
  icon: React.SVGFactory
}

export interface PaymentMethodValues {
  paymentMethods?: PaymentMethod[]
}

export interface AgentNotificationValues {
  newTourOrder?: boolean
  tourActivated?: boolean
}

export interface PhotoPresetsValues {
  photoPresets: PhotoExportPreset[]
}

export interface PhotoDownloadPreset {
  id?: number
  downloadTrigger: PhotoDownloadTriggers
  enabled: boolean
  photoPreset: PhotoExportPreset
}

export interface PhotoDownloadPresetValues {
  photoDownloadPresets: PhotoDownloadPreset[]
}

export interface RealEstateFlyer {
  flyerDisclaimer?: string
  flyerLayout: FlyerLayoutName
  hideFlyerFromRealEstateSiteTour?: boolean
}

// TODO import type from graphqlTypes when ready
export interface RealEstateSiteMediaShowcase {
  showRealEstateMapOnShowcasePage: boolean
}

export interface RealEstateSiteMediaShowcaseValues {
  realEstateSiteMediaShowcase: RealEstateSiteMediaShowcase
}

export interface RealEstateSiteTourSettingsValues {
  adminChargeEmailNotification?: boolean
  allowAdminAccessToCompanyListings?: boolean
  allowAdminToPlaceOrdersOnBehalfAgent?: boolean
  appointmentEmailConfirmation?: boolean
  photographerAssignedServiceEmail?: boolean
  removeExternalLinksFromUnbrandedTour?: boolean
  removePhotographerBrandingFromBrandedTour?: boolean
  removePhotographerBrandingFromUnbrandedTour?: boolean
  removeRealEstateAddressFromUnbrandedTours?: boolean
  removeOpenHouseBannerFromUnbrandedTour?: boolean
  removeSocialMediaSharingFromUnbrandedTour?: boolean
  showOfficesListing?: boolean
  showSearchBarOnGalleryHeader?: boolean
  showViewAdditionalPropertiesButtonOnTour?: boolean
  newOrderEmailNotification?: boolean
  propertySiteActivatedEmail?: boolean
  showSearchOnGalleryPage?: boolean
}

export type User = UserCreateInput & {
  joinDate?: string
  lastLogIn?: string
}

export interface UserValues {
  user: User
}

export type UserSignup = UserSignupInput

export interface UserSignupValues {
  user: UserSignup
  passwordConfirm: string
}

// TODO remove BrokerValues while updating signup otions (no signup as Broker)
export type BrokerSignupValues = Address & Company & Pick<ContactInfo, 'phone' | 'website'> & UserSignupValues & SurveyValues
export type AffiliateSignupValues = Address & Company & Pick<ContactInfo, 'phone' | 'website'> & UserSignupValues & SurveyValues
export type SelfServiceAgentValues = Pick<ContactInfo, 'phone' | 'website'> & UserSignupValues & SurveyValues

export type NewClientValues = Address & ContactInfo

// TODO: remove unused fields
export type BrokerFormValues = {
  ownerId: Affiliate['id']
  music?: string
  templateId?: number
  realEstateSiteMediaStyle: RealEstateSiteMediaStyles
} & Address
  & ContactInfo
  & Company
  & DefaultColorSchemeValues
  & PhotoDownloadPresetValues
  & FeesValues
  & RealEstateFlyer
  & RealEstateSiteTourSettingsValues
  & RealEstateSiteMediaShowcaseValues

export type BrokerSettingsFormValues = {
  ownerId: Affiliate['id']
  music?: string
  realEstateSiteMediaStyle: RealEstateSiteMediaStyles
} & DefaultColorSchemeValues
  & PhotoDownloadPresetValues
  & FeesValues
  & RealEstateFlyer
  & RealEstateSiteTourSettingsValues
  & RealEstateSiteMediaShowcaseValues

export type AgentValues = {
  id?: number
  affiliateId?: Affiliate['id']
  agentMLSid: string
  bio: EditorState
  brokerageId: Brokerage['id']
  coverPhoto?: FileValue
  designations: string
  internalNote?: string
  showInternalNoteUponOrder?: boolean
  others: string
  profilePicture?: FileValue
  profileUrl: string
  title: string
} & Address
  & ContactInfo
  & PaymentMethodValues
  & AgentNotificationValues
  & RealEstateFlyer
  & UserValues
  & (// TODO old types still to fit to backend
    PluginsTrackingValues
    & SocialMediaValues
  )

export type AgentAccountValues = {
  affiliateId?: Affiliate['id']
  agentAvatar?: string // TODO replace with File when File is implemented to avatar
  agentMLSid: string
  bio: EditorState
  brokerageId?: Brokerage['id']
  designations: string
  internalNote?: string
  officeAdmin?: boolean
  brokerAdmin?: boolean
  others: string
  profileUrl: string
  title: string
} & Address
  & Omit<ContactInfo, 'regionId'>
  & PaymentMethodValues
  & AgentNotificationValues
  & RealEstateFlyer
  & UserValues
  & (// TODO old types still to fit to backend
    PluginsTrackingValues
    & SocialMediaValues
  )

export type BrokerageValues = Pick<Brokerage, 'id' | 'companyName'> & {
  logoUrl: string
}

export type NewOfficeValues =
  PhotoDownloadPresetValues
  & Company
  & Address
  & ContactInfo

// TODO check what is still used of the old interfaces below
export interface PluginsTracking {
  facebookTracking?: string
  googleTracking?: string
  plugin?: string
}
export interface PluginsTrackingValues {
  pluginsTracking?: PluginsTracking
}

export interface SocialMedia {
  facebookLink?: string
  instagramLink?: string
  linkedinLink?: string
  pinterestLink?: string
  twitterLink?: string
}
export interface SocialMediaValues {
  socialMedia?: SocialMedia
}

export interface SurveyFields {
  currentlyUsingManagingApp: boolean
  heardAboutUsFrom: string
  importantThingsInManagingApp: string
  other: string
  toursYearly: string
  platformName: string
}
export interface SurveyValues { survey?: SurveyFields }

export interface TourTemplate {
  templateId?: number
  tourColor: RGBColor
}

export interface TermsOfService {
  termsOfService?: EditorState
}

export interface CalendarSettings {
  calendarStartTime: string,
  calendarEndTime: string
  calendarFirstDay: number
  calendarTime12h: boolean
  calendarShowWeather: boolean
  calendarShowBusinessHours: boolean
}

export { DaysOfWeek }
