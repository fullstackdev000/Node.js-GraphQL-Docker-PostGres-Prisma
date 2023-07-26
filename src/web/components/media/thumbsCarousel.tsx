import { ButtonBack, ButtonNext, CarouselInjectedProps, CarouselProvider, Slide, Slider, WithStore } from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import * as React from 'react'
import styled from '../../common/styled-components'
import { HostedVideo, OrderPhoto } from './types'

const StyledImage = styled.img`
  max-width: 100%;
`

const Buttons = styled.div`
  padding: 3px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

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

interface ThumbSliderProps extends CarouselInjectedProps {
  onSlideChange: (photoId: HostedVideo['thumbId']) => void
  photos: GalleryPhoto[]
}

interface CarouselStateMappedProps {
  currentSlide: number
}

type ThumbSliderViewProps = ThumbSliderProps & CarouselStateMappedProps

class ThumbSliderView extends React.Component<ThumbSliderViewProps> {
  handleSlideChange () {
    const { currentSlide, onSlideChange, photos } = this.props
    const slideId = photos[currentSlide] && photos[currentSlide].id
    onSlideChange(slideId)
  }

  componentDidMount () {
    // TODO temp workaround
    // https://github.com/jaredpalmer/formik/issues/930
    setTimeout(() => this.handleSlideChange(), 1)
  }

  componentDidUpdate (prevProps: ThumbSliderViewProps) {
    if (prevProps.currentSlide !== this.props.currentSlide) {
      this.handleSlideChange()
    }
  }
  render () {
    return (
      <Slider>
        {
          this.props.photos.map((photo, index) => (
            <Slide key={index} index={index}>
              <StyledImage src={photo.thumbUrl} />
            </Slide>
          ))
        }
      </Slider>
    )
  }
}

const ThumbSlider = WithStore<ThumbSliderProps, CarouselStateMappedProps>(ThumbSliderView, state => ({
  currentSlide: state.currentSlide
}))

export type GalleryPhoto = Pick<OrderPhoto, 'id' | 'thumbUrl'>

interface ThumbsCarouselProps {
  onSlideChange: (photoId: HostedVideo['thumbId']) => void
  initSlideId?: OrderPhoto['id'],
  photos: GalleryPhoto[]
}

// TODO add possibility to initialize slider by passing current photo id
const ThumbsCarousel: React.FunctionComponent<ThumbsCarouselProps> = props => {
  const { initSlideId, photos } = props
  let foundSlideIndex = -1
  if (initSlideId) {
    foundSlideIndex = React.useMemo(() => props.photos.findIndex(el => el.id === initSlideId), [])
  }
  const currentSlide = foundSlideIndex < 0 ? 0 : foundSlideIndex

  return (
    <CarouselProvider
     naturalSlideWidth={640}
     naturalSlideHeight={480}
     totalSlides={photos.length}
     currentSlide={currentSlide}
    >
      <ThumbSlider
        photos={photos}
        onSlideChange={slideId => props.onSlideChange(slideId)}
      />
      <Buttons>
        <ButtonBack>&#9664;</ButtonBack>
        <span>Select thumbnail image</span>
        <ButtonNext>&#9654;</ButtonNext>
      </Buttons>
    </CarouselProvider>
  )
}

export default React.memo(ThumbsCarousel)
