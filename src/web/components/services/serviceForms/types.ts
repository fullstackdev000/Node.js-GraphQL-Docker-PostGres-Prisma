import {
  CreateServiceBasicMutationVariables,
  CreateServicePackageMutationVariables,
  Processor,
  Region as GraphqlRegion,
  Service,
  ServiceCategory,
  ServiceCreateInput,
  ServiceFeeAdjustedByRegion,
  ServicePackage,
  ServicePackageFeeAdjustedByRegion,
  ServiceTypeMerged,
  User
} from '#veewme/gen/graphqlTypes'
import { FileValue } from '#veewme/lib/types'
import { RawDraftContentState } from 'draft-js'
import { DuplicateOptions } from './formPanels/source'

export type FetchedService = Pick<Service, 'id' | 'defaultCompensation' | 'name' | 'price'>
export type FetchedServicePackage = Pick<ServicePackage, 'id' | 'name'>

export interface ServiceFormOptions {
  processors: Array<Pick<Processor, 'id'> & { user: Pick<User, 'firstName' | 'lastName'> }>
  regions: Array<Pick<GraphqlRegion, 'id' | 'label'>>
  serviceCategories: Array<Pick<ServiceCategory, 'id' | 'label'>>
  servicePackages: FetchedServicePackage[]
  services: FetchedService[]
}

export interface FrontendServiceFeeAdjustedByRegion {
  id?: number
  adjustedCompensation?: number
  adjustedPrice?: number
  regionId: number
}

export type Region = Pick<GraphqlRegion, 'label' | 'id'>

export type ServiceInput = Pick<ServiceCreateInput,
  'assignable' |
  'categoryId' |
  'duration' |
  'durationUnit' |
  'longDescription' |
  'mediaOnly' |
  'name' |
  'price' |
  'serviceIds' |
  'serviceType' |
  'shortDescription'
> & {
  id?: number
  defaultCompensation: number
  link: string
  note: string
  ownerId?: number
  orderNotifyEmails: string // TODO change to string[] when MultipleValueInputField is ready
  processorId?: number
  regionFeesAdjusted: FrontendServiceFeeAdjustedByRegion[]
  serviceImage?: FileValue
  serviceType: ServiceTypeMerged
  tourNotifyEmails: string // TODO change to string[] when MultipleValueInputField is ready
}

// TODO: remove title here when added to API
export type FormValues = ServiceInput & {
  title?: string
}

export interface DuplicateServiceQueryData {
  servicePackage?: Pick<
    ServicePackage,
    | 'id'
    | 'assignable'
    | 'duration'
    | 'durationUnit'
    | 'mediaOnly'
    | 'name'
    | 'note'
    | 'price'
    | 'serviceIds'
  > & {
    orderNotifyEmails: string[]
    regionFeesAdjusted: Array<Pick<
      ServicePackageFeeAdjustedByRegion,
      'adjustedPrice' | 'regionId'
    >>
    tourNotifyEmails: string[]
  }
  serviceBasic?: Pick<
    Service,
    | 'id'
    | 'assignable'
    | 'categoryId'
    | 'defaultCompensation'
    | 'duration'
    | 'durationUnit'
    | 'link'
    | 'mediaOnly'
    | 'name'
    | 'note'
    | 'price'
    | 'serviceType'
    | 'shortDescription'
  > & {
    longDescription?: RawDraftContentState
    orderNotifyEmails: string[]
    regionFeesAdjusted: Array<Pick<
      ServiceFeeAdjustedByRegion,
      'adjustedCompensation' | 'adjustedPrice' | 'regionId'
    >>
    tourNotifyEmails: string[]
  }
}

export type ConflictingKeys = 'orderNotifyEmails' | 'tourNotifyEmails'
export type FormDataTypesInConflictedShapeWithInput = Partial<FormValues> & Pick<FormValues, ConflictingKeys>
export type FormDataTypesConvertedToInput = Pick<CreateServiceBasicMutationVariables | CreateServicePackageMutationVariables, ConflictingKeys>

export interface DuplicateServiceQueryVariables { packageId?: number, serviceId?: number }

export type GetDuplicateOptions = (serviceData: ServiceFormOptions) => DuplicateOptions
