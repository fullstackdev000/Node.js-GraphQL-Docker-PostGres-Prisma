import Button from '#veewme/web/common/buttons/basicButton'
import Modal from '#veewme/web/common/modal'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom'
import { VideoTypes } from '../types'

interface VideoTypeSection {
  title: string
  content: string
  type: VideoTypes
  price?: number
  pricePerTour?: boolean
}

const videoSections: VideoTypeSection[] = [{
  content: 'Upload video to our servers. Each video is transcoded for cross-device support.',
  price: 10,
  pricePerTour: true,
  title: 'Upload (hosted) video',
  type: 'Hosted'
}, {
  content: 'Generate a high quality video from stored property photos. Branded / unbranded (MLS-compliant).',
  price: 3,
  pricePerTour: false,
  title: 'Generate Faux Video',
  type: 'Faux'
}, {
  content: 'Enter URL for your self-hosted .mp4 video in order to display it on the tour. We recommend using H.264/MPEG4/720p videos.',
  title: 'External URL Video',
  type: 'URL'
},{
  content: 'Paste embed code from 3rd party platform. YouTube and Vimeo supported.',
  title: 'Video Embed Code',
  type: 'Embed'
}]

const VideosTypes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-row: 1fr 1fr;
  grid-gap: 20px;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`

const VideoTypeSection = styled.section`
  cursor: pointer;
  padding: 20px 20px;
  border-radius: 10px;
  border: 2px solid ${props => props.theme.colors.BORDER};

  &:hover {
    border: 2px solid ${props => props.theme.colors.GREEN};
    box-shadow: 0 0 15px 0 rgba(100, 100, 100, 0.2);
  }

  h2 {
    display: flex;
    justify-content: space-between;
    padding: 5px 0 15px 0;
    margin-bottom: 20px;
    border-bottom: 1px solid ${props => props.theme.colors.BORDER};
    font-size: 14px;
    font-weight: 600;

    span {
      color: ${props => props.theme.colors.GREEN};
    }
  }

  p {
    color: ${props => props.theme.colors.LABEL_TEXT};
    font-size: 14px;
  }
`

const ModalSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 0 20px 0;
  font-weight: 500;

  p {
    flex: 0 1 70%;
    color: ${props => props.theme.colors.ALERT};
  }

  div {
    color: ${props => props.theme.colors.FIELD_TEXT};
  }

`

const StyledModal = styled(Modal)`
  & > div > div > div {
    border: 2px solid ${props => props.theme.colors.ALERT};
  }

  ${ModalSection} + p {
    padding: 15px 0
    font-weight: 400;
    color: ${props => props.theme.colors.FIELD_TEXT};

    & + a {
      text-decoration: underline;
      color: ${props => props.theme.colors.FIELD_TEXT};
      font-size: 14px;
    }
  }
`

const ModalButtonWrapper = styled.div`
  display: flex;
  padding-top: 20px;
  justify-content: flex-end;
`

interface PriceProps {
  videoSection: VideoTypeSection
}

const Price: React.FunctionComponent<PriceProps> = ({ videoSection }) => (
  <>
    {videoSection.price && (<span>${videoSection.price.toFixed(2)}{videoSection.pricePerTour && '/Tour'}</span>)}
  </>
)

interface PaymentWarningModalProps {
  isOpen: boolean
  dismiss: () => void
  videoSection: VideoTypeSection
}

const PaymentWarningModal: React.FunctionComponent<PaymentWarningModalProps> = props => (
  <StyledModal isOpen={props.isOpen} onRequestClose={props.dismiss} title='Note!'>
    <ModalSection>
      <p>Purchasing additional service: {props.videoSection.title}.</p>
      <div>Cost: <Price videoSection={props.videoSection} /></div>
    </ModalSection>
    <p>
      Amount will be added to your daily statement, collected as agreed.
    </p>
    <NavLink to='#'>View Terms</NavLink>
    <ModalButtonWrapper>
      <Button to='1' full buttonTheme='alert' size='big' label='OK' />
    </ModalButtonWrapper>
  </StyledModal>
)

interface Step1Props extends RouteComponentProps {
  selectedType?: VideoTypes
  onClick: (type: VideoTypes) => void
  clearSelection: () => void
}

interface Step1State {
  modalOpen: boolean
}

class Step1 extends React.PureComponent<Step1Props, Step1State> {
  state = {
    modalOpen: false
  }

  toggleModal = () => {
    this.setState(prevState => ({
      modalOpen: !prevState.modalOpen
    }))
  }

  dismissModal = () => {
    this.toggleModal()
    this.props.clearSelection()
  }

  handleSectionClick = (type: VideoTypes) => {
    const { onClick } = this.props
    // const selectedSection = videoSections.find(section => section.type === type)
    onClick(type)
    this.props.history.push('1')
    // just temp hide modal until it's decided when it should be shown
    // TODO: when decision has been made show modal in appropriate moment
    /*
      if (selectedSection && selectedSection.price) {
        this.toggleModal()
      }
    */
  }

  render () {
    const { selectedType } = this.props
    const { modalOpen } = this.state
    const selectedSection = videoSections.find(section => section.type === selectedType)

    return (
      <div>
        <Panel heading='Choose Video Type'>
          <VideosTypes>
            {videoSections.map((video, index) => (
                <VideoTypeSection key={index} onClick={() => this.handleSectionClick(video.type)}>
                  <h2>
                    {video.title}
                    <Price videoSection={video} />
                  </h2>
                  <p>
                    {video.content}
                  </p>
                </VideoTypeSection>
              )
            )}
          </VideosTypes>
          {selectedSection &&
            <PaymentWarningModal
              isOpen={modalOpen}
              dismiss={this.dismissModal}
              videoSection={selectedSection}
            />
        }
        </Panel>
      </div>
    )
  }
}

export default withRouter(Step1)
