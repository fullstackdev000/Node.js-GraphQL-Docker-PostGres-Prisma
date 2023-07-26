import gql from 'graphql-tag'

export const UserData = gql`
  fragment UserData on Agent {
    user {
      email
      firstName
      lastName
      role
      joinDate
      lastLogIn
    }
  }
`

export const AgentAccount = gql`
  ${UserData}

  query AgentAccount($id: Int!) {
    agent (where: { id: $id }) {
      id
      affiliate {
        id
        brokerages {
          id
          companyName
        }
        regions {
          id
          label
        }
      }
      agentMLSid
      bio
      brokerage {
        id
      }
      city
      country
      coverPhoto {
        path
      }
      defaultColorScheme {
        a
        b
        g
        r
      }
      designations
      displayAgentCompanyLogoOnTopOfEachTour
      emailCC
      emailCCOnorderCompleted
      emailCCOnorderPlaced
      emailOffice
      hideAnimateNavigationBar
      others
      phone
      phoneMobile
      phoneAlternate
      profilePicture {
        path
      }
      profileUrl
      region { id }
      removeExternalLinksFromUnbrandedTourFooter
      removePhotographerBrandingFromBrandedTour
      removePhotographerBrandingFromUnbrandedTour
      removeRealEstateAddressFromUnbrandedTours
      showPatternOverlayOnSlideShowAndVideoOverviewTour
      showViewAdditionalPropertiesButtonOnTours
      status
      state
      street
      title
      ...UserData
      website
      zip
      facebookLink
      instagramLink
      linkedinLink
      pinterestLink
      twitterLink
    }
  }
`

export const Agent = gql`
  ${UserData}

  query Agent($id: Int!) {
    agent(where: { id: $id }) {
      id
      agentMLSid
      affiliate {
        id
        brokerages {
          id
          companyName
        }
        regions {
          id
          label
        }
      }
      bio
      brokerage {
        id
        templateId
      }
      city
      country
      coverPhoto {
        path
      }
      defaultColorScheme {
        a
        b
        g
        r
      }
      designations
      displayAgentCompanyLogoOnTopOfEachTour
      emailCC
      emailCCOnorderCompleted
      emailCCOnorderPlaced
      emailOffice
      flyerDisclaimer
      flyerLayout
      hideAnimateNavigationBar
      hideFlyerFromRealEstateSiteTour
      internalNote
      newTourOrder
      officeAdmin
      others
      phone
      phoneMobile
      phoneAlternate
      profilePicture {
        path
      }
      profileUrl
      region {
        id
      }
      removeExternalLinksFromUnbrandedTourFooter
      removePhotographerBrandingFromBrandedTour
      removePhotographerBrandingFromUnbrandedTour
      removeRealEstateAddressFromUnbrandedTours
      showPatternOverlayOnSlideShowAndVideoOverviewTour
      showViewAdditionalPropertiesButtonOnTours
      showSearchOnGalleryPage
      showViewAdditionalPropertiesButtonOnTour
      newOrderEmailNotification
      propertySiteActivatedEmail
      adminChargeEmailNotification
      photographerAssignedServiceEmail
      appointmentEmailConfirmation
      showInternalNoteUponOrder
      collectPayment
      brokerAdmin
      showRealEstateMapOnShowcasePage
      specialPricing
      state
      status
      street
      templateId
      title
      tourActivated
      ...UserData
      website
      zip
      facebookLink
      instagramLink
      linkedinLink
      pinterestLink
      twitterLink
    }
  }
`

export const Agents = gql`
  query Agents($affiliateId: Int) {
    agents(where: { affiliate: { id: $affiliateId } }) {
      id
      brokerage {
        city
        state
        zip
        companyName
      }
      companyPay
      internalNote
      phone
      phoneMobile
      region {
        label
      }
      specialPricing
      status
      user {
        email
        firstName
        lastName
      }
      website
    }
  }
`

export const AgentsPaginated = gql`
  ${UserData}

  query AgentsPaginated(
    $skip: Int
    $first: Int
    $search: String
    $searchBrokerage: String
    $where: AgentWhereInput
  ) {
    agentsConnection(
      first: $first
      skip: $skip
      search: $search
      searchByBrokerage: $searchBrokerage
      where: $where
    ) {
      totalCount
      agents {
        id
        brokerage {
          city
          state
          zip
          companyName
        }
        companyPay
        internalNote
        phone
        phoneMobile
        region {
          label
        }
        specialPricing
        profilePicture {
          path
        }
        status
        website
        ...UserData
      }
    }
  }
`

