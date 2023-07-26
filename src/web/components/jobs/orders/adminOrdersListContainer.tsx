import { Orders } from '#veewme/lib/graphql/queries/orders'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { OrdersQueryData } from '#veewme/web/components/orders/types'
import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import Filters, { FiltersFormValues } from './adminFiltersBar'
import AdminOrdersList from './adminOrdersList'

// TODO add termsURL to data from server
const TERMS_URL = 'www.google.com'

const AdminOrdersListContainer: React.FunctionComponent = () => {
  // TODO use Agent dedicated Orders query
  const { data, loading } = useQuery<OrdersQueryData>(Orders)
  const handlePageChange = (page: number) => {
    log.debug('page changed', page)
  }

  const handleFiltersChange = (values: FiltersFormValues) => {
    log.debug('filters change: ', values)
  }

  return (
    <>
      <Filters onChange={handleFiltersChange}/>
      <DotSpinnerModal isOpen={loading} />
      {
        data && data.orders
        ? <AdminOrdersList
          orders={data.orders}
          termsURL={TERMS_URL} // TODO to replace with data.termsURL
          onListItemButtonClick={() => log.debug('click')}
          onPageChange={handlePageChange}
          ordersPerPage={30} // TODO should be data.ordersPerPage?
        />
        : <p>No orders</p>
      }
    </>
  )
}

export default AdminOrdersListContainer
