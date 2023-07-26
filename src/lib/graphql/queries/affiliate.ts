import gql from 'graphql-tag'

export const AffiliateAccount = gql`
  query affiliateAccount($id: Int!) {
    affiliate(where: { id: $id }) {
      id
      allowClientBillingAccess
      allowClientMediaUpload
      allowClientOrders
      areasCovered
      city
      companyName
      country
      coverPhoto {
        path
      }
      customDomain
      customDomainEnabled
      defaultColorScheme {
        r
        g
        b
        a
      }
      description
      emailOffice
      featuredRealEstateSites {
        id
      }
      loginLink
      mediaExports {
        id
        height
        name
        resolution
        width
      }
      orderConfirmationEmailRider
      phone
      phoneOffice
      profilePicture {
        path
      }
      realEstateSiteLink
      regions {
        id
        label
      }
      sendWelcomeEmailsToNewClients
      signupLink
      state
      street
      tourColor {
        r
        g
        b
        a
      }
      user {
        email
        firstName
        lastName
        joinDate
        lastLogIn
      }
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

export const AffiliateSettings = gql`
  query affiliateSettings($id: Int!) {
    affiliate(where: { id: $id }) {
      id
      allowClientBillingAccess
      allowClientMediaUpload
      calendarTime12h
      calendarFirstDay
      calendarEndTime
      calendarShowBusinessHours
      calendarShowWeather
      calendarStartTime
      city
      companyName
      country
      coverPhoto {
        path
      }
      customDomain
      customDomainEnabled
      defaultColorScheme {
        r
        g
        b
        a
      }
      emailOffice
      featuredRealEstateSites {
        id
      }
      loginLink
      mediaExports {
        id
        height
        name
        resolution
        width
      }
      orderConfirmationEmailRider
      profilePicture {
        path
      }
      realEstateSiteLink
      regions {
        id
        label
      }
      sendWelcomeEmailsToNewClients
      signupLink
      state
      street
      templateId
      tourColor {
        r
        g
        b
        a
      }
      user {
        email
        firstName
        lastName
        lastLogIn
        joinDate
      }
      website
      zip
      facebookLink
      instagramLink
      linkedinLink
      pinterestLink
      twitterLink
      externalUploadLink
    }
  }