export const CreateAgent = gql`
  mutation CreateAgent(
    $affiliateId: Int
    $agentMLSid: String
    $bio: Json
    $brokerageId: Int!
    $city: String
    $companyPay: Boolean
    $country: Country
    $coverPhoto: Upload
    $defaultColorScheme: ColorCreateInput
    $designations: String
    $displayAgentCompanyLogoOnTopOfEachTour: Boolean
    $emailCC: String
    $emailCCOnorderCompleted: Boolean
    $emailCCOnorderPlaced: Boolean
    $emailOffice: String
    $flyerDisclaimer: String
    $flyerLayout: FlyerLayoutName
    $hideAnimateNavigationBar: Boolean
    $hideFlyerFromRealEstateSiteTour: Boolean
    $internalNote: String
    $newTourOrder: Boolean
    $officeAdmin: Boolean
    $others: String
    $phone: String!
    $phoneMobile: String
    $phoneAlternate: String
    $profilePicture: Upload
    $profileUrl: String
    $regionId: Int!
    $removeExternalLinksFromUnbrandedTourFooter: Boolean
    $removePhotographerBrandingFromBrandedTour: Boolean
    $removePhotographerBrandingFromUnbrandedTour: Boolean
    $removeRealEstateAddressFromUnbrandedTours: Boolean
    $socialMedia: SocialMediaLinksInput
    $showPatternOverlayOnSlideShowAndVideoOverviewTour: Boolean
    $showViewAdditionalPropertiesButtonOnTours: Boolean
    $specialPricing: Boolean
    $state: State
    $street: String
    $templateId: Int
    $title: String
    $tourActivated: Boolean
    $user: UserCreateInput!
    $website: String
    $zip: String
  ) {
    createAgent(data: {
      affiliateId: $affiliateId
      agentMLSid: $agentMLSid
      bio: $bio
      brokerageId: $brokerageId
      city: $city
      companyPay: $companyPay
      country: $country
      coverPhoto: $coverPhoto
      defaultColorScheme: $defaultColorScheme
      designations: $designations
      displayAgentCompanyLogoOnTopOfEachTour: $displayAgentCompanyLogoOnTopOfEachTour
      emailCC: $emailCC
      emailCCOnorderCompleted: $emailCCOnorderCompleted
      emailCCOnorderPlaced: $emailCCOnorderPlaced
      emailOffice: $emailOffice
      flyerDisclaimer: $flyerDisclaimer
      flyerLayout: $flyerLayout
      hideAnimateNavigationBar: $hideAnimateNavigationBar
      hideFlyerFromRealEstateSiteTour: $hideFlyerFromRealEstateSiteTour
      internalNote: $internalNote
      newTourOrder: $newTourOrder
      officeAdmin: $officeAdmin
      others: $others
      phone: $phone
      phoneMobile: $phoneMobile
      phoneAlternate: $phoneAlternate
      profilePicture: $profilePicture
      profileUrl: $profileUrl
      regionId: $regionId
      removeExternalLinksFromUnbrandedTourFooter: $removeExternalLinksFromUnbrandedTourFooter
      removePhotographerBrandingFromBrandedTour: $removePhotographerBrandingFromBrandedTour
      removePhotographerBrandingFromUnbrandedTour: $removePhotographerBrandingFromUnbrandedTour
      removeRealEstateAddressFromUnbrandedTours: $removeRealEstateAddressFromUnbrandedTours
      socialMedia: $socialMedia
      showPatternOverlayOnSlideShowAndVideoOverviewTour: $showPatternOverlayOnSlideShowAndVideoOverviewTour
      showViewAdditionalPropertiesButtonOnTours: $showViewAdditionalPropertiesButtonOnTours
      specialPricing: $specialPricing
      state: $state
      street: $street
      templateId: $templateId
      title: $title
      tourActivated: $tourActivated
      user: $user
      website: $website
      zip: $zip
    }) {
      id
      user {
        email
      }
    }
  }
`

export const DeleteAgent = gql`
  mutation deleteAgent(
    $id: Int!
  ) {
    deleteAgent(where: {
      id: $id
    }) {
      id
    }
  }
`

