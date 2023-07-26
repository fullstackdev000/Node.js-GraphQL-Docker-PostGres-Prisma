import { publicUrls } from '#veewme/lib/urls'
import VeewMeLogo from '#veewme/web/assets/svg/logo.svg'
import BasicButton from '#veewme/web/common/buttons/basicButton'
import Modal from '#veewme/web/common/modal'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { PlayCircle } from 'styled-icons/feather/PlayCircle'
import dimensions from '../../layout/publicPage/dimensionsConstants'
import Testimonials from './testimonials'

const IntroInfoWrapper = styled.section`
  position: relative;
`

const CallToActions = styled.div`
  padding: 25px ${dimensions.pageMargin};
  border-bottom: 1px solid ${props => props.theme.colors.BORDER};
  margin-top: 40px;
  p {
    font-size: 15px;
    line-height: 25px;
    margin: 15px 0;
    text-align: center;
    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
      font-size: 13px;
      color: white;
      margin: 5px 0;
      width: 100%;
      strong {
        color: ${props => props.theme.colors.ORANGE};
      }
    }
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    width: 100%;
    padding-right: 55%;
    background-color: rgba(14,24,44,0.31);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    position: absolute;
    transform: translateY(-100%);
    margin-top: 0;
    z-index: 1;
  }
`

const Button = styled(props => <BasicButton {...props} full={true} size='big' />)`
  width: 100%;
  margin: 4px 0;
  text-transform: uppercase;
  text-shadow: 0 1px 2px rgba(0,0,0,0.28);
  box-shadow: inset 0 -8px 4px -6px rgba(0,0,0,0.28);
  border: none;
  border-radius: 5px;
`

const HugeButton = styled(Button).attrs({ buttonTheme: 'info' })`
  font-size: 18px;
  height: 50px;
  &:not(:disabled), & {
    & > svg, &:active > svg, &:hover > svg, &:focus > svg {
      fill: none;
      max-height: unset;
      max-width: unset;
    }
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    width: 49%;
    font-size: 13px;
  }
`

const EnormousButton = styled(Button).attrs({ buttonTheme: 'action' })`
  font-size: 20px;
  height: 75px;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    font-size: 15px;
    height: 60px;
  }
`

const PromoInfo = styled.section`
  padding: 25px ${dimensions.pageMargin};
  text-align: center;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    display: grid;
    grid-template-columns: 42% 50%;
    grid-column-gap: 8%;
    text-align: left;
  }
`

const Description = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: 1;
`

const Logo = styled(VeewMeLogo)`
  height: 30px;
  margin-left: auto;
`

const PromoVideo = styled.video`
  width: 900px;
  max-width: 100%;
`

interface IntroInfoState {
  isVideoModalOpen: boolean
}

class IntroInfo extends React.PureComponent<{}, IntroInfoState> {
  state = {
    isVideoModalOpen: false
  }

  render () {
    return (
      <IntroInfoWrapper>
        <CallToActions>
          <HugeButton label='Example Tours' to={publicUrls.contact} />
          <HugeButton
            label='Watch video'
            onClick={() => { this.setState({ isVideoModalOpen: true }) }}
            icon={PlayCircle}
            iconLast
          />
          <EnormousButton
            label='GET STARTED - FIRST 3 TOURS FREE'
            to={publicUrls.signup}
          />
          <p>*Register as a Photographer and create your first 3 tours for <strong>FREE!</strong></p>
          <p>*Limited time offer – migrate existing tours to our platform for <strong>FREE!</strong></p>
          <Modal
            centerVertically
            isOpen={this.state.isVideoModalOpen}
            onRequestClose={() => { this.setState({ isVideoModalOpen: false }) }}
            title='THE FUTURE OF REAL ESTATE MARKETING'
          >
            <PromoVideo
              controls
              poster='/public/static/img/veewme-guy.png'
              preload='auto'
              src='/public/static/video/promo.mp4'
            />
          </Modal>
        </CallToActions>
        <PromoInfo>
          <Description>
            <p>
              The Ogle Media real estate tour hosting and marketing platform offers an ability to tie <strong>photography and other media into an eye-popping and engaging single property website presentation</strong>, unlike any other such platform in the real estate vertical, and to make a listing stand out and get noticed by buyers.
            </p>
            <p>
              No one wants to watch dreary, boring real estate listings. However, great photography together with a memorable and engaging other media presented in an elegant, evocative way is an entirely different story. It's time to <strong>make real estate listings scream...</strong>
            </p>
            <Logo />
          </Description>
          <Testimonials />
        </PromoInfo>
      </IntroInfoWrapper>
    )
  }
}

export default IntroInfo
