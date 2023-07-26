import Button from '#veewme/web/common/buttons/basicButton'
import Slideshow from '#veewme/web/common/slideshow'
import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { Photo } from '../../../types'
import { Container } from '../styled'

import { Play2 } from 'styled-icons/icomoon'

const Wrapper = styled(Container).attrs({
  as: 'main'
})`
  button svg {
    transform: scale(1.2);
  }
`

const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  padding: 30px 0;
  margin-top: 20px;
  border-top: 1px solid ${props => props.theme.colors.BORDER}}

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
      grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
      grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
      grid-template-columns: repeat(2, 1fr);
  }
`

const imgWidth = 480
const imgHeight = 300

const Photo = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
  z-index: 1;
`

const PhotoWrapper = styled.div`
  width: 100%;
  padding-top: ${() => imgHeight / imgWidth * 100 }%;
  height: 0;
  position: relative;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,0.5);
  border-radius: 4px;
  cursor: pointer;
`

interface PhotosProps {
  photos: Photo[],
  slideshowAudioSrc: string
}

const Photos: FunctionComponent<PhotosProps> = ({
  photos,
  slideshowAudioSrc
 }) => {
  const [ slideshowVisible, toggleSlideshow ] = React.useState<boolean>(false)
  const [ currentPhotoIndex, setCurrentPhotoIndex ] = React.useState<number>(0)
  const [ autoPlay, setAutoPlay ] = React.useState<boolean>(false)

  const showCurrentPhoto = (index: number, auto: boolean = false) => {
    setCurrentPhotoIndex(index)
    setAutoPlay(auto)
    toggleSlideshow(true)
  }

  return (
    <Wrapper>
      <Button
        icon={Play2}
        iconLast
        onClick={() => showCurrentPhoto(0, true)}
        label='Play Slideshow'
        buttonTheme='primary'
        size='big'
      />
      <Gallery>
        {
          photos.map((photo, i) => {
            return (
              <PhotoWrapper key={photo.id} >
                <Photo
                  src={photo.thumbUrl}
                  onClick={() => showCurrentPhoto(i)}
                />
              </PhotoWrapper>
            )
          })
        }
      </Gallery>
      {slideshowVisible && <Slideshow
        autoPlay={autoPlay}
        visible={slideshowVisible}
        photos={photos}
        slideshowAudioSrc={slideshowAudioSrc}
        currentPhotoIndex={currentPhotoIndex}
        handleClose={() => toggleSlideshow(false)}
      />
      }
    </Wrapper>
  )
}
export default Photos
