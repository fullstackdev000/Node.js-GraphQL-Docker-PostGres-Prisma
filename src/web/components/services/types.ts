import * as GraphQLTypes from '#veewme/graphql/types'
import { NoNullableFields } from '#veewme/web/common/util'

export type ServiceCategory = Omit<GraphQLTypes.ServiceCategory, '__typename' | 'color'> & {
  color: Omit<GraphQLTypes.Color, '__typename'>
}

export interface ServiceTypeCards {
  [catId: string]: ServiceCard[]
}

export type ServiceListElement = NoNullableFields<Pick<
  GraphQLTypes.Service, 'category'
>> & Pick<GraphQLTypes.Service,
| 'id'
| 'categoryLabel'
| 'longDescription'
| 'name'
| 'note'
| 'price'
| 'serviceImage'
| 'serviceType'
| 'shortDescription'
| 'suspended'
| 'title'
>

export type ServicePackageListElement = Pick<
  GraphQLTypes.ServicePackage,
  'id' | 'price' | 'name' | 'suspended' | 'totalPrice' | 'title'
> & {
  services: Array<Pick<GraphQLTypes.Service, 'name'>>;
}

export interface ServiceListDataQuery {
  adminServices: ServiceListElement[]
  addOnServices: ServiceListElement[]
  primaryServices: ServiceListElement[]
  serviceCategories: ServiceCategory[]
  servicePackages: ServicePackageListElement[]
}

export type Card = Pick<ServiceListElement | ServicePackageListElement,
  | 'id'
  | 'name'
  | 'suspended'
> & {
  packageIds?: number[]
}

export type PackageCard = Card & Pick<ServicePackageListElement,
  | 'price'
  | 'services'
  | 'totalPrice'
  | 'title'
>

export type ServiceCard = Card & Pick<ServiceListElement,
  | 'category'
  | 'categoryLabel'
  | 'longDescription'
  | 'price'
  | 'serviceImage'
  | 'serviceType'
  | 'shortDescription'
  | 'title'
  | 'note'
>
