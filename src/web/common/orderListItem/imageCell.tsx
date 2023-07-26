import { privateUrls } from '#veewme/lib/urls'
import FloorplanSvg from '#veewme/web/assets/svg/floor-plan.svg'
import MediaSvg from '#veewme/web/assets/svg/media-access.svg'
import UploadSvg from '#veewme/web/assets/svg/upload.svg'
import VideoSvg from '#veewme/web/assets/svg/video.svg'
import WebSvg from '#veewme/web/assets/svg/web.svg'
import HideForRole from '#veewme/web/common/hideForRole'
import styled from '#veewme/web/common/styled-components'
import Tooltipped from '#veewme/web/common/tooltipped'
import { OrderQueryData } from '#veewme/web/components/orders/types'
import * as React from 'react'
import { NavLink } from 'react-router-dom'
import OrderActivationConfirm from './orderActivationConfirm'

import PublishIcon from '#veewme/web/assets/svg/publish.svg'
import { PanoramaHorizontal } from 'styled-icons/material'

const StyledWebBubble = styled.div `
  position: absolute;
  display: flex;
  background-color: ${props => props.theme.colors.WEB_BACKGROUND};
  border: 2px solid ${props => props.theme.colors.WEB_BORDER};
  cursor: pointer;
  left: 16px;
  top: 16px;
  padding: 8px;
  border-radius: 5px;
  & svg {
    width: 20px;
    height: 20px;
    fill: white;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    left: 10px;
    top: 10px;
    padding: 4px;
  }
`

const StyledMediaBubble = styled.div `
  position: absolute;
  display: flex;
  background-color: #fff;
  left: 14px;
  bottom: 14px;
  padding: 8px 12px;
  border-radius: 8px;
  opacity: 0.8;
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    left: 7px;
    bottom: 7px;
    padding: 4px 7px;
    border-radius: 4px;
  }
`

const StyledMediaBtn = styled(({ hide, ...props }) => <NavLink {...props}>{props.children}</NavLink>)<{
  hide?: boolean
}>`
  display: ${props => props.hide ? 'none' : 'flex'};
  margin: 0 5px;
  cursor: pointer;
  align-items: center;

  & > p {
    margin-left: 6px;
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.theme.colors.DARKER_GREY};
  }

  & > svg {
    width: 13px;
    height: 13px;
    fill: ${props => props.theme.colors.DARKER_GREY};
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    margin: 0 3px;

    & > p {
      position: relative;
      top: 1px;
      font-size: 8px;

      svg {
        transform: scale(0.7);
      }
    }
  }
`

const StyledImageDiv = styled.div<{ thumb: string}> `
  position: absolute;
  background-image: url(${props => props.thumb});
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100%;
  border-radius: 7px 0 0 7px;
`

const StyledUploadLink = styled(NavLink) `
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px 0 0 7px;
  background-color: ${props => props.theme.colors.IMAGE_BACKGROUND};
  height: 100%;
`

const StyledAddDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.colors.BORDER};
  cursor: pointer;
  padding: 10px;
  & > h4 {
    font-size: 18px;
    margin-top: 10px;
  }
  & > svg {
    width: 36px;
    height: 36px;
    fill: ${props => props.theme.colors.BORDER};
  }
`

const StyledImageContainer = styled.div `
  position: relative;
  grid-area: img;
  width: 100%;
  border-radius: 7px 0 0 7px;
  background-color: ${props => props.theme.colors.IMAGE_BACKGROUND};
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    min-height: 90px;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    display: none;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    border-radius: 0;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_SM}) {
    width: 70%;
    padding: 0 15%;
  }
`

const StyledActivationBtn = styled.span`
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 3px 2px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  cursor: pointer

  svg {
    fill: ${props => props.theme.colors.GREEN};
    position: relative;
    left: 1px;
    top: 2px;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    left: 7px;
    top: 7px;
    transform: scale(0.8);
    transform-origin: 0 0;
  }
