import { ButtonBack, ButtonNext, CarouselProvider, Slide, Slider } from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import * as React from 'react'
import styled from '../../common/styled-components'
import { GalleryRealEstate } from './types'

import { ChevronLeft, ChevronRight } from 'styled-icons/feather'

const StyledImage = styled.img`
  max-width: 100%;
`

const Buttons = styled.div`
  position: absolute;
  top: 35px;
  left: 0;
  right: 0;
  padding: 10px 0 3px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 11;

  button {
    border: 0 none;
    background: transparent;
    color: ${props => props.theme.colors.ICON_UNSELECTED};
    font-size: 26px;
    outline: 0 none;

    &[disabled] {
      color: ${props => props.theme.colors.BORDER};
      opacity: 0.6;
    }
  }

  span {
    font-size: 12px;
  }
`

export type GalleryPhoto = Pick<GalleryRealEstate['photos'][0], 'id' | 'thumbUrl'>

interface ThumbsCarouselProps {
  photos: GalleryPhoto[]
}

const ThumbsCarousel: React.FunctionComponent<ThumbsCarouselProps> = props => {
  const { photos } = props

  return (
    <CarouselProvider
     naturalSlideWidth={230}
     naturalSlideHeight={135}
     totalSlides={photos.length}
    >
      <Slider>
        {
          props.photos.map((photo, index) => (
            <Slide key={index} index={index}>
              <StyledImage src={photo.thumbUrl} />
            </Slide>
          ))
        }
      </Slider>
      <Buttons
        onClick={e => {
          e.preventDefault()
        }}
      >
        <ButtonBack>
          <ChevronLeft height='35' />
        </ButtonBack>
        <ButtonNext>
          <ChevronRight height='35' />
        </ButtonNext>
      </Buttons>
    </CarouselProvider>
  )
}

export default React.memo(ThumbsCarousel)
