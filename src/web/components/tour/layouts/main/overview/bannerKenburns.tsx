import { getRandomArrayItem } from '#veewme/lib/util'
import { NavHashLink } from '#veewme/web/common/hashLink'
import styled from '#veewme/web/common/styled-components'
import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring, useTransition } from 'react-spring'
import { BannerPhoto, HorizontalDir, KenburnsBannerPhoto, VerticalDir, ZoomDir } from '../../../types'
import { GalleryBtn, ShareBtn } from '../../common/buttons'

import { ShareSquare } from 'styled-icons/fa-solid'
import { ChevronDown } from 'styled-icons/feather'
import { VolumeMedium, VolumeMute2 } from 'styled-icons/icomoon'

// mock data photo with bigger size
const bannerPhotosMock: KenburnsBannerPhoto[] = [{
  fullUrl: 'https://picsum.photos/1680/1050?image=484',
  id: 1,
  slideHorizontalDir: 'RIGHT',
  slideVerticalDir: 'UP',
  zoomDir: 'OUT'
}, {
  fullUrl: 'https://picsum.photos/1680/1050?image=1040',
  id: 2,
  slideHorizontalDir: 'LEFT',
  slideVerticalDir: 'UP',
  zoomDir: 'IN'
}, {
  fullUrl: 'https://picsum.photos/1680/1050?image=1078',
  id: 3
}, {
  fullUrl: 'https://picsum.photos/1680/1050?image=368',
  id: 4,
  slideHorizontalDir: 'LEFT',
  slideVerticalDir: 'UP',
  zoomDir: 'OUT'
}, {
  fullUrl: 'https://picsum.photos/1680/1050?image=482',
  id: 5,
  slideHorizontalDir: 'RIGHT',
  slideVerticalDir: 'DOWN',
  zoomDir: 'OUT'
}, {
  fullUrl: 'https://picsum.photos/1680/1050?image=667',
  id: 6,
  slideHorizontalDir: 'RIGHT',
  slideVerticalDir: 'CENTER',
  zoomDir: 'OUT'
}, {
  fullUrl: 'https://picsum.photos/1680/1050?image=631',
  id: 7,
  slideHorizontalDir: 'CENTER',
  slideVerticalDir: 'CENTER',
  zoomDir: 'IN'
}]

export const convertPhotosData = (data: KenburnsBannerPhoto[]) => {
  const zoomValues: ZoomDir[] = ['IN', 'NO_ZOOM', 'OUT']
  const verticalDirValues: VerticalDir[] = ['UP', 'CENTER', 'DOWN']
  const horizontalDirValues: HorizontalDir[] = ['LEFT', 'CENTER', 'RIGHT']
  const preloadedImages = []

  return data.map<Required<KenburnsBannerPhoto>>(photo => {
    const img = new Image()
    img.src = photo.fullUrl
    preloadedImages.push(img)
    return {
      ...photo,
      slideHorizontalDir: photo.slideHorizontalDir || getRandomArrayItem(horizontalDirValues),
      slideVerticalDir: photo.slideVerticalDir || getRandomArrayItem(verticalDirValues),
      zoomDir: photo.zoomDir || getRandomArrayItem(zoomValues)
    }
  })
}

const MoreLink = styled(NavHashLink)`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 140px;
  height: 100px;
  left: 50%;
  margin-left: -70px;
  bottom: 15px;
  z-index: 1;

  svg {
    position: absolute;
    top: 0;
    color: #fff;
    opacity: 0.8;
    transform: scale(3, 1.4);
  }

  span {
    display: block;
    position: absolute;
    bottom: 10px;
    width: 100%;
    left: 0;
    text-align: center;
    font-size: 24px;
    color: #fff;
    opacity: 0.6;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XS}) {
    bottom: -15px;

    span {
      display: none;
    }
  }
`

const ContentAnchor = styled.div`
  visibility: hidden;
  position: absolute;
  bottom: 0;
`

const BtnsHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90px;
  position: absolute;
  top: 15px;
  right: 50px;
  z-index: 2;

  svg {
    fill: #fff;
    opacity: 0.7;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    bottom: 70px;
    top: unset;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XS}) {
    right: 0;
    width: 100%;
    justify-content: center;
  }
`

const ShareButton = styled(ShareBtn)`
  padding: 0;
  background: transparent;
`

const GalleryLink = styled(GalleryBtn)`
  position: absolute;
  bottom: 125px;
  z-index: 1;
`

const AudioBtn = styled.span`
  position: relative;
  margin: 0 7px;
  color: ${props => props.theme.colors.DARKER_GREY};
  cursor: pointer;
  text-align: center;
`

const Title = styled.h3`
  position: absolute;
  left: 30px;
  top: 50px;
  z-index: 1;
  max-width: 550px;
  font-size: 55px;
  color: #fff;
  animation: 1s 10s fadeOut forwards;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    font-size: 35px;
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`

const AutoplayError = styled.span`
  position: absolute;
  top: 37px;
  right: 50px;
  width: 200px;
  left: 50%;
  padding: 7px;
  margin-left: -100px;
  background: #000;
  color: #fff;
  font-size: 12px;
  border-radius: 5px;

  &:before {
    content: '';
    display: block;
    position: absolute;
    top: -5px;
    left: 50%;
    margin-left: -2px;
    border-width: 0 5px 5px;
    border-style: solid;
    border-color: transparent;
    border-bottom-color: #000;
  }

  svg {
    fill: #fff;
    opacity: 0.7;
  }
