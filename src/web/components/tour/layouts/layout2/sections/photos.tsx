import Slideshow from '#veewme/web/common/slideshow'
import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import Gallery, { RenderImageProps } from 'react-photo-gallery'
import { Photo } from '../../../types'
import { Container, SectionTitle } from '../styled'

const Wrapper = styled(Container)`
  padding-top: 30px;

  button svg {
    transform: scale(1.2);
  }
`
const Title = styled.span`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  opacity: 0;
  transition: opacity .5s;
  z-index: 2;
`

const ExperienceLayer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  opacity: 0;
  transition: opacity .5s;
  background: rgba(255, 255, 255, 0.6);

  span {
    display: block;
    padding: 8px 20px;
    border: 2px solid #fff;
    color: ${props => props.theme.colors.DARKER_GREY};
    background: rgba(255, 255, 255, 0.4);
    font-size: 32x;
    font-weight: 500;
    text-transform: uppercase;
  }
`

const PhotoWrapper = styled.div<{
  left: number
  top: number
  width: number
  height: number
}>`
  position: absolute;
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    ${Title} {
      opacity: 1;
    }

    ${ExperienceLayer} {
      opacity: 1;
    }
  }

  img {
    width: 100%;
    height: 100%;
    transition: transform .5s;
    object-fit: cover;


    &:hover {
      transform: scale(1.2, 1.2);
    }
  }
`

const Subtitle = styled.span`
  margin-top: 5px;
  margin-left: 8px;
  font-size: 18px;
  color: ${props => props.theme.colors.LAYOUT_2_FONT};
  font-weight: 500;
`

const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

type PhotoItemProps = RenderImageProps
const PhotoItem: React.FC<PhotoItemProps> = ({ left = 0, top = 0, photo, index, onClick }) => {
  return (
    <PhotoWrapper
      left={left}
      top={top}
      key={index} // react-photo-gallery internally calls renderImage components as function so 'key' props must be added here
      width={photo.width}
      height={photo.height}
      onClick={e => {
        onClick && onClick(e, { index })
      }}
    >
      <img
        width={photo.width}
        height={photo.height}
        src={photo.src}
      />
      {
        photo.alt && (
          <Title>
            {photo.alt}
          </Title>
        )
      }
      <ExperienceLayer>
        <span>Experience</span>
      </ExperienceLayer>
    </PhotoWrapper>
  )
}

const visibleThumbsCount = 15

interface PhotosProps {
  photos: Photo[],
  slideshowAudioSrc: string
  mainColor: string
}

const Photos: FunctionComponent<PhotosProps> = ({
  mainColor,
  photos,
  slideshowAudioSrc
 }) => {
  const [ slideshowVisible, toggleSlideshow ] = React.useState<boolean>(false)
  const [ currentPhotoIndex, setCurrentPhotoIndex ] = React.useState<number>(0)

  const photosSrc = React.useMemo(() => {
    return photos.slice(0, visibleThumbsCount).map(p => ({
      alt: p.title,
      height: randomIntFromInterval(2, 3),
      src: p.thumbUrl,
      width: randomIntFromInterval(2, 4)
    }))
  }, [photos])

  const openSlideshow = React.useCallback((_, { index }) => {
    setCurrentPhotoIndex(index)
    toggleSlideshow(true)
  }, [])

  return (
    <>
      <Wrapper id='photos'>
        <SectionTitle
          mainColor={mainColor}
        >
          Photo Gallery
          <Subtitle>
            ({`${photos.length} photos - ${photosSrc.length} shown`})
          </Subtitle>
        </SectionTitle>
        <Gallery
          direction='column'
          photos={photosSrc}
          onClick={openSlideshow}
          renderImage={PhotoItem}
        />
      </Wrapper>
      {slideshowVisible && <Slideshow
        autoPlay={false}
        visible={slideshowVisible}
        photos={photos}
        slideshowAudioSrc={slideshowAudioSrc}
        currentPhotoIndex={currentPhotoIndex}
        handleClose={() => toggleSlideshow(false)}
      />
      }
    </>
  )
}
export default Photos