export const UpdateAgent = gql`
  mutation UpdateAgent(
    $id: Int!
    $affiliateId: Int
    $agentMLSid: String
    $bio: Json
    $brokerageId: Int
    $city: String
    $companyPay: Boolean
    $country: Country
    $coverPhoto: Upload
    $defaultColorScheme: ColorUpdateDataInput
    $designations: String
    $displayAgentCompanyLogoOnTopOfEachTour: Boolean
    $emailCC: String
    $emailCCOnorderCompleted: Boolean
    $emailCCOnorderPlaced: Boolean
    $emailOffice: String
    $flyerDisclaimer: String
    $flyerLayout: FlyerLayoutName
    $hideAnimateNavigationBar: Boolean
    $hideFlyerFromRealEstateSiteTour: Boolean
    $internalNote: String
    $newTourOrder: Boolean
    $officeAdmin: Boolean
    $others: String
    $phone: String
    $phoneMobile: String
    $phoneAlternate: String
    $profilePicture: Upload
    $profileUrl: String
    $regionId: Int
    $removeExternalLinksFromUnbrandedTourFooter: Boolean
    $removePhotographerBrandingFromBrandedTour: Boolean
    $removePhotographerBrandingFromUnbrandedTour: Boolean
    $removeRealEstateAddressFromUnbrandedTours: Boolean
    $socialMedia: SocialMediaLinksInput
    $showInternalNoteUponOrder: Boolean
    $showPatternOverlayOnSlideShowAndVideoOverviewTour: Boolean
    $showSearchOnGalleryPage: Boolean
    $showViewAdditionalPropertiesButtonOnTour: Boolean
    $newOrderEmailNotification: Boolean
    $propertySiteActivatedEmail: Boolean
    $adminChargeEmailNotification: Boolean
    $photographerAssignedServiceEmail: Boolean
    $appointmentEmailConfirmation: Boolean
    $collectPayment: CollectPayment
    $brokerAdmin: Boolean
    $showRealEstateMapOnShowcasePage: Boolean
    $specialPricing: Boolean
    $state: State
    $street: String
    $templateId: Int
    $title: String
    $tourActivated: Boolean
    $user: UserUpdateDataInput
    $website: String
    $zip: String
  ) {
    updateAgent(data: {
      affiliateId: $affiliateId
      agentMLSid: $agentMLSid
      bio: $bio
      brokerageId: $brokerageId
      city: $city
      companyPay: $companyPay
      country: $country
      coverPhoto: $coverPhoto
      defaultColorScheme: $defaultColorScheme
      designations: $designations
      displayAgentCompanyLogoOnTopOfEachTour: $displayAgentCompanyLogoOnTopOfEachTour
      emailCC: $emailCC
      emailCCOnorderCompleted: $emailCCOnorderCompleted
      emailCCOnorderPlaced: $emailCCOnorderPlaced
      emailOffice: $emailOffice
      flyerDisclaimer: $flyerDisclaimer
      flyerLayout: $flyerLayout
      hideAnimateNavigationBar: $hideAnimateNavigationBar
      hideFlyerFromRealEstateSiteTour: $hideFlyerFromRealEstateSiteTour
      internalNote: $internalNote
      newTourOrder: $newTourOrder
      officeAdmin: $officeAdmin
      others: $others
      phone: $phone
      phoneMobile: $phoneMobile
      phoneAlternate: $phoneAlternate
      profilePicture: $profilePicture
      profileUrl: $profileUrl
      regionId: $regionId
      removeExternalLinksFromUnbrandedTourFooter: $removeExternalLinksFromUnbrandedTourFooter
      removePhotographerBrandingFromBrandedTour: $removePhotographerBrandingFromBrandedTour
      removePhotographerBrandingFromUnbrandedTour: $removePhotographerBrandingFromUnbrandedTour
      removeRealEstateAddressFromUnbrandedTours: $removeRealEstateAddressFromUnbrandedTours
      socialMedia: $socialMedia
      showInternalNoteUponOrder: $showInternalNoteUponOrder
      showPatternOverlayOnSlideShowAndVideoOverviewTour: $showPatternOverlayOnSlideShowAndVideoOverviewTour
      showSearchOnGalleryPage: $showSearchOnGalleryPage
      showViewAdditionalPropertiesButtonOnTour: $showViewAdditionalPropertiesButtonOnTour
      newOrderEmailNotification: $newOrderEmailNotification
      propertySiteActivatedEmail: $propertySiteActivatedEmail
      adminChargeEmailNotification: $adminChargeEmailNotification
      photographerAssignedServiceEmail: $photographerAssignedServiceEmail
      appointmentEmailConfirmation: $appointmentEmailConfirmation
      specialPricing: $specialPricing
      collectPayment: $collectPayment
      brokerAdmin: $brokerAdmin
      showRealEstateMapOnShowcasePage: $showRealEstateMapOnShowcasePage
      state: $state
      street: $street
      title: $title
      templateId: $templateId
      tourActivated: $tourActivated
      user: $user
      website: $website
      zip: $zip
    }
    where: { id: $id }
  ) {
      id
      user {
        email
      }
    }
  }
`

