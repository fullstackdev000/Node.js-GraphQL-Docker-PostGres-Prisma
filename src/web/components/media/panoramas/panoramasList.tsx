import * as log from '#veewme/web/common/log'
import { DotSpinner } from '#veewme/web/common/spinners/dotSpinner'
import { itemShadowHover } from '#veewme/web/common/styled'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import SelectablePhoto, { SelectablePhotoProps, Wrapper } from '../../../common/selectablePhoto'
import styled from '../../../common/styled-components'
import { PhotosMainListWrapper, TooltipContent } from '../styled'
import { OrderPanorama } from '../types'

const ListWrapper = styled(PhotosMainListWrapper)`
  ${Wrapper} {
    ${itemShadowHover}
  }
`

const PanoramaSpinner = styled(DotSpinner)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: rgba(255, 255, 255, 0.7);
  display: ${props => props.isProcessComplete ? 'none' : 'flex'};

  > div {
    top: -20px;
  }
`

const ItemWrapper = styled.div`
  position: relative;
`

type PanoramaItemProps = SelectablePhotoProps & {
  showLoader?: boolean
}
const PanoramaWithSpinner: React.FunctionComponent<PanoramaItemProps> = props => {
  return (
    <ItemWrapper>
      <PanoramaSpinner isProcessComplete={!props.showLoader} />
      <SelectablePhoto {...props} />
    </ItemWrapper>
  )
}

export type ListPanorama = Pick<OrderPanorama,
  'id'
  | 'fullUrl'
  | 'thumbUrl'
  | 'title'
  | 'fileName'
  | 'date'
  | 'initialZoom'
  | 'theaterMode'
>

interface PanoramasListProps extends RouteComponentProps {
  panoramas: ListPanorama[]
  processedPanoramas: Array<ListPanorama['id']>
  onUpdate: (id: OrderPanorama['id'], payload: Partial<Omit<OrderPanorama, 'id'>>) => void
  onDelete: (id: OrderPanorama['id']) => void
}

// TODO change SelectablePhoto types to use number id
const PanoramaItem = SortableElement(PanoramaWithSpinner)

class PanoramasList extends React.PureComponent<PanoramasListProps> {
  render () {
    const { match: { url } } = this.props
    log.debug(this.props.processedPanoramas)
    return (
      <ListWrapper panoramicItems={true} >
        {
          this.props.panoramas.map((panorama, i) => {
            return (
              <PanoramaItem
                extended={true}
                index={i}
                key={panorama.id}
                panoramicAspectRatio={true}
                thumbUrl={panorama.thumbUrl}
                onDelete={() => this.props.onDelete(panorama.id)}
                onUpdate={payload => this.props.onUpdate(panorama.id, payload)}
                title={panorama.title}
                editUrl={`${url}/${panorama.id}`}
                showLoader={this.props.processedPanoramas.includes(panorama.id)}
                toolbarInfo={
                  <TooltipContent>
                    <span>File name: {panorama.fileName}</span>
                    <span>Upload date: {panorama.date}</span>
                    <span>Initial zoom: {panorama.initialZoom}</span>
                    <span>Theater mode: {panorama.theaterMode ? 'yes' : 'no'}</span>
                  </TooltipContent>
                }
              />
            )
          })
        }
      </ListWrapper>
    )
  }
}

export default SortableContainer(withRouter(PanoramasList))
