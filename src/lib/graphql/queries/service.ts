import gql from 'graphql-tag'

export const ServiceCategories = gql`
  query ServiceCategories {
    serviceCategories {
      id
      color {
        a
        b
        g
        r
      }
      icon
      label
    }
  }
`

export const Services = gql`
  query Services {
    services {
      id
      assignable
      category {
        id
        color {
          a
          b
          g
          r
        }
        icon
        label
      }
      defaultCompensation
      defaultCompensation
      duration
      durationUnit
      link
      mediaOnly
      name
      note
      orderNotifyEmails
      packages {
        id
      }
      price
      processor {
        id
        user {
          firstName
          lastName
        }
      }
      regionFeesAdjusted {
        adjustedCompensation
        adjustedPrice
        region {
          label
        }
      }
      serviceType
      suspended
      title
      tourNotifyEmails
    }

    serviceCategories {
      id
      label
    }
  }
`

export const ServicesPaginated = gql`
  query ServicesPaginated(
    $skip: Int,
    $first: Int,
    $region: ServiceFeeAdjustedByRegionWhereInput,
    $category: Int,
    $search: String
    $type: ServiceType
    ) {
    servicesConnection(
      first: $first
      skip: $skip
      where: {
        regionFeeAdjustedIds_some: $region
        categoryId: {
          id: $category
        }
        serviceType: $type
      }
      search: $search
    ) {
      totalCount
      services {
        id
        assignable
        category {
          id
          color {
            a
            b
            g
            r
          }
          icon
          label
        }
        defaultCompensation
        defaultCompensation
        duration
        durationUnit
        link
        mediaOnly
        name
        note
        packages {
          id
        }
        price
        processor {
          id
          user {
            firstName
            lastName
          }
        }
        regionFeesAdjusted {
          adjustedCompensation
          adjustedPrice
          region {
            label
          }
        }
        serviceType
        title
        suspended
      }
    }

    serviceCategories {
      id
      label
    }

    photographers {
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

export const CreateService = gql`
  mutation CreateService(
    $assignable: Boolean!
    $categoryId: Int
    $defaultCompensation: Float!
    $longDescription: Json
    $duration: Int!
    $durationUnit: DurationUnit!
    $link: String
    $mediaOnly: Boolean!
    $name: String!
    $note: String
    $orderNotifyEmails: [String!]
    $ownerId: Int
    $price: Float!
    $processorId: Int
    $regionFeesAdjusted: [ServiceFeeAdjustedByRegionCreateInput!]
    $serviceIds: [Int!]!
    $serviceImage: Upload
    $serviceType: ServiceTypeMerged!
    $shortDescription: String!
    $tourNotifyEmails: [String!]
  ) {
    createService(data: {
      assignable: $assignable
      categoryId: $categoryId
      defaultCompensation: $defaultCompensation
      longDescription: $longDescription
      duration: $duration
      durationUnit: $durationUnit
      link: $link
      mediaOnly: $mediaOnly
      name: $name
      note: $note
      orderNotifyEmails: $orderNotifyEmails
      ownerId: $ownerId
      price: $price
      processorId: $processorId
      regionFeesAdjusted: $regionFeesAdjusted
      serviceIds: $serviceIds
      serviceImage: $serviceImage
      serviceType: $serviceType
      shortDescription: $shortDescription
      tourNotifyEmails: $tourNotifyEmails
    }) {
      ... on Service {
        name
      }
      ... on ServicePackage {
        id
      }
    }
  }
