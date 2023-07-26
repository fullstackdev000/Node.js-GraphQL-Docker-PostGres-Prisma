import gql from 'graphql-tag'

export const Processor = gql`
  query Processor($processorId: Int!) {
    processor(where: { id: $processorId }) {
      id
      activatable
      affiliate {
        regions {
          id
          label
        }
      }
      city
      country
      enableServiceDone
      internalNote
      phone
      regionId
      schedulable
      state
      street
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

export const Processors = gql`
  query Processors(
    $skip: Int
    $first: Int
    $where: ProcessorWhereInput
    $search: String
  ) {
    processorsConnection(
      first: $first
      skip: $skip
      where: $where
      search: $search
    )  {
    totalCount
    processors {
      id
      activatable
      affiliate {
        regions {
          id
          label
        }
      }
      city
      enableServiceDone
      internalNote
      phone
      regionId
      region {
        id
        label
      }
      schedulable
      state
      street
      user {
        email
        firstName
        lastName
      }
      zip
    }
  }
}
`

export const AllProcessors = gql`
  query AllProcessors {
    processors {
      id
      user {
        firstName
        lastName
      }
    }
}
`

export const DeleteProcessor = gql`
  mutation deleteProcessor(
    $id: Int!
  ) {
    deleteProcessor(where: {
      id: $id
    }) {
      id
    }
  }
`

export const CreateProcessor = gql`
  mutation createProcessor(
    $activatable: Boolean
    $affiliateId: Int
    $city: String
    $country: Country
    $enableServiceDone: Boolean
    $internalNote: String
    $phone: String
    $regionId: Int
    $schedulable: Boolean
    $state: String
    $street: String
    $user: UserCreateInput!
    $website: String
    $zip: String
  ) {
    createProcessor(data: {
      activatable: $activatable
      affiliateId: $affiliateId
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

export const UpdateProcessor = gql`
  mutation updateProcessor(
    $id: Int!
    $activatable: Boolean
    $affiliateId: Int
    $city: String
    $country: Country
    $enableServiceDone: Boolean
    $internalNote: String
    $phone: String
    $regionId: Int
    $schedulable: Boolean
    $state: String
    $street: String
    $user: UserUpdateInput
    $website: String
    $zip: String
  ) {
    updateProcessor(data: {
      activatable: $activatable
      affiliateId: $affiliateId
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

export const ProcessorServices = gql`
  query ProcessorServices($where: OrderedServiceWhereInput, $search: String) {
    orderedServices(where: $where, search: $search) {
      id
      processor {
        id
        activatable
        internalNote
        enableServiceDone
      }
      message
      status
      order {
        id
        date
        statuses
        realEstate {
          id
          address
          agentPrimary {
            region {
              label
            }
          }
        }
      }
      event {
        photographer {
          id
          user {
            firstName
            lastName
          }
        }
      }
      service {
        id
        category {
          id
          label
          color {
            id
            r
            g
            b
            a
          }
          icon
        }
        assignable
        categoryId
        defaultCompensation
        duration
        durationUnit
        link
        longDescription
        mediaOnly
        name
        note
        orderNotifyEmails
        price
        processorId
        regionFeesAdjusted {
          id
          adjustedCompensation
          adjustedPrice
          regionId
        }
        serviceType
        serviceImage {
          path
        }
        shortDescription
        title
        tourNotifyEmails
      }
    }

  }
`

export const OrderedServicesConnection = gql`
  query OrderedServicesConnection(
    $skip: Int
    $first: Int
    $where: OrderedServiceWhereInput
    $search: String
  ) {
    orderedServicesConnection(
      first: $first
      skip: $skip
      where: $where
      search: $search
    )  {
    totalCount
    orderedServices {
      id
      processor {
        id
        activatable
        internalNote
        enableServiceDone
        affiliate {
          id
          externalUploadLink
        }
      }
      message
      status
      order {
        id
        date
        statuses
        realEstate {
          id
          address
          agentPrimary {
            region {
              label
            }
          }
        }
      }
      event {
        photographer {
          id
          user {
            firstName
            lastName
          }
        }
      }
      service {
        id
        category {
          id
          label
          color {
            id
            r
            g
            b
            a
          }
          icon
        }
        assignable
        categoryId
        defaultCompensation
        duration
        durationUnit
        link
        longDescription
        mediaOnly
        name
        note
        orderNotifyEmails
        price
        processorId
        regionFeesAdjusted {
          id
          adjustedCompensation
          adjustedPrice
          regionId
        }
        serviceType
        serviceImage {
          path
        }
        shortDescription
        title
        tourNotifyEmails
      }
    }
  }
}
`
