import styled from '#veewme/web/common/styled-components'
import VideoPlayer from '#veewme/web/common/video'
import React, { FunctionComponent } from 'react'
import { Tour } from '../../../types'
import EmbeddedViewer from '../../common/embeddedViewer'
import { Container } from '../styled'

// Temp fix for issue related with
// https://bugs.webkit.org/show_bug.cgi?id=184025
const Wrapper = styled(Container)`
  min-height: calc(100vh - 385px);

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    min-height: calc(100vh - 320px);
  }
`

const VideoWrapper = styled.div<{
  theaterMode: boolean
}>`
  width: 80%;
  margin-left: auto;
  margin-right: auto;

  ${props => props.theaterMode && `
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  `}

`

interface VideoProps {
  tour: Tour
  id: string
}

const Video: FunctionComponent<VideoProps> = props => {
  const { tour, id } = props
  const video = tour.videos.find(v => v.id === parseInt(id, 10)) || tour.videos[0]

  if (!video) {
    return (
      <Wrapper as='main'>
        No video found
      </Wrapper>
    )
  }

  return (
    <Wrapper as='main'>
      {/* key added to re-mount VideoPlayer when id changes */}
      <VideoWrapper theaterMode={video.theaterMode}>
        {
        video && video.type === 'Embed' ?
          <EmbeddedViewer
            code={video.embeddedCode}
            key={id}
          />
        :
          <VideoPlayer
            video={video}
            key={id}
          />
        }
      </VideoWrapper>
    </Wrapper>
  )
}

export default Video
