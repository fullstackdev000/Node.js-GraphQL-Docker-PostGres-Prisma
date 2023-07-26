import Button from '#veewme/web/common/buttons/basicButton'
import styled from '#veewme/web/common/styled-components'
import VideoPlayer from '#veewme/web/common/video'
import React, { FunctionComponent } from 'react'
import { TourContext } from '..'
import { Tour } from '../../../types'
import EmbeddedViewer from '../../common/embeddedViewer'
import { Container, SectionTitle } from '../styled'

const Wrapper = styled(Container)<{ mainColor: string }>`
  padding-top: 30px;
  padding-bottom: 50px;
`

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0;
`

const VideoButton = styled(props => <Button {...props}/>)<{
  mainColor: string
  active?: boolean
}>`
  background: ${props => !props.active ? props.mainColor : '#fff'} !important;
  border-color: ${props => props.mainColor} !important;
  color: ${props => props.active ? props.mainColor : '#fff'} !important;

  & + & {
    margin-left: 20px;
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

  div {
    margin-left: 0;
    margin-right: 0;
    height: 0 !important;
    padding-bottom: 56.25%;

    video {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
`

interface VideosProps {
  tour: Tour
}

const Videos: FunctionComponent<VideosProps> = ({ tour }) => {
  const mainColor = React.useContext(TourContext).mainColor
  const [videoId, setVideoId] = React.useState(tour.videos[0].id)

  if (tour.videos.length === 0) {
    return null
  }

  const videoToShow = tour.videos.find(v => v.id === videoId) || tour.videos[0]

  return (
    <Wrapper mainColor={mainColor} id='videos'>
      <SectionTitle mainColor={mainColor}>Videos</SectionTitle>
      <Buttons>
        {
          tour.videos.map(video => {
            return (
              <VideoButton
                key={video.id}
                active={videoToShow.id === video.id}
                size='big'
                buttonTheme='action'
                type='button'
                label={video.label}
                mainColor={mainColor}
                onClick={() => setVideoId(video.id)}
              />
            )
          })
        }
      </Buttons>
      <VideoWrapper theaterMode={videoToShow.theaterMode}>
        {
          videoToShow && videoToShow.type === 'Embed' ?
            <EmbeddedViewer
              code={videoToShow.embeddedCode}
            />
          :
          <VideoPlayer
            video={videoToShow}
            key={videoToShow.id}
          />
        }
      </VideoWrapper>
    </Wrapper>
  )
}
export default Videos
