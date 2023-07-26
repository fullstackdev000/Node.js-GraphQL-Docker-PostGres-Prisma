import { privateUrls } from '#veewme/lib/urls'
import { StyledMainWrapper } from '#veewme/web/common/styled'
import TabsBar from '#veewme/web/common/tabsBar'
import Orders from '#veewme/web/components/orders/orders/ordersListContainer'
import * as React from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom'
import AdminOrdersListContainer from './orders/adminOrdersListContainer'
import AgentOrdersListContainer from './orders/agentOrdersListContainer'
import ProcessorOrdersListContainer from './orders/processorOrdersListContainer'

import {
  MeQuery
} from '#veewme/gen/graphqlTypes'
import { Me } from '#veewme/lib/graphql/queries'
import { useQuery } from '@apollo/react-hooks'

const tabs = [
  {
    label: 'Processor',
    to: privateUrls.processorOrders
  },
  {
    label: 'Photographer',
    to: privateUrls.photographerOrders
  },
  {
    label: 'Admin',
    to: privateUrls.adminOrders
  },
  {
    label: 'Agent',
    to: privateUrls.agentOrders
  }
]

const Jobs: React.FunctionComponent<RouteComponentProps> = props => {
  const { data: meData } = useQuery<MeQuery>(Me, {
    fetchPolicy: 'cache-only'
  })

  const role = meData && meData.me.role
  let roleTabs = tabs
  let activatable = false
  if (role === 'PROCESSOR' || role === 'PHOTOGRAPHER') {
    roleTabs = tabs.filter(tab => tab.label.toUpperCase() === role)
  }
  if (meData && meData.me.account.__typename === 'Photographer') {
    activatable = meData && meData.me.account.activatable
  }

  const currentRoleUrl = React.useMemo(() => {
    let roleTabUrl: string = ''
    switch (role) {
      case 'PHOTOGRAPHER':
        roleTabUrl = privateUrls.photographerOrders
        break
      case 'PROCESSOR':
        roleTabUrl = privateUrls.processorOrders
        break
      case 'AGENT':
        roleTabUrl = privateUrls.agentOrders
        break
      case 'ADMIN':
        roleTabUrl = privateUrls.adminOrders
        break
      default:
        roleTabUrl = privateUrls.jobs
    }
    return roleTabUrl
  }, [role])

  return (
    <StyledMainWrapper>
      <TabsBar tabs={roleTabs}/>
      <Switch>
        <Route exact path={privateUrls.adminOrders} component={AdminOrdersListContainer}/>
        <Route exact path={privateUrls.agentOrders} component={AgentOrdersListContainer}/>
        <Route exact path={privateUrls.processorOrders} component={ProcessorOrdersListContainer}/>
        <Route
          exact
          path={privateUrls.photographerOrders}
          render={() => (
            <Orders canPublish={activatable} />
          )}
        />
        <Route
          exact
          path={privateUrls.jobs}
          render={() => (
            <Redirect
              to={currentRoleUrl}
            />
          )}
        />
      </Switch>
    </StyledMainWrapper>
  )
}

export default Jobs