`

export const CreateServiceBasic = gql`
  mutation CreateServiceBasic(
    $assignable: Boolean!
    $categoryId: Int
    $defaultCompensation: Float!
    $longDescription: Json
    $duration: Int!
    $durationUnit: DurationUnit!
    $link: String
    $mediaOnly: Boolean!
    $name: String!
    $note: String
    $orderNotifyEmails: [String!]
    $ownerId: Int
    $price: Float!
    $processorId: Int
    $regionFeesAdjusted: [ServiceFeeAdjustedByRegionCreateInput!]
    $serviceImage: Upload
    $serviceType: ServiceType!
    $shortDescription: String!
    $tourNotifyEmails: [String!]
    $title: String
  ) {
    createServiceBasic(data: {
      assignable: $assignable
      categoryId: $categoryId
      defaultCompensation: $defaultCompensation
      longDescription: $longDescription
      duration: $duration
      durationUnit: $durationUnit
      link: $link
      mediaOnly: $mediaOnly
      name: $name
      note: $note
      orderNotifyEmails: $orderNotifyEmails
      ownerId: $ownerId
      price: $price
      processorId: $processorId
      regionFeesAdjusted: $regionFeesAdjusted
      serviceImage: $serviceImage
      serviceType: $serviceType
      shortDescription: $shortDescription
      tourNotifyEmails: $tourNotifyEmails
      title: $title
    }) {
      name
    }
  }
`

export const CreateServicePackage = gql`
  mutation CreateServicePackage(
    $assignable: Boolean!
    $duration: Int!
    $durationUnit: DurationUnit!
    $mediaOnly: Boolean!
    $name: String!
    $note: String
    $orderNotifyEmails: [String!]
    $ownerId: Int
    $price: Float!
    $processorId: Int
    $regionFeesAdjusted: [ServicePackageFeeAdjustedByRegionCreateInput!]
    $serviceIds: [Int!]!
    $suspended: Boolean
    $tourNotifyEmails: [String!]
    $title: String
  ) {
    createServicePackage(data: {
      assignable: $assignable
      duration: $duration
      durationUnit: $durationUnit
      mediaOnly: $mediaOnly
      name: $name
      note: $note
      orderNotifyEmails: $orderNotifyEmails
      ownerId: $ownerId
      price: $price
      processorId: $processorId
      regionFeesAdjusted: $regionFeesAdjusted
      serviceIds: $serviceIds
      suspended: $suspended
      tourNotifyEmails: $tourNotifyEmails
      title: $title
    }) {
      id
    }
  }
`

export const DataForServiceDetails = gql`
  query DataForServiceDetails {
    processors {
      id
      user {
        firstName
        lastName
      }
    }
    regions {
      id
      label
    }
    serviceCategories {
      id
      label
    }
    servicePackages {
      id
      name
    }
    services {
      id
      defaultCompensation
      name
      price
    }
  }
`

export const serviceFormCardData = (serviceAlias: string, serviceType: string, suspended?: boolean): string => (
  serviceAlias + `: services (where: {
    serviceType: ${serviceType}
    ${suspended !== undefined ? `suspended: ${suspended}` : ''}
    regionFeeAdjustedIds_some: $region
    categoryId: $category
  }, orderBy: sortOrder_ASC)`
  +
  `{
    id
    category
    {
      id
      icon
      color
      { r g b a }
    }
    categoryLabel
    longDescription
    packageIds
    name
    note
    price
    suspended
    serviceImage
    { path }
    serviceType
    shortDescription
    title
  }`
)
export const serviceCategoriesFormData = `
  serviceCategories {
    id
    color {
      a
      b
      g
      r
    }
    icon
    label
  }
`
export const servicePackageFormCardData = (suspended?: boolean) => `
  servicePackages(where: {
    ${suspended !== undefined ? `suspended: ${suspended}` : ''}
    regionFeeAdjustedIds_some: $region
    serviceIds_some: {
      categoryId: $category
    }
  }) {
    id
    price
    name
    services {
      name
    }
    totalPrice
    title
    suspended
  }
`

export const ServiceListData = gql(
  'query ServiceListData($region: ServiceFeeAdjustedByRegionWhereInput, $category: ServiceCategoryWhereInput) {'
  + serviceCategoriesFormData
  + servicePackageFormCardData()
  + serviceFormCardData('primaryServices', 'Primary')
  + serviceFormCardData('addOnServices', 'AddOn')
  + serviceFormCardData('adminServices', 'Admin')
  + '}'
)

export const DeleteService = gql`
  mutation DeleteService( $id: Int! ) {
    archiveService(where: {
      id: $id
    }) {
      id
    }
  }
