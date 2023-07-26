import { OrderStatus } from '#veewme/graphql/types'
import { UnreachableCaseError } from '../../lib/error'
import { themeColors } from './colors'
import { LegendStatus } from './footer/legendBar'

type DraftOrderStatus = OrderStatus
type DraftRealEstateStatus = 'Sold' | 'Pending'
type DraftTourStatus = 'Active' | 'Inactive' | 'Published'

// TODO create proper type from resolver when resolvers for Orders, Properties and Tours are ready
export type LegendLabel = DraftOrderStatus | DraftRealEstateStatus | DraftTourStatus | 'MediaOnly'

// TODO complete getOrderLegendStatus of all the statuses from Orders, Properties and Tours when they are ready
// TODO set correct colors
export function getOrderLegendStatus (orderStatus: LegendLabel): LegendStatus {
  switch (orderStatus) {
    case 'Active':
      return { color: themeColors.STATUS_ACTIVE, label: 'Active' }
    case 'Completed':
      return { color: themeColors.STATUS_PUBLISHED, label: 'Completed' }
    case 'Uncompleted':
      return { color: themeColors.STATUS_UNCOMPLETED, label: 'Uncompleted' }
    case 'Inactive':
      return { color: themeColors.STATUS_INACTIVE, label: 'Inactive' }
    case 'MediaOnly':
      return { color: themeColors.STATUS_MEDIA_ONLY, label: 'Media only' }
    case 'Pending':
      return { color: themeColors.STATUS_PENDING, label: 'Pending' }
    case 'Sold':
      return { color: themeColors.STATUS_SOLD, label: 'Sold' }
    case 'Due':
      return { color: themeColors.STATUS_OVERDUE, label: 'Due' }
    case 'Overdue':
      return { color: themeColors.STATUS_OVERDUE, label: 'Overdue' }
    case 'Published':
      return { color: themeColors.STATUS_PUBLISHED, label: 'Published' }
    case 'Scheduled':
      return { color: themeColors.STATUS_SCHEDULED, label: 'Scheduled' }
    case 'Unassigned':
      return { color: themeColors.STATUS_UNASSIGNED, label: 'Unassigned' }
    case 'Unpublished':
      return { color: themeColors.STATUS_UNPUBLISHED, label: 'Unpublished' }
    case 'Unscheduled':
      return { color: themeColors.STATUS_UNSCHEDULED, label: 'Unscheduled' }
    case 'Unpaid':
      return { color: themeColors.STATUS_UNPAID, label: 'Unpaid' }
    case 'Paid':
      return { color: themeColors.GREEN, label: 'Paid' }
    default:
      throw new UnreachableCaseError(orderStatus)
  }
}
