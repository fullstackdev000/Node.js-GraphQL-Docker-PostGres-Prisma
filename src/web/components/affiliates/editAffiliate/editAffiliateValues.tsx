import { Address, CalendarSettings, SocialMediaValues } from '#veewme/web/common/formPanels/valuesInterfaces'
import { EditorState } from 'draft-js'
import {
  AffiliateContactInfoValues,
  BillingValues,
  ColorSchemeValues,
  Company,
  EditAffiliateValues,
  FauxVideoMusicValues,
  HelperValues,
  MediaExportsValues,
  PluginsValues,
  RealEstateSiteMediaGalleryValues,
  RegionsValues,
  SettingsValues,
  UsefulLinksValues,
  UserValues,
  WhiteLabelValues
 } from './types'

const address: Address = {
  city: '',
  country: 'US',
  state: 'AK',
  street: '',
  zip: ''
}

const billingValues: BillingValues = {
  billingFrequency: 'DAILY',
  paymentMethods: []
}

const company: Company = {
  companyName: ''
}

const contactInfo: AffiliateContactInfoValues = {
  emailOffice: '',
  phone: '',
  phoneOffice: '',
  website: ''
}

const fauxVideoMusicValues: FauxVideoMusicValues = {
}

const helperValues: HelperValues = {}

const mediaExportsValues: MediaExportsValues = {
  mediaExports: []
}

const pluginsValues: PluginsValues = {
  facebookTracking: '',
  googleTracking: '',
  messengerIntegration: '',
  plugin: '',
  zendeskIntegration: ''
}

const realEstateSiteMediaGalleryValues: RealEstateSiteMediaGalleryValues = {
  coverPhoto: '',
  featuredRealEstateSites: [],
  tourColor: {
    a: 1,
    b: 255,
    g: 166,
    r: 61
  }
}

const colorSchemeValues: ColorSchemeValues = {
  defaultColorScheme: {
    a: 1,
    b: 62,
    g: 204,
    r: 159
  }
}

const regionsValues: RegionsValues = {
  regions: []
}

const socialMediaValues: SocialMediaValues = {
  socialMedia: {
    facebookLink: '',
    instagramLink: '',
    linkedinLink: '',
    pinterestLink: '',
    twitterLink: ''
  }
}

const settingsValues: SettingsValues = {
  allowClientBillingAccess: true,
  allowClientMediaUpload: false,
  allowClientOrders: true,
  orderConfirmationEmailRider: false,
  orderPageDefault: false,
  sendWelcomeEmailsToNewClients: true
}

const user: UserValues = {
  email: '',
  firstName: '',
  lastName: ''
}

const usefulLinksValues: UsefulLinksValues = {
  loginLink: '',
  realEstateSiteLink: '',
  signupLink: ''
}

const whiteLabelValues: WhiteLabelValues = {
  customDomain: '',
  enabled: false
}

const calendarSettings: CalendarSettings = {
  calendarEndTime: '18:00',
  calendarFirstDay: 0,
  calendarShowBusinessHours: false,
  calendarShowWeather: true,
  calendarStartTime: '10:00',
  calendarTime12h: true
}

export const editAffiliateDefaultValues: EditAffiliateValues = {
  ...address,
  areasCovered: EditorState.createEmpty(),
  ...calendarSettings,
  ...colorSchemeValues,
  ...company,
  ...contactInfo,
  description: EditorState.createEmpty(),
  id: 0,  // TODO make optional in initial data
  ...fauxVideoMusicValues,
  ...mediaExportsValues,
  ...realEstateSiteMediaGalleryValues,
  ...settingsValues,
  ...usefulLinksValues,
  user,
  ...whiteLabelValues,
  ...billingValues,
  ...helperValues,
  ...pluginsValues,
  ...regionsValues,
  ...socialMediaValues
}
