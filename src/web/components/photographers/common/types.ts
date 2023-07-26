import * as GraphQLTypes from '#veewme/graphql/types'

// TODO update types after completing Photographer
export type Profile = Pick<GraphQLTypes.Processor | GraphQLTypes.Photographer,
  'id' |
  'activatable' |
  'phone' |
  'schedulable'
> & Partial<Pick<GraphQLTypes.Processor, 'enableServiceDone' >> & {
  changeable?: boolean
  city?: string
  country?: GraphQLTypes.Country
  internalNote?: any
  profilePicture?: {
    path: string
  }
  region?: Pick<GraphQLTypes.Region, 'id' | 'label'>
  regionId: number
  street?: string
  state?: GraphQLTypes.State
  thumb?: string
  user: Pick<GraphQLTypes.User, 'email' | 'firstName' | 'lastName'>
  website?: string
  zip?: string
}

// export as aliases so it will be easier to separate these types if needed
export type Processor = Profile

export type Photographer = Profile
