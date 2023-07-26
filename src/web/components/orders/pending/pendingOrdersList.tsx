import { LegendStatus } from '#veewme/web/common/footer/legendBar'
import ListFooter from '#veewme/web/common/footer/listFooter'
import * as React from 'react'
import { StyledList } from '../styled'
import { PendingOrderQueryData } from '../types'
import ListHeader from './listHeader'
import PendingListItem from './pendingListItem/pendingListItem'

export interface PendingOrdersProps {
  orders: PendingOrderQueryData[]
  onPageChange: (page: number) => void
  ordersPerPage: number
  legendStatuses: LegendStatus[]
}

interface PendingOrdersState {
  reverseSort: boolean
}

export default class PendingOrdersList extends React.PureComponent<PendingOrdersProps, PendingOrdersState> {
  state: PendingOrdersState = {
    reverseSort: false
  }

  handleSort = () => {
    this.setState(prevState => ({
      reverseSort: !prevState.reverseSort
    }))
  }

  render () {
    return (
      <>
        <ListHeader reverseSort={this.state.reverseSort} onSort={this.handleSort}/>
        <StyledList>
          {this.props.orders.map(order => (
            <PendingListItem
              key={order.id}
              order={order}
            />
          ))}
        </StyledList>
        <ListFooter
          label='Displaying last 30 days'
          statuses={this.props.legendStatuses}
          totalRecords={this.props.orders.length}
          pageLimit={this.props.ordersPerPage}
          maxButtons={7}
          onPageChange={this.props.onPageChange}
        />
      </>
    )
  }
}
