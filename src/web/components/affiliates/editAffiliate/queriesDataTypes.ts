import { Affiliate, Color, Order, PhotoPreset, Region, User } from '#veewme/gen/graphqlTypes'

export interface AffiliateAccountQueryData {
  affiliate: AffiliateAccountQueryResult
}

export type AffiliateAccountQueryResult = Pick<
    Affiliate,
    'id'
    | 'areasCovered'
    | 'allowClientBillingAccess'
    | 'allowClientMediaUpload'
    | 'allowClientOrders'
    | 'city'
    | 'companyName'
    | 'country'
    | 'customDomainEnabled'
    | 'description'
    | 'orderConfirmationEmailRider'
    | 'phone'
    | 'sendWelcomeEmailsToNewClients'
    | 'state'
    | 'street'
    | 'zip'
    | 'facebookLink'
    | 'instagramLink'
    | 'linkedinLink'
    | 'pinterestLink'
    | 'twitterLink'
  >
  & {
    customDomain?: string
    defaultColorScheme: Pick<
      Color,
      'id' | 'r' | 'g' | 'b' | 'a'
    >
    emailOffice?: string
    featuredRealEstateSites: Array<Order['id']>
    loginLink?: string
    mediaExports: Array<Pick<
      PhotoPreset,
      'id' | 'height' | 'name' | 'resolution' | 'width'
    >>
    phoneOffice?: string
    realEstateSiteLink?: string
    regions: Array<Pick<Region, 'id' | 'label'>>
    signupLink?: string
    tourColor: Pick<
      Color,
      'id' | 'r' | 'g' | 'b' | 'a'
    >
    user: Pick<
      User,
      | 'id'
      | 'email'
      | 'firstName'
      | 'joinDate'
      | 'lastActive'
      | 'lastName'
      | 'password'
      | 'role'
    >
    website?: string
  }
