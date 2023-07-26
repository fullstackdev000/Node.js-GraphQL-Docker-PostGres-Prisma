import styled from '#veewme/web/common/styled-components'
import { OrderVideoBase } from '#veewme/web/components/media/types'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import TabContainer from '../tabContainer'
import VideoItem from './videoItem'

const VideosWrapper = styled.div`
  padding: 0 15px 0 0;
`

type Video = Omit<OrderVideoBase, 'date'>
interface VideosListProps {
  videos: Video[]
}

const VideosList: React.FunctionComponent<VideosListProps> = props => (
  <TabContainer>
    <Scrollbars
      autoHeight={true}
      autoHeightMax={`calc(85vh - 245px)`}
      autoHide={false}
      autoHeightMin='250px'
    >
      <VideosWrapper>
        {props.videos.map(video => (<VideoItem key={video.id} video={video} />))}
      </VideosWrapper>
    </Scrollbars>
  </TabContainer>
)

export default VideosList
