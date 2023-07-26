import gql from 'graphql-tag'
import { serviceFormCardData, servicePackageFormCardData } from './service'

export const Orders = gql`
  query Orders {
    orders: ordersWithFlatennedServices {
      id
      createdAt
      date
      notesForPhotographer
      price
      prefferedShootTime
      mlsPrimary
      statuses
      realEstate {
        id
        address
        agentCoListing {
          id
          user {
            firstName
            lastName
          }
        }
        agentPrimary {
          id
          user {
            email
            firstName
            lastName
          }
          brokerage { companyName }
          phone
          phoneMobile
        }
        mediaInteractives {
          id
        }
        bedrooms
        fullBathrooms
        homeSize
        homeSizeUnit
        photos {
          thumbUrl
        }
        panoramas {
          id
        }
        videos {
          id
        }
        tourId
      }
      services {
        id
        includedInPackage { id }
        event {
          eventId
          start
          photographer {
            id
            user {
              firstName
              lastName
            }
          }
        }
        message
        photographerScheduledAt
        processor {
          id
          user {
            firstName
            lastName
          }
        }
        service {
          id
          duration
          durationUnit
          category {
            id
            color { r g b a }
            label
            icon
          }
          name
        }
        status
      }
      status
      thumb { path }
    }
  }
`

export const OrdersPaginated = gql`
  query OrdersPaginated($skip: Int, $first: Int, $where: OrderWhereInput, $search: String) {
    orders: ordersWithFlatennedServicesConnection(
      first: $first
      skip: $skip
      where: $where
      search: $search
    )  {
    totalCount
    orders {
      id
      createdAt
      date
      notesForPhotographer
      price
      prefferedShootTime
      mlsPrimary
      statusToDisplay
      templateId
      payments {
        id
        type
        status
        amount
        paymentLinkId
        agentSecondary {
          id
        }
      }
      realEstate {
        id
        address
        agentCoListing {
          id
          user {
            firstName
            lastName
          }
        }
        agentPrimary {
          id
          user {
            email
            firstName
            lastName
          }
          affiliate {
            id
            externalUploadLink
          }
          brokerage { companyName }
          phone
          phoneMobile
          internalNote
          templateId
        }
        mediaInteractives {
          id
        }
        bedrooms
        fullBathrooms
        homeSize
        homeSizeUnit
        photos {
          thumbUrl
        }
        panoramas {
          id
        }
        videos {
          id
        }
        tourId
      }
      services {
        id
        includedInPackage { id }
        message
        event {
          eventId
          start
          photographer {
            id
            user {
              firstName
              lastName
            }
          }
        }
        message
        photographerScheduledAt
        processor {
          id
          user {
            firstName
            lastName
          }
        }
        service {
          id
          processor {
            id
            user {
              firstName
              lastName
            }
          }
          duration
          durationUnit
          serviceType
          category {
            id
            color { r g b a }
            label
            icon
          }
          name
        }
        status
      }
      statuses
      thumb { path }
    }
  }
}
`

export const PendingOrders = gql`
  query PendingOrders {
    ordersWithFlatennedServices(where: { serviceIds_some: { status: Pending } }) {
      id
      date
      realEstate {
        address
        agentPrimary {
          user {
            firstName
            lastName
          }
        }
      }
      services {
        event {
          eventId
          photographer {
            user {
              firstName
              lastName
            }
          }
        }
        photographerScheduledAt
        service {
          name
        }
        status
      }
    }
  }
`

// TODO most probably these data should be fetched from Media
// TODO fetch addresss filed from property
export const MediaAccess = gql`
  query MediaAccess($skip: Int, $first: Int, $where: OrderWhereInput, $search: String) {
    ordersConnection(
      first: $first
      skip: $skip
      where: $where,
      search: $search
    )  {
    totalCount
    orders {
      id
      realEstate {
        address
        agentPrimary {
          user {
            firstName
            lastName
          }
          brokerage {
            companyName
          }
        }
        photos {
          id
          thumbUrl
        }
        mediaDocuments {
          id
        }
        mediaInteractives {
          id
        }
        panoramas {
          id
        }
        videos {
          id
        }
        city
        id
        state
        street
        zip
      }
      status
      statusToDisplay
      statuses
      thumb { path }
    }
  }
}
`

export const MediaAccessFiltersData = gql`
  query MediaAccessFiltersData {
    agents {
      id
      user {
        firstName
        lastName
      }
    }
    me {
      accountId
      account {
        ... on Affiliate {
          id
          regions {
            id
            label
          }
        }
      }
    }
  }
`

export const CreateOrder = gql`
  mutation CreateOrder(
    $notesForPhotographer: String
    $prefferedShootDate: DateTime
    $promoCode: String
    $realEstate: RealEstateCreateWithoutOrderInput!
    $serviceIds: [Int!]!
    $servicePackageId: Int
    $mlsPrimary: String
    $mlsSecondary: String
  ) {
    createOrder(data: {
      notesForPhotographer: $notesForPhotographer
      prefferedShootDate: $prefferedShootDate
      promoCode: $promoCode
      realEstate: $realEstate
      serviceIds: $serviceIds
      servicePackageId: $servicePackageId
      mlsPrimary: $mlsPrimary
      mlsSecondary: $mlsSecondary
    }) {
      id
    }
  }
`

