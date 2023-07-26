import gql from 'graphql-tag'

export const Photographers = gql`
  query Photographers($skip: Int, $first: Int, $where: PhotographerWhereInput, $search: String) {
    photographersConnection(
      first: $first
      skip: $skip
      where: $where
      search: $search
    )  {
    totalCount
    photographers {
      id
      activatable
      city
      phone
      region {
        id
        label
      }
      schedulable
      internalNote
      enableServiceDone
      changeable
      user {
        firstName
        lastName
        email
      }
      thumb
      profilePicture {
        path
      }
    }
  }
}
`

export const CreatePhotographer = gql`
  mutation createPhotographer(
    $activatable: Boolean
    $affiliateId: Int!
    $city: String
    $changeable: Boolean
    $country: Country
    $enableServiceDone: Boolean
    $internalNote: String
    $phone: String
    $regionId: Int!
    $schedulable: Boolean
    $state: State
    $street: String
    $user: UserCreateInput!
    $website: String
    $zip: String
    $profilePicture: Upload
  ) {
    createPhotographer(data: {
      activatable: $activatable
      affiliateId: $affiliateId
      changeable: $changeable
      city: $city
      country: $country
      enableServiceDone: $enableServiceDone
      internalNote: $internalNote
      phone: $phone
      regionId: $regionId
      schedulable: $schedulable
      state: $state
      street: $street
      user: $user
      website: $website
      profilePicture: $profilePicture
      zip: $zip
    }) {
      id
      country
      phone
      street
      state
      zip
    }
  }
`

export const Photographer = gql`
  query Photographer($photographerId: Int!) {
    photographer(where: { id: $photographerId }) {
      id
      activatable
      affiliate {
        regions {
          id
          label
        }
      }
      city
      changeable
      country
      enableServiceDone
      internalNote
      phone
      regionId
      schedulable
      state
      street
      profilePicture {
        path
      }
      user {
        email
        firstName
        lastName
      }
      website
      zip
    }
  }
`

export const UpdatePhotographer = gql`
  mutation updatePhotographer(
    $id: Int!
    $activatable: Boolean
    $changeable: Boolean
    $city: String
    $country: Country
    $enableServiceDone: Boolean
    $internalNote: String
    $phone: String
    $regionId: Int
    $schedulable: Boolean
    $state: State
    $street: String
    $user: UserUpdateInput
    $website: String
    $zip: String
    $profilePicture: Upload
  ) {
    updatePhotographer(data: {
      activatable: $activatable
      city: $city
      changeable: $changeable
      country: $country
      enableServiceDone: $enableServiceDone
      internalNote: $internalNote
      phone: $phone
      regionId: $regionId
      schedulable: $schedulable
      state: $state
      street: $street
      user: $user
      website: $website
      profilePicture: $profilePicture
      zip: $zip
    }, where: {
      id: $id
    }) {
      user {
        firstName
        lastName
      }
      country
      phone
      street
      state
      zip
    }
  }
`

export const DeletePhotographer = gql`
  mutation deletePhotographer(
    $id: Int!
  ) {
    deletePhotographer(where: {
      id: $id
    }) {
      id
    }
  }
`

export const AllPhotographers = gql`
  query AllPhotographers {
    photographers {
      id
      user {
        firstName
        lastName
      }
    }
  }
`