`

export const DeleteServicePackage = gql`
  mutation DeleteServicePackage( $id: Int! ) {
    archiveServicePackage(where: {
      id: $id
    }) {
      id
    }
  }
`

export const DuplicateService = gql`
  query DuplicateService($packageId: Int, $serviceId: Int) {
    servicePackage(where: {
      id: $packageId
    }) {
      id
      assignable
      duration
      durationUnit
      mediaOnly
      name
      note
      orderNotifyEmails
      price
      regionFeesAdjusted {
        id
        adjustedPrice
        regionId
      }
      serviceIds
      title
      tourNotifyEmails
    }
    serviceBasic(where: {
      id: $serviceId
    }) {
      id
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
`

export const ReorderServices = gql`
  mutation ReorderServices(
    $ids: [Int!]!
  ) {
    reorderServices(
      ids: $ids
    ) {
      id
    }
  }
`

export const ReorderServicePackages = gql`
  mutation ReorderServicePackages(
    $ids: [Int!]!
  ) {
    reorderServicePackages(
      ids: $ids
    ) {
      id
    }
  }
`

export const ServicesUIState = gql`
  query ServicesUIState {
    serviceCategories {
      id
      color {
        id
        a
        b
        g
        r
      }
      icon
      label
    }
    primary: servicesUIState(serviceType: Primary) {
      serviceType
      category {
        id
        label
      }
      collapsed
    }
    addOn: servicesUIState(serviceType: AddOn) {
      serviceType
      category {
        id
        label
      }
      collapsed
    }
  }
`

export const UpdateCatOrder = gql`
  mutation UpdateCatOrder($type: ServiceType!, $ids: [Int!]!) {
    updateServiceCategoryOrder(serviceType: $type, sortOrder: $ids) {
      id
    }
  }
`

export const UpdateCatCollapsed = gql`
  mutation UpdateCatCollapsed(
    $type: ServiceType!
    $id: Int!
    $collapsed: Boolean!
  ) {
    updateServiceCategoryCollapse(
      serviceType: $type
      serviceCategory: $id
      collapsed: $collapsed
    ) {
      id
    }
  }
`

export const UpdateCatColors = gql`
  mutation updateCatColors(
    $data: [ServiceCategoryColorInput!]!
  ) {
    updateServiceCategoryColor(
      data: $data
    ) {
      id
    }
  }
`

export const ServicePackage = gql`
  query servicePackage($packageId: Int) {
    servicePackage(where: {
      id: $packageId
    }) {
      id
      assignable
      duration
      durationUnit
      mediaOnly
      name
      note
      orderNotifyEmails
      price
      regionFeesAdjusted {
        id
        adjustedPrice
        regionId
      }
      serviceIds
      tourNotifyEmails
      title
    }
  }
`

export const UpdatePackage = gql`
  mutation UpdatePackage(
    $data: ServicePackageUpdateInput!
    $where: WhereIdUniqueInput!
  ) {
    updateServicePackage(
      data: $data
      where: $where
    ){
      id
    }
  }
`

export const Service = gql`
  query Service($id: Int) {
    serviceBasic(where: {
      id: $id
    }) {
      id
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
`

export const UpdateService = gql`
  mutation UpdateService(
    $data: ServiceBasicUpdateInput!
    $where: WhereIdUniqueInput!
  ) {
    updateServiceBasic(
      data: $data
      where: $where
    ){
      id
    }
  }
`

export const OrderedServices = gql`
  query OrderedServices($where: OrderedServiceWhereInput, $search: String) {
    orderedServices(where: $where, search: $search) {
      id
      order {
        realEstate {
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

    serviceCategories {
      id
      label
    }

    photographers {
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