`

export const Affiliate = gql`
  query affiliate($id: Int!) {
    affiliate(where: { id: $id }) {
      id
      allowClientBillingAccess
      allowClientMediaUpload
      allowClientOrders
      areasCovered
      city
      companyName
      country
      customDomain
      customDomainEnabled
      defaultColorScheme {
        id
        r
        g
        b
        a
      }
      description
      emailOffice
      featuredRealEstateSites {
        id
      }
      mediaExports {
        id
        height
        name
        resolution
        width
      }
      orderConfirmationEmailRider
      phone
      phoneOffice
      regions {
        id
        label
      }
      sendWelcomeEmailsToNewClients
      state
      street
      user {
        id
        email
        firstName
        joinDate
        lastActive
        lastName
        password
        role
      }
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

export const Affiliates = gql`
  query affiliates {
    affiliates {
      accountConfirmed
      accountExtensionType
      activityStatus
      agents {
        id
      }
      city
      companyName
      country
      customDomainEnabled
      emailOffice
      id
      orders {
        id
      }
      phone
      phoneOffice
      state
      user {
        email
        firstName
        joinDate
        lastActive
        lastName
      }
      website
    }
  }
`

export const CreateAffiliate = gql`
  mutation createAffiliate(
    $city: String!
    $companyName: String!
    $country: Country!
    $phone: String!
    $state: State!
    $street: String!
    $user: UserSignupInput!
    $website: String
    $zip: String!
    $platformName: String
    $currentlyUsingManagingApp: Boolean
    $heardAboutUsFrom: String
    $importantThingsInManagingApp: String
    $other: String
    $toursYearly: String
    $templateId: Int
  ) {
    createAffiliate(data: {
      city: $city
      companyName: $companyName
      country: $country
      phone: $phone
      state: $state
      street: $street
      user: $user
      website: $website
      zip: $zip
      platformName: $platformName
      currentlyUsingManagingApp: $currentlyUsingManagingApp
      heardAboutUsFrom: $heardAboutUsFrom
      importantThingsInManagingApp: $importantThingsInManagingApp
      other: $other
      toursYearly: $toursYearly
      templateId: $templateId
    }) {
      id
      companyName
      user {
        email
      }
    }
  }
`

export const DeleteAffiliate = gql`
  mutation deleteAffiliate(
    $id: Int!
  ) {
    deleteAffiliate(where: {
      id: $id
    }) {
      id
    }
  }
`

export const UpdateAffiliate = gql`
  mutation updateAffiliate(
    $id: Int!
    $allowClientBillingAccess: Boolean
    $allowClientMediaUpload: Boolean
    $allowClientOrders: Boolean
    $areasCovered: Json
    $calendarTime12h: Boolean
    $calendarFirstDay: Int
    $calendarEndTime: String
    $calendarShowBusinessHours: Boolean
    $calendarShowWeather: Boolean
    $calendarStartTime: String
    $city: String
    $companyName: String
    $country: Country
    $coverPhoto: Upload
    $customDomain: String
    $customDomainEnabled: Boolean
    $defaultColorScheme: ColorUpdateDataInput
    $description: Json
    $emailOffice: String
    $featuredRealEstateSites: [Int!]
    $mediaExports: [PhotoPresetInput!]
    $orderConfirmationEmailRider: Boolean
    $phone: String!
    $phoneOffice: String
    $profilePicture: Upload
    $regions: [RegionUpdateInput!]
    $sendWelcomeEmailsToNewClients: Boolean
    $socialMedia: SocialMediaLinksInput
    $state: State
    $street: String
    $templateId: Int
    $tourColor: ColorUpdateDataInput
    $user: UserUpdateDataInput
    $website: String
    $zip: String
    $realEstateSiteLink: String
    $signupLink: String
    $loginLink: String
    $externalUploadLink: String
  ) {
    updateAffiliate(
      data: {
        allowClientBillingAccess: $allowClientBillingAccess
        allowClientMediaUpload: $allowClientMediaUpload
        allowClientOrders: $allowClientOrders
        areasCovered: $areasCovered
        calendarTime12h: $calendarTime12h
        calendarFirstDay: $calendarFirstDay
        calendarEndTime: $calendarEndTime
        calendarShowBusinessHours: $calendarShowBusinessHours
        calendarShowWeather: $calendarShowWeather
        calendarStartTime: $calendarStartTime
        city: $city
        companyName: $companyName
        country: $country
        coverPhoto: $coverPhoto
        customDomain: $customDomain
        customDomainEnabled: $customDomainEnabled
        defaultColorScheme: $defaultColorScheme
        description: $description
        emailOffice: $emailOffice
        featuredRealEstateSites: $featuredRealEstateSites
        mediaExports: $mediaExports
        orderConfirmationEmailRider: $orderConfirmationEmailRider
        phone: $phone
        phoneOffice: $phoneOffice
        profilePicture: $profilePicture
        regions: $regions
        sendWelcomeEmailsToNewClients: $sendWelcomeEmailsToNewClients
        socialMedia: $socialMedia
        state: $state
        street: $street
        templateId: $templateId
        tourColor: $tourColor
        user: $user
        website: $website
        zip: $zip
        realEstateSiteLink: $realEstateSiteLink
        signupLink: $signupLink
        loginLink: $loginLink
        externalUploadLink: $externalUploadLink
      },
      where: {
        id: $id
      }
    ) {
      id
      companyName
      user {
        email
        firstName
        lastName
      }
    }
  }
`

export const ToggleAffiliateStatus = gql`
  mutation ToggleAffiliateStatus(
    $id: Int!
    $accountConfirmed: Boolean
    $activityStatus: ActivityStatus
  ) {
    updateAffiliate(
      data: {
        accountConfirmed: $accountConfirmed
        activityStatus: $activityStatus
      }
      where: { id: $id }
    ) {
      id
      companyName
      user { email }
    }
  }
`

export const AffiliateForCreatingItems = gql`
  query AffiliateForCreatingItems($id: Int!) {
    affiliate(where: { id: $id }) {
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
  }
`

export const MySupport = gql`
  query MySupport($id: Int!) {
    affiliate(where: { id: $id }) {
      id
      supportAgent
      supportPhotographer
      supportProcessor
    }
  }
`

export const UpdateSupport = gql`
  mutation UpdateSupport(
    $id: Int!
    $supportAgent: Json
    $supportPhotographer: Json
    $supportProcessor: Json
  ) {
    updateAffiliate(
      data: {
        supportAgent: $supportAgent
        supportPhotographer: $supportPhotographer
        supportProcessor: $supportProcessor
      }
      where: { id: $id }
    ) {
      id
    }
  }
`
