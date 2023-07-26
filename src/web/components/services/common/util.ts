import { ServiceCategoryIcon, ServiceFeeAdjustedByRegionCreateInput, ServicePackageFeeAdjustedByRegionCreateInput, ServiceTypeMerged } from '#veewme/gen/graphqlTypes'
import { UnreachableCaseError } from '#veewme/lib/error'
import Drone from '#veewme/web/assets/svg/drone.svg'
import FloorPlan from '#veewme/web/assets/svg/floor-plan.svg'
import { Camera, Video } from 'styled-icons/boxicons-regular'
import { ShareAlt } from 'styled-icons/boxicons-solid'
import { EllipsisH, Newspaper, VrCardboard } from 'styled-icons/fa-solid'
import { Landscape, PanoramaHorizontal, VerifiedUser } from 'styled-icons/material'
import { convertToRegionFeesAdjusted } from '../serviceForms/form'

import { convertFromRaw, EditorState } from 'draft-js'
import {
  DuplicateServiceQueryData,
  FormDataTypesConvertedToInput,
  FormDataTypesInConflictedShapeWithInput,
  FormValues,
  FrontendServiceFeeAdjustedByRegion
} from '../serviceForms/types'
import { ServiceCategory } from '../types'

type ServiceCategoryIconWithAdmin = ServiceCategoryIcon | 'Admin'
export const getServiceCategoryIcon = (icon?: ServiceCategoryIconWithAdmin) => {
  switch (icon) {
    case 'Admin':
      return VerifiedUser
    case 'Aerial':
      return Drone
    case 'FloorPlan':
      return FloorPlan
    case 'Landscape':
      return Landscape
    case 'Other':
      return EllipsisH
    case 'Panorama':
      return PanoramaHorizontal
    case 'Photo':
      return Camera
    case 'Print':
      return Newspaper
    case 'SocialMedia':
      return ShareAlt
    case 'Video':
      return Video
    case 'Vr3D':
      return VrCardboard
    default: return VerifiedUser
  }
}

export const getServiceTypeLabel = (serviceType: ServiceTypeMerged) => {
  switch (serviceType) {
    case 'AddOn':
      return 'Add On'
    case 'Admin':
      return 'Admin'
    case 'Package':
      return 'Package'
    case 'Primary':
      return 'Primary'
    case 'Upgrade':
      return 'Upgrade'
    default:
      throw new UnreachableCaseError(serviceType)
  }
}

export const convertServiceFrontendOnlyDataToMutationInputData = ({
  orderNotifyEmails,
  tourNotifyEmails
}: FormDataTypesInConflictedShapeWithInput): FormDataTypesConvertedToInput => ({
  orderNotifyEmails: [orderNotifyEmails], // TODO unwrap from array when MultipleValueInputField is ready
  tourNotifyEmails: [tourNotifyEmails] // TODO unwrap from array when MultipleValueInputField is ready
})

export const isServicePackageFeeAdjustedByRegionCreateInput = (
  fee: FrontendServiceFeeAdjustedByRegion | ServicePackageFeeAdjustedByRegionCreateInput
): fee is ServicePackageFeeAdjustedByRegionCreateInput => fee.adjustedPrice !== undefined

export const convertDuplicatePackagesToFormValues
: (
  serviceData: DuplicateServiceQueryData,
  regions: Array<{ id: number, label: string }>
) => Partial<FormValues> = (
  {
    servicePackage
  },
  regions
) => {
  if (servicePackage) {
    return {
      ...servicePackage,
      // TODO just destructure orderNotifyEmails after multivalue input is done
      orderNotifyEmails: servicePackage.orderNotifyEmails[0] || '',
      regionFeesAdjusted: convertToRegionFeesAdjusted(
        regions,
        servicePackage.regionFeesAdjusted
      ),
      serviceType: 'Package',
      // TODO just destructure tourNotifyEmails after multivalue input is done
      tourNotifyEmails: servicePackage.tourNotifyEmails[0] || ''
    }
  } else {
    return {}
  }
}

export const convertDuplicateServicesToFormValues
: (
  serviceData: DuplicateServiceQueryData,
  regions: Array<{ id: number, label: string }>
) => Partial<FormValues> = (
  {
    serviceBasic
  },
  regions
) => {
  if (serviceBasic) {
    return {
      ...serviceBasic,
      longDescription: (
        serviceBasic.longDescription
        ? EditorState.createWithContent(convertFromRaw(serviceBasic.longDescription))
        : serviceBasic.longDescription
      ),
      // TODO just destructure orderNotifyEmails after multivalue input is done
      orderNotifyEmails: serviceBasic.orderNotifyEmails[0] || '',
      regionFeesAdjusted: convertToRegionFeesAdjusted(
        regions,
        serviceBasic.regionFeesAdjusted
      ),
      // TODO just destructure tourNotifyEmails after multivalue input is done
      tourNotifyEmails: serviceBasic.tourNotifyEmails[0] || ''
    }
  } else {
    return {}
  }
}

export const isServiceFeeAdjustedByRegionCreateInput = (
  fee: FrontendServiceFeeAdjustedByRegion | ServiceFeeAdjustedByRegionCreateInput
): fee is ServiceFeeAdjustedByRegionCreateInput => (
  fee.adjustedCompensation !== undefined && fee.adjustedPrice !== undefined
)

// Service cards require 'category' object as props but Admin services don't use categories
// so to display card correctly abstract category is used
// TODO: this is temporary and ugly solution but correct solution requires huge refactoring (and time)
export const abstractAdminServiceCategory: ServiceCategory = {
  color: {
    a: 1,
    b: 0,
    g: 0,
    id: 0,
    r: 255
  },
  icon: 'Photo',
  id: 0,
  label: 'Admin'
}
