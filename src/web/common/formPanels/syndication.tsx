import YouTube from '#veewme/web/assets/svg/youtubeLogo.svg'
import Button from '#veewme/web/common/buttons/basicButton'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Modal from '#veewme/web/common/modal'
import Panel, { Heading } from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const StylePanel = styled(Panel)`
  ${Heading} {
    justify-content: flex-start;
    & > *:nth-child(2) {
      margin-left: 10px;
    }
  }
`

const SyndicationWrapper = styled.div`
  border: 2px solid ${props => props.theme.colors.BORDER};
  display: flex;
  min-height: 100px;
`
const LogoWrapper = styled.div`
  border-right: 2px solid ${props => props.theme.colors.BORDER};
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  height: auto;
  padding-right: 5px;
  flex-shrink: 0;
  & > svg {
    width: 75%;
  }
`
const Content = styled.div`
  min-height: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  flex-grow: 1;
`
const Description = styled.div`
  font-size: 13px;
  margin-right: 20px;
  h4 {
    color: ${props => props.theme.colors.FIELD_TEXT};
  }
  p {
    color: ${props => props.theme.colors.TEXT};
  }
`

const DescriptionConnected = styled(Description)`
  display: flex;
  align-items: center;
`

const ProfilePicture = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background-color: ${props => props.theme.colors.GREEN};
  margin-right: 15px;
`
const Email = styled.div`
  color: ${props => props.theme.colors.TEXT};
  font-weight: 400;
`
const ModalContent = styled.div`
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.TEXT};
    margin-bottom: 20px;
  }
  button {
    float: right;
  }
`

interface SyndicationState {
  connected: boolean
  modalOpen: boolean
}

class Syndication extends React.PureComponent<{}, SyndicationState> {
  state = {
    connected: false,
    modalOpen: false
  }

  render () {
    return (
      <>
        <StylePanel
          id='syndication'
          heading='Syndication'
          headingPlacedComponent={
            <InlineHelp
              text='Set up sharing your tours and / or media to related portals.'
            />
          }
        >
          <SyndicationWrapper>
            <LogoWrapper><YouTube /></LogoWrapper>
            <Content>
              {this.state.connected
                ? (
                  <>
                  <DescriptionConnected>
                    <ProfilePicture />
                    <h4>
                     Ogle Media
                      <Email>sth@veewme.com</Email>
                    </h4>
                  </DescriptionConnected>
                  <Button label='Disconnect' onClick={() => this.setState({ modalOpen: true })} />
                  </>
                )
                : (
                  <>
                  <Description>
                    <h4>YouTube</h4>
                    <p>Connect your YouTube channel. This syndication allows you to send tour videos to your channel.</p>
                  </Description>
                  <Button label='Connect' buttonTheme='action' onClick={() => this.setState({ connected: true })} />
                  </>
                )
              }
            </Content>
          </SyndicationWrapper>
        </StylePanel>
        <Modal
          isOpen={this.state.modalOpen}
          onRequestClose={() => this.setState({ modalOpen: false })}
          title='Disconnecting YouTube account'
        >
          <ModalContent>
            <p>
              Are you sure you want to disconnect with your YouTube account?
            </p>
            <Button
              buttonTheme='alert'
              label='Disconnect'
              onClick={() => { this.setState({ connected: false, modalOpen: false }) }}
            />
          </ModalContent>
        </Modal>
      </>
    )
  }
}

export default Syndication
