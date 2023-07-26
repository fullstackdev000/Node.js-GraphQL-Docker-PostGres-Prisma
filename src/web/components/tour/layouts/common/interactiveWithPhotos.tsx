import Slideshow from '#veewme/web/common/slideshow'
import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { Photo } from '../../types'

const Wrapper = styled.div`
  button svg {
    transform: scale(1.2);
  }
`

const Gallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 40px;
  justify-content: center;
`

const imgWidth = 480
const imgHeight = 300

const Photo = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: contain;
  z-index: 1;
`

export const PhotoWrapper = styled.div`
  width: 100%;
  aspect-ratio ${imgWidth / imgHeight};
  position: relative;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,0.5);
  border-radius: 4px;
  cursor: pointer;
`

export const PhotoTitle = styled.div`
  padding: 10px 0;
  color: ${props => props.theme.colors.LAYOUT_2_FONT};
  font-weight: 500;
`

export const Item = styled.div`
  flex: 0 0 20%;
  padding: 10px;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
    flex: 0 0 25%;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    flex: 0 0 33%;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    flex: 0 0 50%;
  }
`

type GalleryPhoto = Omit<Photo, 'thumbUrl'>
interface PhotosProps {
  photos: GalleryPhoto[],
}

const Photos: FunctionComponent<PhotosProps> = ({
  photos
 }) => {
  const [ slideshowVisible, toggleSlideshow ] = React.useState<boolean>(false)
  const [ currentPhotoIndex, setCurrentPhotoIndex ] = React.useState<number>(0)

  const showCurrentPhoto = (index: number, auto: boolean = false) => {
    setCurrentPhotoIndex(index)
    toggleSlideshow(true)
  }

  return (
    <Wrapper>
      <Gallery>
        {
          photos.map((photo, i) => {
            return (
              <Item key={photo.id}>
                <PhotoWrapper>
                  <Photo
                    src={photo.fullUrl}
                    onClick={() => showCurrentPhoto(i)}
                  />
                </PhotoWrapper>
                <PhotoTitle>
                  {photo.title}
                </PhotoTitle>
              </Item>
            )
          })
        }
      </Gallery>
      {slideshowVisible && <Slideshow
        visible={slideshowVisible}
        photos={photos}
        currentPhotoIndex={currentPhotoIndex}
        handleClose={() => toggleSlideshow(false)}
      />
      }
    </Wrapper>
  )
}
export default Photos