export const OrderFormData = gql(
  'query OrderFormData($region: ServiceFeeAdjustedByRegionWhereInput, $category: ServiceCategoryWhereInput) {'
  + servicePackageFormCardData(false)
  + serviceFormCardData('primaryServices', 'Primary', false)
  + serviceFormCardData('addOnServices', 'AddOn', false)
  + serviceFormCardData('adminServices', 'Admin', false)
  + `
  primaryCategories: servicesUIState(serviceType: Primary) {
    serviceType
    category {
      id
      label
    }
    collapsed
  }
  addOnCategories: servicesUIState(serviceType: AddOn) {
    serviceType
    category {
      id
      label
    }
    collapsed
  }
  `
  + `agents {
    id
    showInternalNoteUponOrder
    internalNote
    user {
      firstName
      lastName
    }
  }`
  + '}'
)

export const RealEstateAddressQuery = gql`
  query RealEstateAddress($realEstateId: Int!) {
    realEstate(where: {
      id: $realEstateId
    }) {
      id
      city
      state
      street
      zip
      address
    }
  }
`

export const Order = gql`
  query Order($id: Int!) {
    order(where: {id: $id}) {
      id
      createdAt
      date
      notesForPhotographer
      price
      prefferedShootTime
      mlsPrimary
      mlsSecondary
      realEstate {
        agentPrimary {
          id
          templateId
          affiliate {
            id
            country
          }
          user {
            id
            firstName
            lastName
          }
        }
        city
        country
        latitude
        longitude
        customLatitude
        customLongitude
        showOnMap
        state
        street
        zip
        amenities
        bedrooms
        bedroomsAboveGrade
        bedroomsBelowGrade
        billingFrequency
        currency
        fullBathrooms
        garages
        halfBathrooms
        homeSize
        homeSizeUnit
        listingType
        lockBox
        lotSize
        lotSizeUnit
        name
        occupied
        parkingSpaces
        price
        realEstateStatus
        rental
        tour {
          displayAddress
          descriptionFull
          descriptionShort
          hideRealEstateHeadline
          realEstateHeadline
        }
        yearBuilt
      }
      status
      templateId
      thumb { path }
    }
  }
`

export const UpdateOrder = gql`
  mutation UpdateOrder(
    $id: Int!
    $data: OrderUpdateInput!
  ) {
    updateOrder(
      data: $data
      where: { id: $id }
      ) {
      id
    }
  }
`

export const DeleteOrder = gql`
  mutation deleteOrder(
    $id: Int!
  ) {
    deleteOrder(where: {
      id: $id
    }) {
      id
    }
  }
`

export const UpdatePayment = gql`
  mutation updatePayment(
    $id: Int!
    $status: PaymentStatus!
  ) {
    updatePayment(
      id: $id
      input: {
        status: $status
      }
    ) {
      id
    }
  }
`

export const UpdateOrderedServiceProcessor = gql`
  mutation updateOrderedServiceProcessor(
    $data: OrderedServiceUpdateInput!
    $where: WhereIdUniqueInput!
  ) {
    updateOrderedService(where: $where, data: $data) {
      id
    }
  }
`

export const AgentOrdersToFinalize = gql`
  query AgentOrdersToFinalize(
    $where: OrderWhereInput!
  ) {
    orders(where: $where) {
      id
      payments {
        status
        type
        amount
        agentSecondary {
          id
          user {
            firstName
          }
        }
      }
    }
  }
`

export const OrdersFiltersData = gql`
  query OrdersFiltersData {
    agents {
      id
      user {
        id
        firstName
        lastName
      }
    }

    photographers {
      id
      user {
        id
        firstName
        lastName
      }
    }

    processors {
      id
      user {
        id
        firstName
        lastName
      }
    }

    me {
      accountId
      firstName
      lastName
      role
      account {
        ... on Affiliate {
          id
          regions {
            id
            label
          }
        }

        ... on Agent {
          id
          affiliate {
            id
            regions {
              id
              label
            }
          }
        }
      }
    }
  }
`

export const PublishOrder = gql`
  mutation PublishOrder(
    $id: Int!
  ) {
    publishOrder(
      where: { id: $id }
      ) {
      id
    }
  }
`

export const AcceptServices = gql`
  mutation AcceptServices(
    $id: Int!
    $servicesIds: [Int!]!
  ) {
    acceptOrderedServices(
      where: { id: $id }
      ids: $servicesIds
      ) {
      id
    }
  }
`

export const OrderDetails = gql`
  query OrderDetails($id: Int!) {
    order(where: {id: $id}) {
      id
      servicePackages {
        id
        name
        price
        services {
          id
          name
          category {
            id
            color {
              r
              g
              b
              a
            }
            icon
          }
        }
      }
      services {
        id
        includedInPackage { id }
        event {
          eventId
          start
          photographer {
            id
            user {
              firstName
              lastName
            }
          }
        }
        message
        photographerScheduledAt
        processor {
          id
          user {
            firstName
            lastName
          }
        }
        service {
          id
          name
          price
          serviceType
        }
        status
      }
      realEstate {
        agentPrimary {
          id
          companyPay
          brokerage {
            id
            companyName
          }
          profilePicture {
            path
          }
          user {
            firstName
            lastName
          }
        }
        address
        city
        country
        state
        street
        zip
      }
    }
  }
`

export const Coordinates = gql`
  mutation Coordinates($address: String!) {
    coordinates(address: $address) {
      latitude
      longitude
    }
  }
`
