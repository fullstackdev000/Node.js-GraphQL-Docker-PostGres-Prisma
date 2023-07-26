import { realEstateSiteTourSettingsInitialValues } from '#veewme/web/common/formPanels/siteTourSettings'
import { Address, BrokerFormValues, ContactInfo, FeesValues, PhotoDownloadPreset, RealEstateFlyer, RealEstateSiteMediaShowcase } from '#veewme/web/common/formPanels/valuesInterfaces'
import { RGBColor } from 'react-color'

const address: Address = {
  city: '',
  country: 'US',
  state: 'AK',
  street: '',
  zip: ''
}

const contactInfo: ContactInfo = {
  emailOffice: '',
  phone: '',
  phoneMobile: '',
  regionId: 0, // TODO make optional in initial data
  website: ''
}

const defaultColorScheme: RGBColor = {
  a: 1,
  b: 62,
  g: 204,
  r: 159
}

const fees: FeesValues = {
  brokerSubsidy: false,
  companyPay: false,
  discount: '',
  specialPricing: false
}

const photoDownloadPresets: PhotoDownloadPreset[] = []

const realEstateFlyerLayout: RealEstateFlyer = {
  flyerDisclaimer: '',
  flyerLayout: 'FEATURED1',
  hideFlyerFromRealEstateSiteTour: false
}

const realEstateSiteMediaShowcase: RealEstateSiteMediaShowcase = {
  showRealEstateMapOnShowcasePage: true
}

const brokerFormValues: BrokerFormValues = {
  ...address,
  companyName: '',
  ...contactInfo,
  defaultColorScheme,
  ...fees,
  music: '',
  ownerId: 0, // TODO make optional in initial data
  photoDownloadPresets,
  ...realEstateFlyerLayout,
  realEstateSiteMediaShowcase,
  realEstateSiteMediaStyle: 'MODERN',
  ...realEstateSiteTourSettingsInitialValues
}

export default brokerFormValues
