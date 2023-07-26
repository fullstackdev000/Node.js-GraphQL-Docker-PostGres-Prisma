interface URLlist {
  [urlName: string]: string
}

const privatePage = '/panel'
const publicPage = ''

const account = `${privatePage}/account`
const accountSettings = `${privatePage}/account-settings`
const affiliates = `${privatePage}/affiliates`
const clients = `${privatePage}/clients`
const dashboard = `${privatePage}/`
const dev = `${privatePage}/dev` // TODO TMP demo pages for testing components,
const employees = `${privatePage}/employees`
const jobs = `${privatePage}/jobs`
const orders = `${privatePage}/orders`
const mediaAccess = `${privatePage}/media-access`
const panel = `${privatePage}/`
const photographers = `${privatePage}/fulfillment`
const realEstates = `${privatePage}/real-estates`
const services = `${privatePage}/services`
const settings = `${privatePage}/settings`
const support = `${privatePage}/support`
const mySupportCore = `${privatePage}/my-support`
const mySupport = `${mySupportCore}/:id`
const domains = `${privatePage}/domains`
const calendar = `${privatePage}/calendar`
const subscription = `${privatePage}/subscription`
const finalizeSplitPayment = `${privatePage}/finalize-split-payment/:id`
const compensation = `${privatePage}/compensation`

const accountUrls: URLlist = {
  account,
  accountSettings,
  accountSettingsPath: `${accountSettings}/:type/:id`,
  changePassword:  `${account}/change-password`
}

const affiliatesUrls: URLlist = {
  affiliates,
  editAffiliate: `${affiliates}/:affiliateId`
}

const clientsUrls: URLlist = {
  addAgent: `${clients}/agent/add`,
  addBrokerage: `${clients}/brokerage/add`,
  addOffice: `${clients}/office/add`,
  agent: `${clients}/agent`,
  agents: `${clients}/agents`,
  brokerages: `${clients}/brokerages`,
  clients,
  editAgent: `${clients}/agent/:agentId`,
  editBrokerage: `${clients}/brokerages/:brokerageId`,
  offices: `${clients}/offices`
}

// TODO TMP demo pages for testing components
const devUrls: URLlist = {
  demoAffiliateCalendar: `${dev}/demo-affiliate-calendar`,
  demoApi: `${dev}/demo-api`,
  demoAvatars: `${dev}/demo-avatars`,
  demoButtons: `${dev}/demo-buttons`,
  demoCalendar: `${dev}/demo-calendar`,
  demoChips: `${dev}/demo-chips`,
  demoDisplayArticle: `${dev}/demo-display-article`,
  demoForm: `${dev}/demo-form`,
  demoFormAlt: `${dev}/demo-form-alternative`,
  demoGridNoContent: `${dev}/demo-grid-no-content`,
  demoMedia: `${dev}/demo-media`,
  demoModals: `${dev}/demo-modals`,
  demoPayment: `${dev}/demo-payment`,
  demoPhotosUpload: `${dev}/demo-photos-upload`,
  demoReport: `${dev}/demo-report`,
  demoSpinners: `${dev}/demo-spinners`,
  demoToasts: `${dev}/demo-toast`,
  demoUpload: `${dev}/demo-upload`,
  demoUploadImages: `${dev}/demo-upload-images`,
  demoValidation: `${dev}/demo-validation`,
  dev
}

const emplyeesUrls: URLlist = {
  addEmployee: `${employees}/add`,
  editEmployee: `${employees}/:employeeId`,
  employees
}

const ordersUrls: URLlist = {
  addOrder: `${orders}/order/add`,
  editOrder: `${orders}/order/:orderId/edit`,
  media: `${orders}/order/:orderId/media`,
  mediaOnly: `${orders}/media_only`,
  order: `${orders}/order/:orderId`,
  orderCalendar: `${orders}/order/:orderId/calendar`,
  orderDetails: `${orders}/order/:orderId/details`,
  orders,
  pendingOrders: `${orders}/pending`
}

const realEstate = `${realEstates}/real-estate`
const realEstatesUrls: URLlist = {
  media: `${realEstate}/:realEstateId/media`,
  realEstate
}

