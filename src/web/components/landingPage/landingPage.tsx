import * as React from 'react'
import Button from '../../common/buttons/basicButton'

interface LandingPageState {
  openSignup: boolean
}

class LandingPage extends React.PureComponent<{}, LandingPageState> {
  state = {
    openSignup: false
  }

  render () {
    return (
      <>
        <Button
          onClick={() => this.setState({ openSignup: true })}
          label='Sign Up'
          buttonTheme='action'
          full
        />
      </>
    )
  }
}

export default LandingPage
