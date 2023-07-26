import { rgbaToString } from '#veewme/web/common/formikFields/colorField'
import styled from '#veewme/web/common/styled-components'
import { ButtonBack, ButtonNext, CarouselProvider, DotGroup, Image, Slide, Slider } from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import * as React from 'react'
import { RGBColor } from 'react-color'
import { BannerPhoto, CustomBanner } from '../../../types'
import { GalleryBtn, ShareBtn } from '../../common/buttons'
import BannerPlaceholder from '../../common/helpers'
import { Container } from '../styled'

import { ShareSquare } from 'styled-icons/fa-solid'
import { ChevronLeft, ChevronRight } from 'styled-icons/feather'

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

const StyledDotGroup = styled(DotGroup)`
  position: absolute;
  bottom: 60px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;

  button {
    margin: 3px;
    width: 12px;
    height: 12px;
    border-radius: 100%;
    background: rgba(255, 255, 255, 0.8);

    &.carousel__dot--selected {
      background: rgba(0, 0, 0, 0.6);
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    display: none;
  }
`
const imageWidth = 1680
const imageHeight = 705

const StyledImage = styled(Image)`
  width: 100%;
  object-fit: cover;
`

const StyledCustomBanner = styled.div<{ background: RGBColor }>`
  position: absolute;
  top: 50px;
  left: 0;
  z-index: 1;
  padding: 10px 30px 10px 55px;
  font-size: 35px;
  color: #fff;
  font-weight: 500;
  background: ${props => rgbaToString(props.background)};

  &:hover {
    span {
      visibility: visible;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    position: static;
    padding: 7px 20px;
    font-size: 20px;

    span {
      display: none;
    }
  }
`

const StyledClose = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: -15px;
  right: -15px;
  border: 5px solid #fff;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  font-weight: 700;
  font-size: 30px;
  line-height: 26px;
  text-align: center;
  visibility: hidden;
  cursor: pointer;
`

const StyledTitle = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  padding: 7px 0%;
  bottom: 0;
  background: rgba(50, 50, 50, 0.55);
  color: #fff;

  ${Container} {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h3 {
    font-size: 25px;
    font-weight: 600;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    position: static;
    background: #fff;
    color: ${props => props.theme.colors.LABEL_TEXT};

    h3 {
      font-size: 15px;
    }
  }

`

const SliderWrapper = styled.div`
  position: relative;

  .carousel__back-button,
  .carousel__next-button {
    display: flex;
    color: ${props => props.theme.colors.ICON_UNSELECTED};
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;

    svg {
      color: rgba(255, 255, 255, 0.8);
      transform: scale(1, 1.2);
    }
  }

  .carousel__next-button {
    right: 10px;
    left: unset;
  }
`

const GalleryLink = styled(GalleryBtn)`
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    position: static;
    display: block;
  }

  a {
    @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
      display: block;
      padding: 7px 0;
      border: 0 none;
      text-align: center;
      border-radius: 0;
      font-size: 14px;
    }
  }
`

interface CustomBannerProps {
  data: CustomBanner
}
const CustomBanner: React.FunctionComponent<CustomBannerProps> = ({ data }) => {
  const [show, toggle] = React.useState(true)

  if (!show) return null

  return (
    <StyledCustomBanner background={data.background} onClick={() => toggle(false)}>
      {data.text}
      <StyledClose>&times;</StyledClose>
    </StyledCustomBanner>
  )
}

// TODO consider adding .d.ts file with globals
declare global {
  interface Window { addthis: object }
}

interface BannerSliderProps {
  photos: BannerPhoto[]
}

class BannerSlider extends React.Component<BannerSliderProps> {
  render () {
    return (
      <SliderWrapper>
        {this.props.photos.length === 0 && (
          <BannerPlaceholder width={imageWidth} height={imageHeight} />
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
        <ButtonBack>
          <ChevronLeft height='85' />
        </ButtonBack>
        <ButtonNext>
          <ChevronRight height='85' />
        </ButtonNext>
      </SliderWrapper>
    )
  }
}

interface BannerCarouselProps {
  customBanner: CustomBanner
  photos: BannerPhoto[]
  title: string
  hideTitle?: boolean
}

const BannerCarousel: React.FunctionComponent<BannerCarouselProps> = ({
  customBanner,
  hideTitle,
  photos,
  title
}) => {

  return (
    <CarouselProvider
     naturalSlideWidth={imageWidth}
     naturalSlideHeight={imageHeight}
     totalSlides={photos.length}
     hasMasterSpinner
    >
      <BannerWrapper>
        <BannerSlider
          photos={photos}
        />
        <StyledDotGroup />
        <GalleryLink />
        <CustomBanner data={customBanner} />
        {
          !hideTitle && (
            <StyledTitle>
              <Container>
                <h3>{title}</h3>
                <ShareBtn>
                  <span><ShareSquare size='20' />Share</span>
                </ShareBtn>
              </Container>
            </StyledTitle>
          )
        }
      </BannerWrapper>
    </CarouselProvider>
  )
}

export default BannerCarousel