const realEstateMediaUrls: URLlist = {
  addInteractive: `${realEstatesUrls.media}/interactive/add`,
  addVideo:  `${realEstatesUrls.media}/video/add`,
  document: `${realEstatesUrls.media}/documents/document`,
  documents: `${realEstatesUrls.media}/documents`,
  editDocument: `${realEstatesUrls.media}/documents/document/:documentId`,
  editInteractive: `${realEstatesUrls.media}/interactive/:interactiveId`,
  editPanorama: `${realEstatesUrls.media}/panoramas/:panoramaId`,
  editVideo: `${realEstatesUrls.media}/video/edit`,
  editVideoType: `${realEstatesUrls.media}/video/edit/:type/:videoId`,
  flyer: `${realEstatesUrls.media}/flyer`,
  interactive: `${realEstatesUrls.media}/interactive`,
  panoramas: `${realEstatesUrls.media}/panoramas`,
  photos: `${realEstatesUrls.media}/photos`,
  video: `${realEstatesUrls.media}/video`
}

const mediaAccessUrls: URLlist = {
  mediaAccess
}

const photographersUrls: URLlist = {
  addPhotographer: `${photographers}/photographer/add`,
  addProcessor: `${photographers}/processor/add`,
  editPhotographer: `${photographers}/photographers/edit/:photographerId`,
  editProcessor: `${photographers}/processors/edit/:processorId`,
  photographers,
  photographersList: `${photographers}/photographers`,
  processors: `${photographers}/processors`
}

const editPackageCore = `${services}/package/edit`
const editServiceCore = `${services}/service/edit`
const servicesUrls: URLlist = {
  addPackage: `${services}/package/add`,
  addPopup: `${services}/popup/add`,
  addPromoCode: `${services}/codes/add`,
  addService: `${services}/service/add`,
  codes: `${services}/codes`,
  editPackage: `${editPackageCore}/:id`,
  editPackageCore,
  editService: `${editServiceCore}/:id`,
  editServiceCore,
  popup: `${services}/popup`,
  services
}

// TODO temporary jobs pages for testing components
const jobsUrls: URLlist = {
  adminOrders: `${jobs}/admin`,
  agentOrders: `${jobs}/agent`,
  jobs,
  photographerOrders: `${jobs}/photographer`,
  processorOrders:  `${jobs}/processor`
}

const settingsUrls: URLlist = {
  addTourBanner: `${settings}/banners/add`,
  editTourBanner: `${settings}/banners/:bannerId`,
  platform: `${settings}/platform`,
  settings,
  tourBanners: `${settings}/banners`
}

export const privateUrls: URLlist = {
  ...accountUrls,
  ...affiliatesUrls,
  ...clientsUrls,
  calendar,
  compensation,
  dashboard,
  domains,
  finalizeSplitPayment,
  ...devUrls,
  ...emplyeesUrls,
  ...jobsUrls,
  ...mediaAccessUrls,
  ...ordersUrls,
  mySupport,
  mySupportCore,
  panel,
  ...photographersUrls,
  privatePage,
  ...realEstatesUrls,
  ...realEstateMediaUrls,
  ...servicesUrls,
  ...settingsUrls,
  subscription,
  support
}

const auth = `${publicPage}/auth`
const authUrls: URLlist = {
  auth,
  login: `${auth}/login`,
  logout: `${auth}/logout`,
  reset:  `${auth}/reset`,
  setPassword: `${auth}/set-password`,
  signup: `${publicPage}/signup`
}

const tour = `${publicPage}/tour/:tourId/l/:layoutId`

const tourUrls: URLlist = {
  tour,
  tourInteractives: `${tour}/interactive/:id?`,
  tourPanorama: `${tour}/panorama/`,
  tourPhotos: `${tour}/photos`,
  tourVideo: `${tour}/video/:id?`
}

const toursGalleryRoot = `${publicPage}/gallery`
const toursGalleryUrls: URLlist = {
  toursGallery: `${toursGalleryRoot}/:type/:id`,
  toursGalleryRoot

}

export const publicUrls: URLlist = {
  ...authUrls,
  ...toursGalleryUrls,
  ...tourUrls,
  contact: '#contact',
  facebook: 'https://www.facebook.com/pages/VeewMe/1540422136185736',
  landingPage: `${publicPage}/`,
  pricing: `${publicPage}/pricing`,
  privacyPolicy: `${publicPage}/privacy_policy`,
  publicPage: `${publicPage}/`,
  termsAndConditions: `${publicPage}/terms_and_conditions`,
  tours: `${publicPage}/#example_tours`,
  twitter: 'https://twitter.com/veewme'
}
