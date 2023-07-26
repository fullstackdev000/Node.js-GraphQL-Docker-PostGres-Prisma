import { Affiliate, Brokerage, Color, EnabledPhotoPreset, PhotoPreset, Region } from '#veewme/gen/graphqlTypes'

export interface BrokerageOwnerQueryData {
  affiliate: BrokerageOwnerQueryResult
}

export type BrokerageOwnerQueryResult = Pick<Affiliate, 'id' | 'templateId'> & {
  mediaExports: Array<Pick<
      PhotoPreset,
      'id' | 'height' | 'name' | 'resolution' | 'width'
  >>
  regions: Array<Pick<Region, 'id' | 'label'>>
}

export interface BrokerageQueryData {
  brokerage: BrokerageQueryResult
}

export type BrokerageQueryResult = Pick<Brokerage,
  | 'id'
  | 'city'
  | 'companyName'
  | 'country'
  | 'flyerLayout'
  | 'phone'
  | 'realEstateSiteMediaStyle'
  | 'state'
  | 'street'
  | 'zip'
> & {
  brokerSubsidy?: boolean
  defaultColorScheme: Pick<
    Color,
    'a' | 'b' | 'g' | 'r'
  >
  companyPay?: boolean
  discount?: string
  displayAgentCompanyLogoOnTopOfEachTour?: boolean
  emailOffice?: string
  flyerDisclaimer?: string
  hideAnimateNavigationBar?: boolean
  hideFlyerFromRealEstateSiteTour?: boolean
  owner: BrokerageOwnerQueryResult
  photoDownloadPresets: Array<
    Pick<
      EnabledPhotoPreset,
      'id' | 'downloadTrigger' | 'enabled'
    > & {
      photoPreset: Pick<
        PhotoPreset,
        'id' | 'height' | 'name' | 'resolution' | 'width'
      >
    }
  >
  region: Pick<Region, 'id' | 'label'>
  removeExternalLinksFromUnbrandedTourFooter?: boolean
  removePhotographerBrandingFromBrandedTour?: boolean
  removePhotographerBrandingFromUnbrandedTour?: boolean
  removeRealEstateAddressFromUnbrandedTours?: boolean
  showPatternOverlayOnSlideShowAndVideoOverviewTour?: boolean
  showViewAdditionalPropertiesButtonOnTours?: boolean
  specialPricing?: boolean
  website?: string
}
