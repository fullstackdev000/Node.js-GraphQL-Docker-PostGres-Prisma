import {
  OrderDetailsQuery,
  OrderDetailsQueryVariables
} from '#veewme/gen/graphqlTypes'
import { OrderDetails } from '#veewme/lib/graphql/queries/orders'
import * as Grid from '#veewme/web/common/grid'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import Details from './details'

// import * as log from '#veewme/web/common/log'

interface RouteParams {
  orderId: string
}

const OrderDetailsContainer: React.FunctionComponent = () => {
  const { orderId } = useParams<RouteParams>()

  const { data, loading } = useQuery<OrderDetailsQuery, OrderDetailsQueryVariables>(OrderDetails, {
    variables: {
      id: Number(orderId)
    }
  })

  return (
    <Grid.PageContainer>
      <Grid.Header>Order Details: {data && data.order.realEstate.address}</Grid.Header>
      {data && <Details data={data} />}
      <DotSpinnerModal isOpen={loading} />
    </Grid.PageContainer>
  )
}

export default OrderDetailsContainer
