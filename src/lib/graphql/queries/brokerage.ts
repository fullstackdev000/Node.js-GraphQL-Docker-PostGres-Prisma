import gql from 'graphql-tag'

export const BrokerageOwner = gql`
  query brokerageOwner($id: Int!) {
    affiliate(where: { id: $id }) {
      id
      mediaExports {
        id
        height
        name
        resolution
        width
      }
      regions {
        id
        label
      }
    }
  }
`

export const Brokerage = gql`
  query Brokerage($brokerageId: Int!) {
    brokerage(where: { id: $brokerageId }) {
      id
      brokerSubsidy
      city
      companyName
      companyPay
      country
      profilePicture {
        path
      }
      defaultColorScheme {
        a
        b
        g
        r
      }
      discount
      displayAgentCompanyLogoOnTopOfEachTour
      emailOffice
      flyerDisclaimer
      flyerLayout
      hideAnimateNavigationBar
      hideFlyerFromRealEstateSiteTour
      owner {
        id
        mediaExports {
          id
          height
          name
          resolution
          width
        }
        regions {
          id
          label
        }
      }
      phone
      photoDownloadPresets {
        id
        photoPreset {
          id
          height
          name
          resolution
          width
        }
        enabled
        downloadTrigger
      }
      realEstateSiteMediaStyle
      region {
        id
        label
      }
      removeExternalLinksFromUnbrandedTourFooter
      removePhotographerBrandingFromBrandedTour
      removePhotographerBrandingFromUnbrandedTour
      removeRealEstateAddressFromUnbrandedTours
      showPatternOverlayOnSlideShowAndVideoOverviewTour
      showViewAdditionalPropertiesButtonOnTours
      removeExternalLinksFromUnbrandedTour
      removeOpenHouseBannerFromUnbrandedTour
      removeSocialMediaSharingFromUnbrandedTour
      showSearchBarOnGalleryHeader
      allowAdminAccessToCompanyListings
      allowAdminToPlaceOrdersOnBehalfAgent
      showRealEstateMapOnShowcasePage
      collectPayment
      showOfficesListing
      specialPricing
      state
      street
      templateId
      website
      zip
    }
  }
`

export const Brokerages = gql`
  query Brokerages($ownerId: Int) {
    brokerages (where: { owner: { id: $ownerId } }){
      id
      agents {
        id
      }
      city
      companyName
      companyPay
      country
      offices {
        id
      }
      region {
        label
      }
      specialPricing
      status
      state
      street
      zip
    }
  }
`
export const BrokeragesPaginated = gql`
  query BrokeragesPaginated(
    $skip: Int
    $first: Int
    $search: String
    $where: BrokerageWhereInput
    ) {
    brokeragesConnection (
      where: $where
      first: $first
      skip: $skip
      search: $search
    ) {
      totalCount
      brokerages {
        id
        agents {
          id
        }
        city
        companyName
        companyPay
        country
        offices {
          id
        }
        profilePicture {
          path
        }
        region {
          id
          label
        }
        specialPricing
        status
        state
        street
        zip
      }
    }
  }
`

