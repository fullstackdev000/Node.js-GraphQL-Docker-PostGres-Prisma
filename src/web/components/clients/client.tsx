import { privateUrls } from '#veewme/lib/urls'
import * as React from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom'
import EditAgentForm from './agentForms/editAgentForm'
import NewAgentForm from './agentForms/newAgentForm'
import Agents from './agents/agents'
import EditBroker from './broker/editBroker'
import NewBroker from './broker/newBroker'
import Brokers from './brokers/brokers'
import NewOffice from './newOffice/newOffice'
import Offices from './offices/offices'

const Client: React.FunctionComponent<RouteComponentProps> = () => {
  return (
    <Switch>
      // Items in main sidebar should point to main/parent routes (e.g. '/clients'), not to specific tabs (e.g. '/clients/agents').
      // Otherwise they would be highlighted as active only for this specific tabs and would not work for other tabs e.g. 'clients/brokerages'
      // So redirection from main (abstract) Clients route to default tab is required.
      <Route
        exact
        path={privateUrls.clients}
        render={() => <Redirect to={privateUrls.agents} />}
      />
      <Route
        exact
        path={privateUrls.agents}
        component={Agents}
      />
      <Route
        path={privateUrls.addAgent}
        component={NewAgentForm}
      />
      <Route
        path={privateUrls.editAgent}
        component={EditAgentForm}
      />
      <Route
        path={privateUrls.editBrokerage}
        component={EditBroker}
      />
      <Route
        exact
        path={privateUrls.brokerages}
        component={Brokers}
      />
      <Route
        exact
        path={privateUrls.addBrokerage}
        component={NewBroker}
      />
      <Route
        exact
        path={privateUrls.offices}
        component={Offices}
      />
      <Route
        exact
        path={privateUrls.addOffice}
        component={NewOffice}
      />
    </Switch>
  )
}

export default Client