export const UpdateAgentAccount = gql`
  mutation UpdateAgentAccount(
    $id: Int!
    $affiliateId: Int
    $agentMLSid: String
    $bio: Json
    $brokerageId: Int
    $city: String
    $country: Country
    $coverPhoto: Upload
    $defaultColorScheme: ColorUpdateDataInput
    $designations: String
    $displayAgentCompanyLogoOnTopOfEachTour: Boolean
    $emailCC: String
    $emailCCOnorderCompleted: Boolean
    $emailCCOnorderPlaced: Boolean
    $emailOffice: String
    $hideAnimateNavigationBar: Boolean
    $others: String
    $phone: String
    $phoneMobile: String
    $phoneAlternate: String
    $profilePicture: Upload
    $profileUrl: String
    $removeExternalLinksFromUnbrandedTourFooter: Boolean
    $removePhotographerBrandingFromBrandedTour: Boolean
    $removePhotographerBrandingFromUnbrandedTour: Boolean
    $removeRealEstateAddressFromUnbrandedTours: Boolean
    $socialMedia: SocialMediaLinksInput
    $showPatternOverlayOnSlideShowAndVideoOverviewTour: Boolean
    $showViewAdditionalPropertiesButtonOnTours: Boolean
    $state: State
    $street: String
    $title: String
    $user: UserUpdateDataInput
    $website: String
    $zip: String
  ) {
    updateAgent(data: {
      affiliateId: $affiliateId
      agentMLSid: $agentMLSid
      bio: $bio
      brokerageId: $brokerageId
      city: $city
      country: $country
      coverPhoto: $coverPhoto
      defaultColorScheme: $defaultColorScheme
      designations: $designations
      displayAgentCompanyLogoOnTopOfEachTour: $displayAgentCompanyLogoOnTopOfEachTour
      emailCC: $emailCC
      emailCCOnorderCompleted: $emailCCOnorderCompleted
      emailCCOnorderPlaced: $emailCCOnorderPlaced
      emailOffice: $emailOffice
      hideAnimateNavigationBar: $hideAnimateNavigationBar
      others: $others
      phone: $phone
      phoneMobile: $phoneMobile
      phoneAlternate: $phoneAlternate
      profilePicture: $profilePicture
      profileUrl: $profileUrl
      removeExternalLinksFromUnbrandedTourFooter: $removeExternalLinksFromUnbrandedTourFooter
      removePhotographerBrandingFromBrandedTour: $removePhotographerBrandingFromBrandedTour
      removePhotographerBrandingFromUnbrandedTour: $removePhotographerBrandingFromUnbrandedTour
      removeRealEstateAddressFromUnbrandedTours: $removeRealEstateAddressFromUnbrandedTours
      socialMedia: $socialMedia
      showPatternOverlayOnSlideShowAndVideoOverviewTour: $showPatternOverlayOnSlideShowAndVideoOverviewTour
      showViewAdditionalPropertiesButtonOnTours: $showViewAdditionalPropertiesButtonOnTours
      state: $state
      street: $street
      title: $title
      user: $user
      website: $website
      zip: $zip
    },
    where: { id: $id }
  ) {
      id
      user {
        email
        firstName
        lastName
      }
    }
  }
`

export const ToggleAgentStatus = gql`
  mutation ToggleAgentStatus(
    $id: Int!
    $status: ActivityStatus!
  ) {
    updateAgent(data: {
      affiliateId: null
      status: $status
    }
    where: { id: $id }
  ) {
      id
      user {
        email
      }
      status
    }
  }
`

export const UpdateAgentNote = gql`
  mutation UpdateAgentNote(
    $id: Int!
    $note: String
  ) {
    updateAgent(data: {
      affiliateId: null
      internalNote: $note
    }
    where: { id: $id }
  ) {
      id
    }
  }
`
