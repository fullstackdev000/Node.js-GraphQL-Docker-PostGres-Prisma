import { rgbaToString } from '#veewme/web/common/formikFields/colorField'
import { NavHashLink } from '#veewme/web/common/hashLink'
import styled, { keyframes } from '#veewme/web/common/styled-components'
import { ButtonBack, ButtonNext, CarouselProvider, DotGroup, Image, Slide, Slider } from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import * as React from 'react'
import { TourContext } from '../.'
import { BannerPhoto, CustomBanner } from '../../../types'
import BannerPlaceholder from '../../common/helpers'
import OpenHouse from '../../common/openHouse'

import { ChevronLeft, ChevronRight } from 'styled-icons/boxicons-regular'

const BannerWrapper = styled.div`
  position: relative;
  z-index: 0;

  button {
    align-items: center;
    border: 0 none;
    background: transparent;
    outline: 0 none;
  }
`

const StyledDotGroup = styled(({ mainColor, ...props }) => <DotGroup {...props} />)<{
  mainColor: string
}>`
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;

  button {
    margin: 6px;
    width: 16px;
    height: 16px;
    background: ${props => props.mainColor};

    &.carousel__dot--selected {
      background: #fff;
    }
  }
`

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const SlideInDesktop = keyframes`
  from {
    left: -610px;
  }

  to {
    left: -140px;
  }
`

const SlideInTablet = keyframes`
  from {
    left: -610px;
  }

  to {
    left: 0;
  }
`

const StyledCustomBanner = styled.div<{
  background: string
  visible?: boolean
}>`
  position: absolute;
  top: 10%;
  left: -100%;
  min-width: 450px;
  z-index: 1;
  padding: 10px 50px 10px 55px;
  font-size: 35px;
  color: #fff;
  font-weight: 500;
  background: ${props => props.background};
  opacity: ${props => props.visible ? '1' : '0'};
  transition: opacity .5s;

  &:hover {
    span {
      visibility: visible;
    }
  }

  animation: ${SlideInTablet} .5s linear;
  animation-delay: 2s;
  animation-fill-mode: forwards;
}

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    animation: ${SlideInDesktop} .5s linear;
    animation-delay: 2s;
    animation-fill-mode: forwards;
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    max-width: 610px;
  }


`

const StyledClose = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  font-weight: 700;
  font-size: 30px;
  line-height: 26px;
  text-align: center;
  visibility: hidden;
  opacity: 0.8;
  cursor: pointer;
`

const ButtonDown = styled(({ mainColor, ...props }) => <NavHashLink {...props} />)<{
  mainColor: string
}>`
  width: 20px;
  height: 20px;
  background: ${props => props.mainColor};
  border-radius: 100%;
  box-shadow: 2px 2px 7px rgba(0, 0, 0, 0.5);

  svg {
    color: ${props => props.mainColor};
    transform: scale(1.7, 1.4);

    & + svg {
      position: absolute;
      top: 15px;
      left: 0;
    }
  }
`
const hamburgerWidth = 56
const bannerNavWidth = 120
const bannerDesktopRightMargin = 20
const bannerNavShift = (bannerNavWidth - hamburgerWidth) / 2

const BannerNav = styled.div<{
  mainColor: string
}>`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  right: calc(10vw - ${bannerNavShift}px);
  bottom: 25px;
  width: ${bannerNavWidth}px;
  height: 65px;
  z-index: 10;

  svg {
    filter: drop-shadow(1px 3px 2px rgb(0 0 0 / 0.7));
  }

  .carousel__back-button,
  .carousel__next-button {
    display: flex;
    color: ${props => props.mainColor};

    svg {
      color: ${props => props.mainColor};
      transform: scale(1.4);
    }
  }

  .carousel__next-button {
    right: 10px;
    left: unset;
  }
`

const SliderWrapper = styled.div<{
  mainColor: string
}>`
  position: relative;