`
interface OrderActivationBtnProps {
  publishBtnVisible: boolean
  onClick: () => void
}

const OrderActivationBtn: React.FunctionComponent<OrderActivationBtnProps> = ({
  publishBtnVisible,
  onClick
}) => {
  return !publishBtnVisible ? null : (
    <Tooltipped
      tooltip='Publish your order'
      delayShow={1500}
    >
      <StyledActivationBtn
        onClick={onClick}
      >
        <PublishIcon
          height='28'
          width='34'
        />
      </StyledActivationBtn>
    </Tooltipped>
  )
}

interface ImageCellProps {
  order: OrderQueryData
  termsURL: string
  onPublish?: () => void
  publishBtnVisible?: boolean
}

interface ImageCellState {
  showConfirm: boolean
}

class ImageCell extends React.PureComponent<ImageCellProps, ImageCellState> {
  state: ImageCellState = {
    showConfirm: false
  }

  toggleShowConfirm = () => {
    this.setState({
      showConfirm: !this.state.showConfirm
    })
  }

  handleOrderActivationConfirmClick = () => {
    this.toggleShowConfirm()
  }

  render () {
    const { order } = this.props
    // TODO delete constants declaration after RealEstate and/or Tour datamodels are ready
    const web = false
    const active = false
    // TODO delete assigning numbers to images and videos after RealEstate and Media datamodels are ready
    const videosCount = order.realEstate.videos.length

    const photos = order.realEstate.photos
    const thumbUrl = photos.length ? order.realEstate.photos[0].thumbUrl : ''

    return (
      <StyledImageContainer>
        {thumbUrl
          ? <StyledImageDiv thumb={thumbUrl}>
              {web && !active &&
                <StyledWebBubble onClick={this.toggleShowConfirm}>
                  <WebSvg/>
                </StyledWebBubble>
              }
              <OrderActivationBtn
                publishBtnVisible={!!this.props.publishBtnVisible}
                onClick={() => this.props.onPublish && this.props.onPublish()}
              />
              <HideForRole roles={['PHOTOGRAPHER']}>
                <StyledMediaBubble>
                  <StyledMediaBtn
                    to={`${privateUrls.realEstate}/${order.realEstate.id}/media`}
                    hide={!photos.length}
                  >
                    <MediaSvg/>
                    <p>{photos.length}</p>
                  </StyledMediaBtn>
                  <StyledMediaBtn
                    to={`${privateUrls.realEstate}/${order.realEstate.id}/media/video`}
                    hide={!videosCount}
                  >
                    <VideoSvg/>
                    <p>{videosCount}</p>
                  </StyledMediaBtn>
                  <StyledMediaBtn
                    to={`${privateUrls.realEstate}/${order.realEstate.id}/media/interactive`}
                    hide={!order.realEstate.mediaInteractives.length}
                  >
                    <FloorplanSvg />
                    <p>{order.realEstate.mediaInteractives.length}</p>
                  </StyledMediaBtn>
                  <StyledMediaBtn
                    to={`${privateUrls.realEstate}/${order.realEstate.id}/media/panoramas`}
                    hide={!order.realEstate.panoramas.length}
                  >
                    <PanoramaHorizontal/>
                    <p>{order.realEstate.panoramas.length}</p>
                  </StyledMediaBtn>
                </StyledMediaBubble>
              </HideForRole>
            </StyledImageDiv>
          : <StyledUploadLink to={`${privateUrls.realEstate}/${order.realEstate.id}/media`}>
              <StyledAddDiv>
                <UploadSvg/>
                <h4>Add media</h4>
              </StyledAddDiv>
            </StyledUploadLink>
        }

        {this.state.showConfirm &&
          <OrderActivationConfirm
            cost={order.price}
            onConfirm={this.handleOrderActivationConfirmClick}
            onCancel={this.toggleShowConfirm}
            termsURL={this.props.termsURL}
          />
        }
      </StyledImageContainer>
    )
  }
}

export default ImageCell
