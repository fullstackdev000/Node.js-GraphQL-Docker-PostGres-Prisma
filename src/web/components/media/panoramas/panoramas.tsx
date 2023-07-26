import {
  UploadPanoramaMutationVariables
} from '#veewme/gen/graphqlTypes'
import * as log from '#veewme/web/common/log'
import arrayMove from 'array-move'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import styled from '../../../common/styled-components'
import { Header, ListTitle, ListWrapper } from '../styled'
import { OrderPanorama } from '../types'
import PanoramasList, { ListPanorama } from './panoramasList'
import PanoramasUploader from './panoramasUploader'

const UploadedCount = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.LABEL_TEXT};

  span {
    font-weight: 500;
    color: ${props => props.theme.colors.TEXT_SELECTED};
  }
`

interface PanoramasState {
  panoramas: OrderPanorama[]
  prevPanoramas: OrderPanorama[]
}

type PanoramasProps = {
  panoramas: ListPanorama[]
  processedPanoramas: Array< ListPanorama['id']>
  realEstateId: number
  deletePanorama: (id: ListPanorama['id']) => void
  reorderPanoramas: (ids: Array<ListPanorama['id']>) => void
  updatePanorama: (id: ListPanorama['id'], data: Partial<ListPanorama>) => void
  uploadPanorama: (variables: UploadPanoramaMutationVariables) => Promise<{}>
} & RouteComponentProps

// When integrated with Apollo list of panoramas can be stored in apollo cache instead of component state
class Panoramas extends React.PureComponent<PanoramasProps, PanoramasState> {
  static getDerivedStateFromProps (props: PanoramasProps, state: PanoramasState) {
    if (state.prevPanoramas === props.panoramas) {
      return null
    }
    return {
      panoramas: props.panoramas || [],
      prevPanoramas: props.panoramas
    }
  }

  // if list of panoramas  is stored in Apollo cache state can be removed
  state: PanoramasState = {
    panoramas: [],
    prevPanoramas: []
  }

  handleAddFile = (panorama: OrderPanorama) => {
    this.setState(prevState => ({
      panoramas: [...prevState.panoramas, panorama]
    }))
  }

  handleOrderPanoramasUpdate = (id: OrderPanorama['id'], payload: Partial<OrderPanorama>) => {
    // here update request will be sent
    log.debug('update', id, payload)
    // when inegradted with Apollo code below can be used to update apollo cache instead of component state
    const updatedOrderPanoramas = this.state.panoramas.map(panorama => {
      if (id === panorama.id) {
        return {
          ...panorama,
          ...payload
        }
      } else {
        return panorama
      }
    })
    this.props.updatePanorama(id, payload)

    this.setState({
      panoramas: updatedOrderPanoramas
    })
  }

  handleOrderPanoramasDelete = (id: OrderPanorama['id']) => {
    log.debug('delete', id)
    this.props.deletePanorama(id)
  }

  handleDragSort = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
    this.setState(({ panoramas }) => ({
      panoramas: arrayMove(panoramas, oldIndex, newIndex)
    }), () => {
      const ids = this.state.panoramas.map(p => p.id)
      this.props.reorderPanoramas(ids)
    })
  }

  render () {
    return (
      <>
        <PanoramasUploader
          onFileUploaded={this.handleAddFile}
          uploadPanorama={this.props.uploadPanorama}
          realEstateId={this.props.realEstateId}
        />
        <ListWrapper>
          <Header>
            <ListTitle>Panoramas</ListTitle>
            <UploadedCount>Uploaded: <span>{this.state.panoramas.length}</span></UploadedCount>
          </Header>
          <PanoramasList
            panoramas={this.state.panoramas}
            processedPanoramas={this.props.processedPanoramas}
            onUpdate={this.handleOrderPanoramasUpdate}
            onDelete={this.handleOrderPanoramasDelete}
            onSortEnd={this.handleDragSort}
            useDragHandle
            axis='xy'
          />
        </ListWrapper>
      </>
    )
  }
}

export default withRouter(Panoramas)
