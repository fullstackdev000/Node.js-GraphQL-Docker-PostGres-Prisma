import { privateUrls } from '#veewme/lib/urls'
import * as React from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import AccountDetails from './accountDetails'

const Account: React.FunctionComponent<RouteComponentProps> = props => {
  return (
    <Switch>
      <Route
        exact
        path={privateUrls.account}
        component={AccountDetails}
      />
    </Switch>
  )
}

export default Account
