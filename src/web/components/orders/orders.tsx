import { privateUrls } from '#veewme/lib/urls'
import * as React from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import TabsBar from '../../common/tabsBar'
import EditOrder from './orderForms/edit/editOrderContainer'
import NewOrder from './orderForms/newOrder'
import OrdersListContainer from './orders/ordersListContainer'
import PendingOrdersListContainer from './pending/pendingOrdersListContainer'
import { StyledMainWrapper } from './styled'

const tabs = [
  {
    label: 'Orders',
    to: privateUrls.orders
  }
  /*
    // TODO: show when implemented
  {
    label: 'Pending',
    to: privateUrls.pendingOrders
  }
  */
]

const OrdersWrappedInTabs: React.FunctionComponent<RouteComponentProps> = () => (
  <StyledMainWrapper>
    <TabsBar tabs={tabs}/>
    <Switch>
      <Route path={privateUrls.pendingOrders} component={PendingOrdersListContainer}/>
      <Route exact path={privateUrls.orders} component={OrdersListContainer}/>
    </Switch>
  </StyledMainWrapper>
)

const Orders: React.FunctionComponent<RouteComponentProps> = () => (
  <Switch>
    <Route path={privateUrls.editOrder} component={EditOrder}/>
    <Route path={privateUrls.addOrder} component={NewOrder} />
    <Route path={privateUrls.orders} component={OrdersWrappedInTabs}/>
  </Switch>
)

export default Orders
