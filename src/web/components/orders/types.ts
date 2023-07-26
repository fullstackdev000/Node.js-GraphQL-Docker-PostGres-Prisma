import {
  Affiliate,
  Agent,
  Brokerage,
  Color,
  File,
  OrderedService as FetchedOrderedService,
  OrderWithFlatennedServices,
  Processor,
  RealEstate,
  Service,
  ServiceCategory,
  ServicePackage,
  User
} from '#veewme/graphql/types'

export type OrderedService = Pick<FetchedOrderedService,
  'id' | 'event' | 'message' | 'photographerScheduledAt' | 'status'
> & {
  includedInPackage?: Pick<ServicePackage, 'id'>
  processor?: Pick<Processor, 'id'> & {
    user: Pick<User, 'firstName' | 'lastName'>
  }
  service: Pick<Service, 'id' | 'name' | 'duration' | 'durationUnit' | 'serviceType' | 'processor'> & {
    category: Pick<ServiceCategory, 'id' | 'label' | 'icon'> & {
      color: Pick<Color, 'r' | 'g' | 'b' | 'a'>
    }
  }
}

export type OrderQueryData = Pick<
  OrderWithFlatennedServices,
  | 'id'
  | 'createdAt'
  | 'date'
  | 'notesForPhotographer'
  | 'payments'
  | 'price'
  | 'prefferedShootTime'
  | 'mlsPrimary'
  | 'statuses'
  | 'statusToDisplay'
  | 'notesForPhotographer'
  | 'templateId'
> & {
  realEstate: Pick<
    RealEstate,
    | 'id'
    | 'address'
    | 'bedrooms'
    | 'fullBathrooms'
    | 'homeSizeUnit'
    | 'homeSize'
    | 'photos'
    | 'mediaInteractives'
    | 'panoramas'
    | 'videos'
    | 'tourId'
  > & {
    agentCoListing?: Pick<Agent, 'id'> & {
      user: Pick<User, 'firstName' | 'lastName'>
    }
    agentPrimary: Pick<Agent, 'id' | 'phone' | 'phoneMobile' | 'internalNote' | 'templateId'> & {
      user: Pick<User, 'email' | 'firstName' | 'lastName'>
      brokerage?: Pick<Brokerage, 'companyName'>
      affiliate: Pick<Affiliate, 'externalUploadLink'>
    }
  }
  services: OrderedService[]
  thumb?: Pick<File, 'path'>
}

export interface OrdersQueryData {
  orders?: OrderQueryData[]
}

export type PendingOrderService = Pick<
    FetchedOrderedService,
    'photographerScheduledAt' | 'status'
  > & {
    photographer?: {
      user: Pick<User, 'firstName' | 'lastName'>
    }
    service: Pick<Service, 'name'>
  }

export type PendingOrderQueryData = Pick<OrderWithFlatennedServices, 'id' | 'date'> & {
  realEstate: Pick<RealEstate, 'address'> & {
    agentPrimary: {
      user: Pick<User, 'firstName' | 'lastName'>
    }
  }
  services: PendingOrderService[]
}

export interface PendingOrdersQueryData {
  ordersWithFlatennedServices: PendingOrderQueryData[]
}
