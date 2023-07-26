import { PendingOrders } from '#veewme/lib/graphql/queries/orders'
import { LegendStatus } from '#veewme/web/common/footer/legendBar'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { getOrderLegendStatus, LegendLabel } from '#veewme/web/common/status'
import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { PendingOrdersQueryData } from '../types'
import Filters, { FiltersFormValues } from './filtersBar'
import PendingOrdersList from './pendingOrdersList'

const statuses: LegendLabel[] = [
  'Overdue',
  'Unscheduled',
  'Scheduled',
  'Unassigned',
  'Unpublished'
]

const PendingOrdersListContainer: React.FunctionComponent<{}> = () => {
  const { data, loading } = useQuery<PendingOrdersQueryData>(PendingOrders)
  const legendStatuses: LegendStatus[] = [
    getOrderLegendStatus('Overdue'),
    getOrderLegendStatus('Unscheduled'),
    getOrderLegendStatus('Scheduled'),
    getOrderLegendStatus('Unassigned'),
    getOrderLegendStatus('Unpublished')
  ]

  const handlePageChange = (page: number) => {
    log.debug('page changed', page)
  }

  const handleFiltersChange = (values: FiltersFormValues) => {
    log.debug('filters change: ', values)
  }

  return (
    <>
      <DotSpinnerModal isOpen={loading} />
      <Filters
        statuses={statuses}
        onChange={handleFiltersChange}
      />
      { data && data.ordersWithFlatennedServices
        ? <PendingOrdersList
            orders={data.ordersWithFlatennedServices} // TODO remove cast
            onPageChange={handlePageChange}
            ordersPerPage={20} // should be data.ordersPerPage?
            legendStatuses={legendStatuses}
        />
        : <p>No orders</p>
      }
    </>
  )
}

export default PendingOrdersListContainer
