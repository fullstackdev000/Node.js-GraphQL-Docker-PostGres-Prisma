import { Address, ContactInfo, NewOfficeValues, PhotoDownloadPreset } from '#veewme/web/common/formPanels/valuesInterfaces'

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
  regionId: 0, // TODO make optional in initial data
  website: ''
}

const photoDownloadPresets: PhotoDownloadPreset[] = []

const newOfficeValues: NewOfficeValues = {
  ...address,
  companyName: '',
  ...contactInfo,
  photoDownloadPresets
}

export default newOfficeValues
