import { LegendStatus } from '#veewme/web/common/footer/legendBar'
import Footer from '#veewme/web/common/footer/listFooter'
import { getOrderLegendStatus } from '#veewme/web/common/status'
import styled from '#veewme/web/common/styled-components'
import { OrderQueryData } from '#veewme/web/components/orders/types'
import * as React from 'react'
import AgentOrdersListItem from './agentOrdersListItem'

export const StyledList = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  list-style: none;
`

const statuses: LegendStatus[] = [
  getOrderLegendStatus('Active'),
  getOrderLegendStatus('Inactive'),
  getOrderLegendStatus('MediaOnly'),
  getOrderLegendStatus('Pending'),
  getOrderLegendStatus('Sold')
]

export interface OrdersListProps {
  orders: OrderQueryData[]
  termsURL: string
  itemsPerPage: number
  onPageChange: (page: number) => void
}

const OrdersList: React.FunctionComponent<OrdersListProps> = props => (
  <>
    <StyledList>
      {props.orders.map(order => (
        <AgentOrdersListItem
          key={order.id}
          order={order}
          termsURL={props.termsURL}
        />
      ))}
    </StyledList>
    <Footer
      label='Displaying last 30 days'
      statuses={statuses}
      totalRecords={props.orders.length}
      pageLimit={props.itemsPerPage}
      maxButtons={7}
      onPageChange={props.onPageChange}
    />
  </>
)

export default OrdersList
