import { PackageCard, ServiceListElement, ServiceTypeCards } from '#veewme/web/components/services/types'

export interface AllServicesCards {
  packageCards: PackageCard[]
  adminCards: ServiceListElement[]
  addOnCards: ServiceTypeCards
  primaryCards: ServiceTypeCards
}