`

interface CustomBannerProps {
  color: string
  text: string
  className?: string
  visible?: boolean
}

const CustomBanner: React.FunctionComponent<CustomBannerProps> = ({ className, color, text, visible }) => {
  const [show, toggle] = React.useState(true)

  if (!show) return null

  return (
    <StyledCustomBanner visible={visible} className={className} background={color} onClick={() => toggle(false)}>
      {text}
      <StyledClose>&times;</StyledClose>
    </StyledCustomBanner>
  )
}

const StyledText = styled(CustomBanner)`
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    position: relative;
    margin-top: 10px;
    top: unset;
  }
`

const StyledTitle = styled(CustomBanner)`
  top: calc(10% + 100px);
  max-width: 610px;
  font-family: 'American Typewriter', sans-serif;
  font-weight: 500;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    bottom: 250px;
    width: 100%;
    top: unset;
  }
`

interface BannerSliderProps {
  photos: BannerPhoto[]
  width: number
  height: number
  mainColor: string
  onMove: () => void
}

class BannerSlider extends React.Component<BannerSliderProps> {
  render () {
    return (
      <SliderWrapper mainColor={this.props.mainColor}>
        {this.props.photos.length === 0 && (
          <BannerPlaceholder width={this.props.width} height={this.props.height} />
        )}
        <Slider>
          {
            this.props.photos.map((photo, index) => (
              <Slide key={index} index={index}>
                <StyledImage hasMasterSpinner src={photo.fullUrl} />
              </Slide>
            ))
          }
        </Slider>
        <BannerNav
          mainColor={this.props.mainColor}
          onClick={this.props.onMove}
        >
          <ButtonBack>
            <ChevronLeft height='45' />
          </ButtonBack>
          <ButtonDown
            mainColor={this.props.mainColor}
            to='#photos'
          />
          <ButtonNext>
            <ChevronRight height='45' />
          </ButtonNext>
        </BannerNav>
        <StyledDotGroup onClick={this.props.onMove} mainColor={this.props.mainColor}/>
      </SliderWrapper>
    )
  }
}

interface BannerCarouselProps {
  customBanner: CustomBanner
  photos: BannerPhoto[]
  title: string
  hideTitle?: boolean
  width: number
  height: number
  onMove: () => void
}

const BannerCarousel: React.FunctionComponent<BannerCarouselProps> = ({
  customBanner,
  photos,
  title,
  ...props
}) => {

  const mainColor = React.useContext(TourContext).mainColor
  return (
    <CarouselProvider
     naturalSlideWidth={props.width}
     naturalSlideHeight={props.height}
     totalSlides={photos.length}
     hasMasterSpinner
    >
      <BannerWrapper>
        <BannerSlider
          photos={photos}
          width={props.width}
          height={props.height}
          mainColor={mainColor}
          onMove={props.onMove}
        />
      </BannerWrapper>
    </CarouselProvider>
  )
}

const BannerPhone = styled.div`
  display: block;

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    display: none;
  }
`

const BannerDesktop = styled.div`
  display: none;

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    display: block;
    margin-right: ${bannerDesktopRightMargin}px;
  }
`

const Wrapper = styled.div`
  position: relative;
`

type BannerProps = Omit<BannerCarouselProps, 'width' | 'height' | 'onMove'>
const BannerHolder: React.FunctionComponent<BannerProps> = props => {
  const mainColor = React.useContext(TourContext).mainColor
  const [textBannersVisible, setTextBannersVisibility] = React.useState(true)

  return (
    <Wrapper>
      <BannerPhone>
        <BannerCarousel
          {...props}
          width={800}
          height={1000}
          onMove={() => setTextBannersVisibility(false)}
        />
      </BannerPhone>
      <BannerDesktop>
        <BannerCarousel
          {...props}
          width={1200}
          height={650}
          onMove={() => setTextBannersVisibility(false)}
        />
      </BannerDesktop>
      <StyledText
        color={rgbaToString(props.customBanner.background)}
        text={props.customBanner.text}
        visible={textBannersVisible}
      />
      {
        !props.hideTitle && props.title && (
          <StyledTitle
            color={mainColor}
            text={props.title}
            visible={textBannersVisible}
          />
        )
      }
      <OpenHouse />
    </Wrapper>
  )
}

export default BannerHolder
