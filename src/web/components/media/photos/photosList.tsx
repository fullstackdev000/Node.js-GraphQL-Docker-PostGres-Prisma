import PhotoSizeSlider from '#veewme/web/common/sizeSlider'
import Slideshow from '#veewme/web/common/slideshow'
import { DotSpinner } from '#veewme/web/common/spinners/dotSpinner'
import { differenceInDays } from 'date-fns'
import * as React from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import SelectablePhoto, { SelectablePhotoProps } from '../../../common/selectablePhoto'
import styled from '../../../common/styled-components'
import { PhotosMainListWrapper, TooltipContent } from '../styled'
import { OrderPhoto, PhotosSelection, Sort } from '../types'
import { PhotoItem } from './photos'
import Toolbar from './toolbar'

const ListWrapper = styled.section``

const PhotoWrapper = styled.div`
  position: relative;
`

const PhotoSpinner = styled(DotSpinner)`
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

const Hint = styled.p`
  margin-bottom: 15px;
  font-size: 13px;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

const PhotoIndex = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  width: 19px;
  height: 19px;
  line-height: 19px;
  text-align: center;
  z-index: 1;
  font-size: 14px;
  background: #fff;
  border-radius: 3px;
`

type PhotoItemProps = SelectablePhotoProps & {
  showLoader?: boolean
  orderNumber: number
}

const PhotoItem: React.FunctionComponent<PhotoItemProps> = props => {
  return (
    <PhotoWrapper>
      <PhotoIndex>
        {props.orderNumber}
      </PhotoIndex>
      <PhotoSpinner isProcessComplete={!props.showLoader} />
      <SelectablePhoto {...props} />
    </PhotoWrapper>
  )
}

export const SortablePhoto = SortableElement(PhotoItem)

export interface PhotosListProps {
  photos: PhotoItem[]
  onUpdate: (ids: Array<PhotoItem['id']>, payload: Partial<PhotoItem>) => void
  onDelete: (ids: Array<OrderPhoto['id']>) => void
  onSort: (sort: Sort) => void
  showBannerSettings: boolean
  processedPhotos: number[]
  newPhotoDays?: number
}

export interface PhotosListState {
  photosSelection: PhotosSelection
  previewIndex: number
  slideshowVisible: boolean
  size?: number
}

export class PhotosList extends React.PureComponent<PhotosListProps, PhotosListState> {
  state: PhotosListState = {
    photosSelection: {},
    previewIndex: 0,
    slideshowVisible: false
  }

  get selectedPhotosIds () {
    return Object.keys(this.state.photosSelection).map(id => Number(id)).filter(id => this.state.photosSelection[id])
  }

  handleSelect = (ids: Array<OrderPhoto['id']>, selected: boolean) => {
    const photosSelectionCopy = {
      ...this.state.photosSelection
    }
    ids.forEach(id => (photosSelectionCopy[id] = selected))
    this.setState({
      photosSelection: photosSelectionCopy
    })
  }

  handleSelectAll = (selected: boolean) => {
    const allIds = this.props.photos.map(photo => photo.id)
    this.handleSelect(allIds, selected)
  }

  handleUpdateSelected = (payload: Partial<OrderPhoto>) => {
    this.props.onUpdate(this.selectedPhotosIds, payload)
  }

  handleDeleteSelected = () => {
    this.handleDelete(this.selectedPhotosIds)
  }

  handleDelete = (ids: Array<OrderPhoto['id']>) => {
    this.props.onDelete(ids)
  }

  render () {
    return (
      <ListWrapper>
        <Toolbar
          photos={this.props.photos}
          photosSelection={this.state.photosSelection}
          onSelectAll={this.handleSelectAll}
          onUpdateSelected={this.handleUpdateSelected}
          onDeleteSelected={this.handleDeleteSelected}
          onSort={this.props.onSort}
        />
        <Hint>
          Star (select) photos to appear on the Property Site - Tour Overview.
          Starred photos will appear in the order displayed here. If non are selected, Overview will be blank
        </Hint>
        <PhotoSizeSlider
          name='media-photo'
          onChange={v => this.setState({ size: v })}
          label='Photo size:'
        />
        <PhotosMainListWrapper
          fixedSize
          size={this.state.size}
        >
          {
            this.props.photos.map((photo, index) => {
              const photoSelected = this.state.photosSelection[photo.id]
              const orderNumber = index + 1
              const createdDate = photo.createdAt || new Date()
              const createdDaysAgo = differenceInDays(new Date(), createdDate)
              const newPhotoDays = typeof this.props.newPhotoDays === 'undefined' ? 1 : this.props.newPhotoDays
              const isNew = createdDaysAgo <= newPhotoDays

              return (
                <SortablePhoto
                  key={photo.id}
                  index={index}
                  extended={true}
                  thumbUrl={photo.thumbUrl}
                  fullUrl={photo.fullUrl}
                  checked={photoSelected}
                  orderNumber={orderNumber}
                  isNew={isNew}
                  showBannerSettings={this.props.showBannerSettings}
                  onDelete={() => this.handleDelete([photo.id])}
                  onUpdate={(payload: Partial<OrderPhoto>) => this.props.onUpdate([photo.id], payload)}
                  onSelect={() => this.handleSelect([photo.id], !photoSelected)}
                  star={photo.star}
                  hidden={photo.hidden}
                  toolbarInfo={<TooltipContent><span>File name: {photo.fileName}</span> <span>Upload date: {photo.date}</span></TooltipContent>}
                  title={photo.title}
                  showLoader={this.props.processedPhotos.includes(photo.id)}
                  onPreview={url => this.setState({
                    previewIndex: this.props.photos.findIndex(p => p.fullUrl === url),
                    slideshowVisible: true
                  })}
                />
              )
            })
          }
        </PhotosMainListWrapper>
        {this.state.slideshowVisible && <Slideshow
          autoPlay={false}
          visible={this.state.slideshowVisible}
          photos={this.props.photos}
          currentPhotoIndex={this.state.previewIndex}
          handleClose={() => this.setState(prev => ({
            slideshowVisible:  !prev.slideshowVisible
          }))}
        />
        }
      </ListWrapper>
    )
  }
}

export default SortableContainer(PhotosList)
