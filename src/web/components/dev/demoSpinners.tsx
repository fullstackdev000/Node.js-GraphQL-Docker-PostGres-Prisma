import { privateUrls } from '#veewme/lib/urls'
import Button from '#veewme/web/common/buttons/basicButton'
import BarSpinner from '#veewme/web/common/spinners/barSpinner'
import BeatSpinner from '#veewme/web/common/spinners/beatSpinner'
import { DotSpinner, DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import * as React from 'react'
import * as Grid from '../../common/grid'
import Panel from '../../common/panel'

interface SpinnerHideOnTimeoutState {
  countDown: number
  isOpen: boolean
}

class SpinnerHideOnTimeout extends React.PureComponent<{}, SpinnerHideOnTimeoutState> {
  secondsToClose: number = 5

  state = {
    countDown: this.secondsToClose,
    isOpen: false
  }

  closeAfterLoadingSimulation = () => {
    this.setState({ countDown: this.secondsToClose })
    const loadingSimulation = setInterval(() => {
      if (this.state.countDown > 0) {
        this.setState({ countDown: this.state.countDown - 1 })
      } else {
        clearInterval(loadingSimulation)
        this.setState({ isOpen: false })
      }
    }, 1000)
  }

  render () {
    return (
      <>
        <Button
          label={`Open spinner that closes after ${this.secondsToClose} seconds`}
          onClick={() => {
            this.setState({ isOpen: true })
            this.closeAfterLoadingSimulation()
          }}
        />
        <DotSpinnerModal
          isOpen={this.state.isOpen}
          isProcessComplete={this.state.countDown === 0}
          message={this.state.countDown > 0 ? `${this.state.countDown} seconds left to complete loading` : 'Loading complete'}
        />
      </>
    )
  }
}

interface SpinnerShowButtonsOnTimeoutState {
  countDown: number
  isOpen: boolean
  loadingComplete: boolean
}

class SpinnerShowButtonsOnTimeout extends React.PureComponent<{}, SpinnerShowButtonsOnTimeoutState> {
  secondsToClose: number = 5
  safeResetTimeout: number = 600

  state = {
    countDown: this.secondsToClose,
    isOpen: false,
    loadingComplete: false
  }

  showButtonsAfterLoadingSimulation = () => {
    const simulateLoading = setInterval(() => {
      if (this.state.countDown > 0) {
        this.setState({ countDown: this.state.countDown - 1 })
      } else {
        clearInterval(simulateLoading)
        this.setState({ loadingComplete: true })
      }
    }, 1000)
  }

  render () {
    return (
      <>
        <Button
          label={`Open spinner that shows action buttons after ${this.secondsToClose} seconds`}
          onClick={() => {
            this.setState({ isOpen: true })
            this.showButtonsAfterLoadingSimulation()
          }}
        />
        <DotSpinnerModal
          buttons={[
            {
              buttonTheme: 'action',
              full: true,
              label: 'Redirect to developers',
              to: privateUrls.dev
            }, {
              label: 'Close and reset',
              onClick: () => {
                this.setState({
                  isOpen: false
                }, () => {
                  setTimeout(() => {
                    this.setState({
                      countDown: this.secondsToClose,
                      loadingComplete: false
                    })
                  }, this.safeResetTimeout)
                })
              }
            }
          ]}
          isOpen={this.state.isOpen}
          isProcessComplete={this.state.loadingComplete}
          message={this.state.loadingComplete ? 'Loading complete' : `${this.state.countDown} seconds left to complete loading`}
        />
      </>
    )
  }
}

class SpinnerRedirectsOnTimeout extends React.PureComponent<{ delay?: number }, SpinnerHideOnTimeoutState> {
  secondsToClose: number = 5

  state = {
    countDown: this.secondsToClose,
    isOpen: false
  }

  countDownWithInterval = () => {
    this.setState({ countDown: this.secondsToClose })
    const loadingSimulation = setInterval(() => {
      if (this.state.countDown > 0) {
        this.setState({ countDown: this.state.countDown - 1 })
      } else {
        clearInterval(loadingSimulation)
      }
    }, 1000)
  }

  render () {
    return (
      <>
        <Button
          label={`Open spinner that redirects to dev after ${this.secondsToClose} seconds ${this.props.delay ? 'with delay' : 'immediately'}`}
          onClick={() => {
            this.setState({ isOpen: true })
            this.countDownWithInterval()
          }}
        />
        <DotSpinnerModal
          redirectDelay={this.props.delay}
          isOpen={this.state.isOpen}
          isProcessComplete={this.state.countDown === 0}
          redirectOnProcessCompleteURL={privateUrls.dev}
          message={this.state.countDown > 0 ? `${this.state.countDown} seconds left to complete loading` : 'Loading complete'}
        />
      </>
    )
  }
}

class SpinnerHideOnTimeoutNoContainer extends React.PureComponent<{}, SpinnerHideOnTimeoutState> {
  secondsToClose: number = 5

  state = {
    countDown: this.secondsToClose,
    isOpen: false
  }

  closeAfterLoadingSimulation = () => {
    this.setState({ countDown: this.secondsToClose })
    const loadingSimulation = setInterval(() => {
      if (this.state.countDown > 0) {
        this.setState({ countDown: this.state.countDown - 1 })
      } else {
        clearInterval(loadingSimulation)
        this.setState({ isOpen: false })
      }
    }, 1000)
  }

  render () {
    return (
      <>
        <Button
          label={`Open spinner without modal that closes after ${this.secondsToClose} seconds`}
          onClick={() => {
            this.setState({ isOpen: true })
            this.closeAfterLoadingSimulation()
          }}
        />
        <DotSpinnerModal
          isOpen={this.state.isOpen}
          invisibleModal
          size={250}
          isProcessComplete={this.state.countDown === 0}
          message={this.state.countDown > 0 ? `${this.state.countDown} seconds left to complete loading` : 'Loading complete'}
        />
      </>
    )
  }
}

const DemoSpinners: React.FunctionComponent = () => {
  return (
    <Grid.Wrapper>
      <Grid.Header>
        <h1>Demo spinners</h1>
      </Grid.Header>
      <Grid.MainColumn centerColumn>
        <Panel heading='Basic Dot Spinner'>
          <DotSpinner/>
        </Panel>
        <Panel heading='Dot Spinner with message'>
          <DotSpinner message='Loading...' />
        </Panel>
        <Panel heading='Dot Spinner with set bigger size'>
          <DotSpinner message='Loading...' size={200} />
        </Panel>
        <Panel>
          <SpinnerHideOnTimeout />
          <SpinnerShowButtonsOnTimeout />
          <SpinnerRedirectsOnTimeout delay={1000}/>
          <SpinnerRedirectsOnTimeout/>
          <SpinnerHideOnTimeoutNoContainer />
        </Panel>
        <Panel heading='Beat Spinner'>
          <BeatSpinner/>
          <BeatSpinner message='Loading' messageLast />
          <BeatSpinner message='Sending' />
        </Panel>
        <Panel heading='Bar Spinner'>
          <BarSpinner/>
        </Panel>
      </Grid.MainColumn>
    </Grid.Wrapper>
  )
}

export default DemoSpinners
