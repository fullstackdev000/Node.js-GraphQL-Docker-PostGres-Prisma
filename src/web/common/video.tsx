import styled from '#veewme/web/common/styled-components'
import { OrderVideo } from '#veewme/web/components/media/types'
import React, { FunctionComponent } from 'react'

import { Play2 } from 'styled-icons/icomoon'

type VideoType = OrderVideo['type']

export interface VideoItem {
  id: number
  url: string
  posterUrl: string
  type: Exclude<VideoType, 'Embed'>
  label?: string
}

const VideoWrapper = styled.div<{
  posterVisible: boolean
}>`
  margin: 40px 0;
  position: relative;
  overflow: hidden;
  ${props => props.posterVisible && 'cursor: pointer;'}

`

const Poster = styled.div<{
  url: string
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000 url('${props => props.url}') center / cover;
  pointer-events: none;
  z-index: 1;

  svg {
    position: absolute;
    display: block;
    left: 50%;
    top: 50%;
    margin-left: -60px;
    margin-top: -60px;
    fill: #fff;
    transition: opacity .5s;
  }
`

const VideoStyled = styled.video`
  display: block;
  width: 100%;
  outline: 0 none;

  &:hover + ${Poster} {
    svg {
      opacity: 0.8;
    }
  }
`

interface VideoPlayerProps {
  video: VideoItem
}

const VideoPlayer: FunctionComponent<VideoPlayerProps> = props => {
  const { posterUrl, url } = props.video
  const [ showPoster, setPoster ] = React.useState(true)

  return (
    <VideoWrapper
      posterVisible={showPoster}
      onClick={() => setPoster(false)}
    >
      <VideoStyled
        src={url}
        controls
        preload='auto'
        onPlay={() => setPoster(false)}
      />
      {/* video 'poster' option not used because it doesn't work when video is preloaded */}
      {
        showPoster && (
          <Poster url={posterUrl}>
            <Play2 size='120' />
          </Poster>
        )
      }
    </VideoWrapper>
  )
}

export default VideoPlayer
