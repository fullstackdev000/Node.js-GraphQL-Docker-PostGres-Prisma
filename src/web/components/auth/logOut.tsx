import { LogOutComponent } from '#veewme/gen/graphqlTypes'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import * as urls from '../../../lib/urls'

class CallLogOut extends React.Component<{ logOut: () => void }> {
  componentDidMount () {
    this.props.logOut()
  }

  render () {
    return this.props.children
  }
}

const LogOut: React.FunctionComponent<RouteComponentProps> = ({ history }) => (
  <LogOutComponent
    onCompleted={() => { history.push(urls.publicUrls.landingPage) }}
  >
    {(submit, { error }) => (
      <CallLogOut logOut={submit}>
        <>
          {error && 'Log out failed.'}
        </>
      </CallLogOut>
    )}
  </LogOutComponent>
)

export default withRouter(LogOut)
