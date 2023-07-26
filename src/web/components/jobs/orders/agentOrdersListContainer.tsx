import { Orders } from '#veewme/lib/graphql/queries/orders'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { OrdersQueryData } from '#veewme/web/components/orders/types'
import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import AgentOrdersList from './agentOrdersList'

// TODO add termsURL to data from server
const TERMS_URL = 'www.google.com'

const AgentOrdersListContainer: React.FunctionComponent = () => {
  // TODO use Agent dedicated Orders query
  const { data, loading } = useQuery<OrdersQueryData>(Orders)
  const handlePageChange = (page: number) => {
    log.debug('page changed', page)
  }

  return (
    <>
      <DotSpinnerModal isOpen={loading} />
      {data && data.orders
        ? <AgentOrdersList
          orders={data.orders}
          termsURL={TERMS_URL} // TODO Replace with data.termsURL
          onPageChange={handlePageChange}
          itemsPerPage={30} // TODO should be data.itemsPerPage?
        />
        : <p>No orders</p>
      }
    </>
  )
}

export default AgentOrdersListContainer
