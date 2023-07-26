import { Affiliate, Order } from '#veewme/gen/graphqlTypes'
import { PhotoExportPreset } from '#veewme/lib/types'
import { Address, BillingFrequency, PaymentMethod, SocialMediaValues, TermsOfService, TourTemplate } from '#veewme/web/common/formPanels/valuesInterfaces'
import { EditorState } from 'draft-js'
import { RGBColor } from 'react-color'

export interface BillingValues {
  billingFrequency: BillingFrequency
  paymentMethods?: PaymentMethod[]
}

export interface Company {
  companyName: string
  profilePicture?: string
}

export interface AffiliateContactInfoValues {
  emailOffice?: string,
  phone: string,
  phoneOffice?: string,
  website?: string
}

export interface ColorSchemeValues {
  defaultColorScheme: RGBColor
}

export interface FauxVideoMusicValues {
  slideShowMusic?: number
  defaultFauxVideoMusic?: number
}

export interface HelperValues {
  featuredRealEstateSiteToAdd?: Order['id']
}

export interface MediaExportsValues {
  mediaExports: PhotoExportPreset[]
}

export interface PluginsValues {
  facebookTracking?: string
  googleTracking?: string
  messengerIntegration?: string
  plugin?: string
  zendeskIntegration?: string
}

export interface RealEstateSiteMediaGalleryValues {
  coverPhoto: string
  featuredRealEstateSites: Array<Order['id']>
  tourColor: RGBColor
}

// TODO use graphqlTypes Region
export interface Region {
  id: number
  label: string
}

export interface RegionsValues {
  regions: Region[]
}

export interface SettingsValues {
  allowClientBillingAccess: boolean
  allowClientMediaUpload: boolean
  allowClientOrders: boolean
  orderConfirmationEmailRider: boolean
  sendWelcomeEmailsToNewClients: boolean
  orderPageDefault: boolean
}

export interface UsefulLinksValues {
  realEstateSiteLink: string
  loginLink: string
  signupLink: string
}

export interface UserValues {
  email: string
  firstName: string
  lastName: string
  lastLogIn?: string
  joinDate?: string
}

export interface WhiteLabelValues {
  customDomain?: string
  enabled: boolean
}

export type EditAffiliateValues = {
  areasCovered?: EditorState
  description: EditorState
  id: Affiliate['id']
  user: UserValues
}
& Address
& AffiliateContactInfoValues
& BillingValues
& ColorSchemeValues
& Company
& FauxVideoMusicValues
& HelperValues
& MediaExportsValues
& PluginsValues
& RealEstateSiteMediaGalleryValues
& RegionsValues
& SettingsValues
& SocialMediaValues
& UsefulLinksValues
& WhiteLabelValues

export type AffiliateSettings = {
  id: Affiliate['id']
  user: UserValues
  externalUploadLink?: string
}
& ColorSchemeValues
& Company
& FauxVideoMusicValues
& HelperValues
& MediaExportsValues
& PluginsValues
& RealEstateSiteMediaGalleryValues
& SettingsValues
& SocialMediaValues
& UsefulLinksValues
& WhiteLabelValues
& TourTemplate
& TermsOfService
