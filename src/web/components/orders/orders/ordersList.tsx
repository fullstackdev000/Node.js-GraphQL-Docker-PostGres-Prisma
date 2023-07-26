import ListFooter from '#veewme/web/common/footer/listFooter'
import * as React from 'react'
import { StyledList } from '../styled'
import { OrderQueryData } from '../types'
import ListHeader from './listHeader'
import OrdersListItem from './ordersListItem'

export interface OrdersListProps {
  orders: OrderQueryData[]
  ordersPerPage: number
  termsURL: string
  onPageChange: (page: number) => void
  onDelete: (id: number) => void
  pageCount?: number
  onUpdatePayment: (id: number) => void
  paginationKey?: string
  onPublish?: (id: number) => void
  canPublish?: boolean
}

const OrdersList: React.FunctionComponent<OrdersListProps> = props => (
  <>
    <ListHeader/>
    <StyledList>
      {props.orders.map(order => (
        <OrdersListItem
          key={order.id}
          order={order}
          termsURL={props.termsURL}
          onDelete={props.onDelete}
          onUpdatePayment={props.onUpdatePayment}
          onPublish={props.onPublish}
          canPublish={props.canPublish}
        />
      ))}
    </StyledList>
    <ListFooter
      label='Displaying last 30 days'
      totalRecords={props.pageCount || 0}
      pageLimit={props.ordersPerPage}
      maxButtons={7}
      onPageChange={props.onPageChange}
      paginationKey={props.paginationKey}
    />
  </>
)

export default OrdersList
