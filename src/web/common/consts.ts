import { Role } from '#veewme/graphql/types'

export const defaultDateFormat = 'MM/DD/YYYY'
type MainRoles = Exclude<Role, 'DEVELOPER'>

type RolesAccess = {
  [K in MainRoles]: string[]
}

export const rolesAccess: RolesAccess = {
  ADMIN: [
    'Dashboard',
    'Affiliates',
    'Clients',
    'Orders',
    'Settings',
    'Domains'
  ],
  AFFILIATE: [
    'Dashboard',
    'Clients',
    'Orders',
    'Services',
    'Fulfillment',
    'Compensation',
    'Employees',
    'Domains',
    'Media Assets',
    'Calendar'
  ],
  AGENT: [
    'Dashboard',
    'Orders',
    'Media Assets'
  ],
  PHOTOGRAPHER: [
    'Jobs'
  ],
  PROCESSOR: [
    'Jobs'
  ],
  SELFSERVICEAGENT: []
}

// In many cases id field can't be optional and its existance is guaranteed by validation.
// Default value -1 represents 'unset' id (analogously to array 'indexOf' method)
export const unsetNumberId = -1

export const FilterServiceTypes = [{
  label: 'Primary',
  value: 'Primary'
}, {
  label: 'Add On',
  value: 'AddOn'
}]

export const perPaginationPage = 5

export const templateOptions = [{
  label: 'Classic (Default)',
  value: 1
}, {
  label: 'Second',
  value: 2
}]

export const tourDisablePreviewSuffix = 'pvd'