`

const AudioButton: React.FunctionComponent<{
  audioSrc: string
}> = ({
  audioSrc
}) => {
  const audioHTML = React.useRef<HTMLAudioElement>(null)
  const [ isPlayingAudio, setPlayAudio ] = React.useState<boolean>(true)
  const [ autoplayErrorVisible, toggleAutoplayError ] = React.useState<boolean>(false)

  const togglePlayAudio = () => setPlayAudio(prev => !prev)

  React.useEffect(() => {
    if (audioHTML.current) {
      if (isPlayingAudio) {
        toggleAutoplayError(false)
        audioHTML.current.play().catch(() => {
          toggleAutoplayError(true)
          togglePlayAudio()
        })
      } else {
        audioHTML.current.pause()
      }
    }

  }, [isPlayingAudio])

  return (
    <AudioBtn
      onClick={togglePlayAudio}
    >
      {!isPlayingAudio ? <VolumeMute2 size='30' /> : <VolumeMedium size='30' />}
      <audio ref={audioHTML} src={audioSrc} preload='auto' />
      {autoplayErrorVisible && (
        <AutoplayError>
          Autoplay of music has been disabled by your browser. Click the icon to enable.
        </AutoplayError>
      )}
    </AudioBtn>
  )
}

export const Slide = styled(animated.div)<{
  url: string
}>`
  height: 100%;
  width: 100%;
  background-image: ${props => (`url(${props.url})`)};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  position: absolute;
  will-change: transform;
`

export const OpacityItem = styled(animated.div)`
  will-change: opacity;
`

export const BannerPlaceholder = styled.div`
  width: 100%;
  height: calc(100vh - 105px);

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    height: calc(100vh - 48px);
  }
`

export const StyledSlider = styled(BannerPlaceholder)`
  position: relative;
  width: 100%;
  overflow: hidden;
  transform: translateZ(0);
`

const SlideWrapper: React.FunctionComponent<{
  url: string
  duration?: number
  zoomDir: ZoomDir
  slideHorizontalDir: HorizontalDir
  slideVerticalDir: VerticalDir
}> = ({
  duration,
  slideVerticalDir,
  slideHorizontalDir,
  url,
  zoomDir
 }) => {
  const translateX1 = '0%'
  const translateY1 = '0%'
  let translateX2 = '0%'
  let translateY2 = '0%'

  if (slideHorizontalDir !== 'CENTER') {
    translateX2 = slideHorizontalDir === 'LEFT' ? '8%' : '-8%'
  }
  if (slideVerticalDir !== 'CENTER') {
    translateY2 = slideVerticalDir === 'DOWN' ? '-8%' : '8%'
  }

  let scale1 = zoomDir === 'OUT' ? 1.6 : 1.2
  let scale2 = zoomDir === 'OUT' ? 1.2 : 1.6
  if (zoomDir === 'NO_ZOOM') {
    scale1 = 1.2
    scale2 = 1.2
  }

  const transform1 = `scale(${scale1}) translate3d(${translateX1}, ${translateY1}, 0)`
  const transform2 = `scale(${scale2}) translate3d(${translateX2}, ${translateY2}, 0)`

  const props = useSpring({
    config: {
      duration
    },
    from: {
      transform: transform1
    },
    to: {
      transform: transform2
    }
  })
  return <Slide url={url} style={{ ...props }} />
}

interface BannerProps {
  photos: BannerPhoto[]
  title: string
  slideDuration?: number
  audioSrc?: string
  hideTitle?: boolean
}

const Banner: React.FunctionComponent<BannerProps> = ({
  audioSrc,
  hideTitle,
  photos: photosRaw,
  slideDuration = 7500,
  title
}) => {

  const [currentIndex, setCurrentIndex] = useState(0)
  const [bannerVisible, showBanner] = useState(false)
  const intervalId = useRef<number>()

  const opacityDuration = 900

  const photos = React.useMemo(() => {
    if (!photosRaw) {
      return []
    }
    // TODO: temp solution until kenburns banner settings API is ready
    const tempPhotos = photosRaw.map((p, i) => ({
      ...bannerPhotosMock[i],
      ...p
    }))
    return convertPhotosData(tempPhotos)
  }, [photosRaw])

  const transitions = useTransition(
    photos[currentIndex],
    item => {
      return item.id
    },
    {
      config: {
        duration: opacityDuration
      },
      enter: {
        opacity: 1
      },
      from: {
        opacity: 0
      },
      leave: {
        opacity: 0
      }
    }
  )

  useEffect(() => {
    intervalId.current = setInterval(() => {
      setCurrentIndex(i => {
        return (i + 1) % photos.length
      })
    }, slideDuration)
    showBanner(true) // sync above interval with react-spring animations

    return () => {
      clearTimeout(intervalId.current)
    }
  }, [])

  return (
    <>
      <StyledSlider>
        <BtnsHolder>
          {audioSrc && <AudioButton audioSrc={audioSrc} />}
          <ShareButton>
            <ShareSquare size='30'/>
          </ShareButton>
        </BtnsHolder>
        <GalleryLink />
        <MoreLink to='#content'>
          <ChevronDown width='180' height='70' />
          <span>MORE</span>
        </MoreLink>
        {bannerVisible && transitions.map(({ item, props, key }) => (
          <OpacityItem style={props} key={key}>
            <SlideWrapper
              url={item.fullUrl}
              zoomDir={item.zoomDir}
              slideHorizontalDir={item.slideHorizontalDir}
              slideVerticalDir={item.slideVerticalDir}
              duration={slideDuration}
            />
          </OpacityItem>
        ))}
        {
          !hideTitle && (
            <Title>
              {title}
            </Title>
          )
        }
        <ContentAnchor id='content' />
      </StyledSlider>
    </>
  )
}

const BannerWrapper: React.FunctionComponent<BannerProps> = props => {
  if (props.photos.length) {
    return <Banner {...props} />
  } else {
    return <BannerPlaceholder />
  }
}

export default BannerWrapper
