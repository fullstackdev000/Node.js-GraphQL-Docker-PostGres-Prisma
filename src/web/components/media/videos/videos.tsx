import * as log from '#veewme/web/common/log'
import arrayMove from 'array-move'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Button from '../../../common/buttons/basicButton'
import styled from '../../../common/styled-components'
import { Header, ListTitle, ListWrapper } from '../styled'
import { OrderVideoBase } from '../types'
import VideosList from './videosList'

import { Plus } from 'styled-icons/fa-solid'

const VideosHint = styled.p`
  padding-left: 22px;
  font-size: 13px;
`

interface VideosProps extends RouteComponentProps {
  videos: OrderVideoBase[]
  reorderVideos: (ids: Array<OrderVideoBase['id']>) => void
  deleteVideo: (id: OrderVideoBase['id']) => void
}

interface VideosState {
  videos: OrderVideoBase[]
  prevVideos: OrderVideoBase[]
}

// When integrated with Apollo list of videos can be stored in apollo cache instead of component state
class Videos extends React.PureComponent<VideosProps, VideosState> {
  static getDerivedStateFromProps (props: VideosProps, state: VideosState) {
    if (state.prevVideos === props.videos) {
      return null
    }
    return {
      prevVideos: props.videos,
      videos: props.videos || []
    }
  }

  // if list of videos  is stored in Apollo cache state can be removed
  state: VideosState = {
    prevVideos: [],
    videos: []
  }
  handleOrderVideoDelete = (id: OrderVideoBase['id']) => {
    log.debug('delete', id)
    this.props.deleteVideo(id)
  }

  handleSort = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
    this.setState(({ videos }) => ({
      videos: arrayMove(videos, oldIndex, newIndex)
    }), () => {
      const ids = this.state.videos.map(p => p.id)
      this.props.reorderVideos(ids)
    })
  }

  render () {
    const { match: { url } } = this.props
    return (
      <ListWrapper>
        <Header>
          <ListTitle inline={true}>
            Videos
            <Button
              buttonTheme='action'
              full={true}
              icon={Plus}
              to={`${url}/add`}
            />
          </ListTitle>
        </Header>
        <VideosHint>Drag rows into desired position on tour video navigation tab</VideosHint>
        <VideosList
          videos={this.state.videos}
          onDelete={this.handleOrderVideoDelete}
          onSortEnd={this.handleSort}
          useDragHandle
        />
      </ListWrapper>
    )
  }
}

export default Videos