export const CreateBrokerage = gql`
  mutation CreateBrokerage(
      $brokerSubsidy: Boolean
      $city: String!
      $companyName: String!
      $companyPay: Boolean
      $country: Country!
      $defaultColorScheme: ColorCreateInput!
      $discount: String
      $displayAgentCompanyLogoOnTopOfEachTour: Boolean
      $emailOffice: String
      $flyerDisclaimer: String
      $flyerLayout: FlyerLayoutName
      $hideAnimateNavigationBar: Boolean
      $hideFlyerFromRealEstateSiteTour: Boolean
      $owner: Int!
      $phone: String!
      $photoDownloadPresets: [EnabledPhotoPresetCreateInput!]!
      $realEstateSiteMediaStyle: RealEstateSiteMediaStyles!
      $regionId: Int!
      $removeExternalLinksFromUnbrandedTourFooter: Boolean
      $removePhotographerBrandingFromBrandedTour: Boolean
      $removePhotographerBrandingFromUnbrandedTour: Boolean
      $removeRealEstateAddressFromUnbrandedTours: Boolean
      $showPatternOverlayOnSlideShowAndVideoOverviewTour: Boolean
      $showViewAdditionalPropertiesButtonOnTours: Boolean
      $specialPricing: Boolean
      $state: State!
      $street: String!
      $website: String
      $zip: String!
      $coverPhoto: Upload
      $profilePicture: Upload
      $templateId: Int
    ) {
    createBrokerage(data: {
      brokerSubsidy: $brokerSubsidy
      city: $city
      companyName: $companyName
      companyPay: $companyPay
      country: $country
      defaultColorScheme: $defaultColorScheme
      discount: $discount
      displayAgentCompanyLogoOnTopOfEachTour: $displayAgentCompanyLogoOnTopOfEachTour
      emailOffice: $emailOffice
      flyerDisclaimer: $flyerDisclaimer
      flyerLayout: $flyerLayout
      hideAnimateNavigationBar: $hideAnimateNavigationBar
      hideFlyerFromRealEstateSiteTour: $hideFlyerFromRealEstateSiteTour
      owner: $owner
      phone: $phone
      photoDownloadPresets: $photoDownloadPresets
      realEstateSiteMediaStyle: $realEstateSiteMediaStyle
      regionId: $regionId
      removeExternalLinksFromUnbrandedTourFooter: $removeExternalLinksFromUnbrandedTourFooter
      removePhotographerBrandingFromBrandedTour: $removePhotographerBrandingFromBrandedTour
      removePhotographerBrandingFromUnbrandedTour: $removePhotographerBrandingFromUnbrandedTour
      removeRealEstateAddressFromUnbrandedTours: $removeRealEstateAddressFromUnbrandedTours
      showPatternOverlayOnSlideShowAndVideoOverviewTour: $showPatternOverlayOnSlideShowAndVideoOverviewTour
      showViewAdditionalPropertiesButtonOnTours: $showViewAdditionalPropertiesButtonOnTours
      specialPricing: $specialPricing
      state: $state
      street: $street
      website: $website
      zip: $zip
      coverPhoto: $coverPhoto
      profilePicture: $profilePicture
      templateId: $templateId
    }) {
      id
      companyName
    }
  }
`

