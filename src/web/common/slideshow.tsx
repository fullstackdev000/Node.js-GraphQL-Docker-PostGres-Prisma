import FullScreenButton from '#veewme/web/common/fullScreenButton'
import * as log from '#veewme/web/common/log'
import styled, { createGlobalStyle } from '#veewme/web/common/styled-components'
import { OrderPhoto } from '#veewme/web/components/media/types'
import React, { FunctionComponent } from 'react'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

import { Pause, Play } from 'styled-icons/boxicons-regular'
import { VolumeMedium, VolumeMute2 } from 'styled-icons/icomoon'

// https://github.com/Microsoft/TSJS-lib-generator/issues/551
declare global {
  interface Document { fullscreenElement: HTMLElement }
}

export type Photo = Pick<OrderPhoto, 'fullUrl'> & {
  title?: string
}

const GlobalStyle = createGlobalStyle`
  body {

  }

  .ril-outer.ril__outer {
    background-color: rgba(255, 255, 255, 0.95);

    .ril-toolbar {
      background-color: rgba(255, 255, 255, 0.5);

      .ril-toolbar__item__child {
        color: ${props => props.theme.colors.GREY};
        font-size: 16px;
      }

      button {
        filter: brightness(20%);

        &:focus {
          outline: 0 none;
          box-shadow: none;
          border: 0 none;
        }
      }
    }
  }

  .ril__image {
    transition: transform .5s;
  }

  .ril__loadingContainer .ril__loadingCirclePoint:before {
    background-color: ${props => props.theme.colors.GREY};
  }
`

const ToggleBtnStyled = styled.span`
  margin: 0 7px;
  color: ${props => props.theme.colors.DARKER_GREY};
  cursor: pointer;
  vertical-align: middle;
`

interface PlayButtonProps {
  isPlaying: boolean
  onClick: () => void
}

const PlayButton: React.FunctionComponent<PlayButtonProps> = ({
  isPlaying,
  onClick
}) => (
  <ToggleBtnStyled
    title={isPlaying ? 'Stop' : 'Play'}
    onClick={onClick}
  >
    {isPlaying ? <Pause size='36' /> : <Play size='36' />}
  </ToggleBtnStyled>
)

interface AudioButtonProps {
  isPlayingAudio: boolean
  onClick: () => void
}

const AudioButton: React.FunctionComponent<AudioButtonProps> = ({
  isPlayingAudio,
  onClick
}) => (
  <ToggleBtnStyled
    title={isPlayingAudio ? 'Mute' : 'Play'}
    onClick={onClick}
  >
    {!isPlayingAudio ? <VolumeMute2 size='20' /> : <VolumeMedium size='20' />}
  </ToggleBtnStyled>
)

const play = async (audioEl: HTMLAudioElement) => {
  try {
    await audioEl.play()
  } catch (e) {
    log.debug('Error: play rejected')
  }
}

interface SlideshowProps {
  photos: Photo[]
  visible: boolean
  handleClose: () => void
  currentPhotoIndex: number
  autoPlay?: boolean
  slideshowAudioSrc?: string
}

const Slideshow: FunctionComponent<SlideshowProps> = ({
  currentPhotoIndex,
  handleClose,
  autoPlay = false,
  photos,
  slideshowAudioSrc,
  visible
}) => {
  const interval = React.useRef<number>()
  const audioHTML = React.useRef<HTMLAudioElement>(null)
  const [ photoIndex, setPhotoIndex ] = React.useState<number>(currentPhotoIndex)
  const [ isPlaying, setPlay ] = React.useState<boolean>(autoPlay)
  const [ isPlayingAudio, setPlayAudio ] = React.useState<boolean>(autoPlay)

  const togglePlay = () => setPlay(prev => !prev)
  const togglePlayAudio = () => setPlayAudio(prev => !prev)
  const images = photos.map(photo => photo.fullUrl)

  const PlayBtn = <PlayButton isPlaying={isPlaying} onClick={togglePlay} />
  const AudioBtn = slideshowAudioSrc && <AudioButton isPlayingAudio={isPlayingAudio} onClick={togglePlayAudio} />
  const FullScreenBtn = <ToggleBtnStyled><FullScreenButton elementSelector='.ril-outer' /></ToggleBtnStyled>

  React.useEffect(() => {
    if (isPlaying) {
      slideshowAudioSrc && setPlayAudio(true)
      interval.current = setInterval(() => {
        // https://stackoverflow.com/a/46204035
        const nextBtn: HTMLElement = document.querySelector('.ril-next-button') as HTMLElement
        if (nextBtn) {
          nextBtn.click()
        }
      }, 5000)
    } else {
      clearInterval(interval.current)
      slideshowAudioSrc && setPlayAudio(false)
    }

    return () => {
      clearInterval(interval.current)
    }

  }, [isPlaying])

  React.useEffect(() => {
    if (audioHTML.current) {
      if (isPlayingAudio) {
        play(audioHTML.current).catch()
      } else {
        audioHTML.current.pause()
      }
    }

  }, [isPlayingAudio])

  return (
    <>
    {visible && (
      <>
        <Lightbox
          imageTitle={`${(photoIndex) % images.length + 1} / ${images.length} ${photos[photoIndex].title || ''}`}
          toolbarButtons={[AudioBtn, PlayBtn, FullScreenBtn]}
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => handleClose()}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
        />
        <audio ref={audioHTML} src={slideshowAudioSrc} preload='auto' />
        <GlobalStyle />
      </>
    )}
    </>
  )
}
export default Slideshow