export const UpdateBrokerage = gql`
  mutation updateBrokerage(
    $id: Int!
    $brokerSubsidy: Boolean
    $city: String
    $companyName: String
    $companyPay: Boolean
    $country: Country
    $defaultColorScheme: ColorUpdateDataInput
    $discount: String
    $displayAgentCompanyLogoOnTopOfEachTour: Boolean
    $emailOffice: String
    $flyerDisclaimer: String
    $flyerLayout: FlyerLayoutName
    $hideAnimateNavigationBar: Boolean
    $hideFlyerFromRealEstateSiteTour: Boolean
    $phone: String
    $profilePicture: Upload
    $photoDownloadPresets: [EnabledPhotoPresetUpdateInput!]
    $realEstateSiteMediaStyle: RealEstateSiteMediaStyles
    $regionId: Int
    $removeExternalLinksFromUnbrandedTourFooter: Boolean
    $removePhotographerBrandingFromBrandedTour: Boolean
    $removePhotographerBrandingFromUnbrandedTour: Boolean
    $removeRealEstateAddressFromUnbrandedTours: Boolean
    $showPatternOverlayOnSlideShowAndVideoOverviewTour: Boolean
    $showViewAdditionalPropertiesButtonOnTours: Boolean
    $removeExternalLinksFromUnbrandedTour: Boolean
    $removeOpenHouseBannerFromUnbrandedTour: Boolean
    $removeSocialMediaSharingFromUnbrandedTour: Boolean
    $showSearchBarOnGalleryHeader: Boolean
    $allowAdminAccessToCompanyListings: Boolean
    $allowAdminToPlaceOrdersOnBehalfAgent: Boolean
    $showOfficesListing: Boolean
    $specialPricing: Boolean
    $showRealEstateMapOnShowcasePage: Boolean
    $collectPayment: CollectPayment
    $state: State
    $status: ActivityStatus
    $street: String
    $templateId: Int
    $website: String
    $zip: String
  ) {
    updateBrokerage(
      data: {
        brokerSubsidy: $brokerSubsidy
        city: $city
        companyName: $companyName
        companyPay: $companyPay
        country: $country
        defaultColorScheme: $defaultColorScheme
        discount: $discount
        displayAgentCompanyLogoOnTopOfEachTour: $displayAgentCompanyLogoOnTopOfEachTour
        emailOffice: $emailOffice
        flyerDisclaimer: $flyerDisclaimer
        flyerLayout: $flyerLayout
        hideAnimateNavigationBar: $hideAnimateNavigationBar
        hideFlyerFromRealEstateSiteTour: $hideFlyerFromRealEstateSiteTour
        phone: $phone
        photoDownloadPresets: $photoDownloadPresets
        realEstateSiteMediaStyle: $realEstateSiteMediaStyle
        regionId: $regionId
        removeExternalLinksFromUnbrandedTourFooter: $removeExternalLinksFromUnbrandedTourFooter
        removePhotographerBrandingFromBrandedTour: $removePhotographerBrandingFromBrandedTour
        removePhotographerBrandingFromUnbrandedTour: $removePhotographerBrandingFromUnbrandedTour
        removeRealEstateAddressFromUnbrandedTours: $removeRealEstateAddressFromUnbrandedTours
        showPatternOverlayOnSlideShowAndVideoOverviewTour: $showPatternOverlayOnSlideShowAndVideoOverviewTour
        showViewAdditionalPropertiesButtonOnTours: $showViewAdditionalPropertiesButtonOnTours
        removeExternalLinksFromUnbrandedTour: $removeExternalLinksFromUnbrandedTour
        removeOpenHouseBannerFromUnbrandedTour: $removeOpenHouseBannerFromUnbrandedTour
        removeSocialMediaSharingFromUnbrandedTour: $removeSocialMediaSharingFromUnbrandedTour
        showSearchBarOnGalleryHeader: $showSearchBarOnGalleryHeader
        allowAdminAccessToCompanyListings: $allowAdminAccessToCompanyListings
        allowAdminToPlaceOrdersOnBehalfAgent: $allowAdminToPlaceOrdersOnBehalfAgent
        showOfficesListing: $showOfficesListing
        specialPricing: $specialPricing
        showRealEstateMapOnShowcasePage: $showRealEstateMapOnShowcasePage
        collectPayment: $collectPayment
        state: $state
        status: $status
        street: $street
        templateId: $templateId
        website: $website
        zip: $zip
        profilePicture: $profilePicture
      },
      where: $id
    ) {
      id
      status
    }
  }
`

export const ToggleBrokerageActivityStatus = gql`
  mutation toggleBrokerageActivityStatus(
    $id: Int!
    $status: ActivityStatus!
  ) {
    toggleBrokerageActivityStatus(
      data: {
        status: $status
      }
      where: $id
    ) {
      id
    }
  }
`

export const DeleteBrokerage = gql`
  mutation deleteBrokerage(
    $id: Int!
  ) {
    deleteBrokerage(where: {
      id: $id
    }) {
      id
    }
  }
`

export const MoveBrokerAgents = gql`
  mutation moveBrokerAgents(
    $fromId: Int!
    $toId: Int!
  ) {
    moveBrokerAgents(
      fromBrokerId: $fromId
      toBrokerId: $toId
    ) {
      id
    }
  }
`
