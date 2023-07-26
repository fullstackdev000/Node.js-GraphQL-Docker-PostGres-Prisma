import {
  UploadRealEstatePhotoMutationVariables
} from '#veewme/gen/graphqlTypes'
import HideForRole from '#veewme/web/common/hideForRole'
import * as log from '#veewme/web/common/log'
import { Wrapper } from '#veewme/web/common/selectablePhoto'
import { createGlobalStyle } from '#veewme/web/common/styled-components'
import { guidGenerator } from '#veewme/web/common/util'
import arrayMove from 'array-move'
import PubSub from 'pubsub-js'
import * as React from 'react'
import { Header, ListTitle, ListWrapper, Subtitle, UploaderHolder } from '../styled'
import { OrderPhoto, Sort } from '../types'
import Uploader from '../uploader'
import BannerForm from './bannerTypeForm'
import { UploadProgressData } from './photosContainer'
import PhotosList from './photosList'

const GlobalStyles = createGlobalStyle`
  .sortableHelper > ${Wrapper} {
    border: 4px solid ${props => props.theme.colors.ALERT};
    border-radius: 5px;
  }
`

export type PhotoItem = Omit<OrderPhoto, 'inFlyer' | 'webUrl'>
export const subscriptionTopicName = 'photoUploadProgress'

type PhotoUpdateDelta = Partial<Pick<OrderPhoto, 'hidden' | 'star' | 'title'>>

interface PhotosState {
  prevPhotos: PhotoItem[]
  photos: PhotoItem[]
  slideshow: boolean
}

interface PhotosProps {
  photos: PhotoItem[]
  address: string
  uploadPhoto: (variables: UploadRealEstatePhotoMutationVariables) => Promise<{}>
  realEstateId: UploadRealEstatePhotoMutationVariables['realEstateId']
  deletePhotos: (ids: Array<PhotoItem['id']>) => void
  updatePhotos: (ids: Array<PhotoItem['id']>, data: PhotoUpdateDelta) => void
  reorderPhotos: (ids: Array<PhotoItem['id']>) => void
  processedPhotos: number[]
}

// When integrated with Apollo list of photos can be stored in apollo cache instead of component state
class Photos extends React.PureComponent<PhotosProps, PhotosState> {
  // TODO: when Photos view is fully integrated with backend it should be considered to remove local state
  static getDerivedStateFromProps (props: PhotosProps, state: PhotosState) {
    if (state.prevPhotos === props.photos) {
      return null
    }
    return {
      photos: props.photos || [],
      prevPhotos: props.photos
    }
  }

  // if list of photos  is stored in Apollo cache state can be removed
  state: PhotosState = {
    photos: this.props.photos,
    prevPhotos: [],
    slideshow: false
  }

  handleOrderPhotosUpdate = (ids: Array<OrderPhoto['id']>, payload: Partial<OrderPhoto>) => {
    // here update request will be sent
    log.debug('update', ids, payload)
    // when inegradted with Apollo code below can be used to update apollo cache instead of component state
    const updatedOrderPhotos = this.state.photos.map(photo => {
      if (ids.find(id => id === photo.id)) {
        return {
          ...photo,
          ...payload
        }
      } else {
        return photo
      }
    })

    this.setState({
      photos: updatedOrderPhotos
    })

    this.props.updatePhotos(ids, payload)
  }

  handleOrderPhotosDelete = (ids: Array<OrderPhoto['id']>) => {
    log.debug('delete', ids)
    this.props.deletePhotos(ids)
  }

  handleSort = (sort: Sort) => {
    log.debug('sort', sort)
  }

  handleDragSort = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
    this.setState(({ photos }) => ({
      photos: arrayMove(photos, oldIndex, newIndex)
    }), () => {
      const ids = this.state.photos.map(p => p.id)
      this.props.reorderPhotos(ids)
    })

  }

  handleAddFile = (photo: OrderPhoto) => {
    this.setState(prevState => ({
      photos: [...prevState.photos, photo]
    }))
  }

  render () {
    return (
      <ListWrapper>
        <UploaderHolder>
          <div>
            <Header>
              <ListTitle>
                Upload Photos
                <Subtitle>Drag & drop or click to upload</Subtitle>
              </ListTitle>
            </Header>
            <Uploader
              server={{
                process: (_fieldName, file, _metadata, load, error, progress, abort) => {
                  const id = guidGenerator()

                  /*
                    Call 'load' finishing Filepond upload only when mutation promise is resolved (instead of when progress === 100)
                    because Promise is resolved only when fresh list of photos is refetched (awaitRefetchQueries is used in mutation)
                    Thanks to this new image appears on list immediately after file item has disappeared from Filepond
                    Note: async/await can't be used here because Filepond 'process' function can't return promise
                  */
                  this.props.uploadPhoto({
                    file,
                    photoIdentification: id,
                    realEstateId: this.props.realEstateId
                  })
                  .then(() => {
                    load()
                  })
                  .catch(e => error(e))

                  PubSub.subscribe(subscriptionTopicName, (msg: string, progressData: UploadProgressData) => {
                    const data = progressData.uploadRealEstatePhotoProgress
                    if (data && data.photoIdentification === id) {
                      progress(true, data.progress, 100)
                    }
                  })

                   // Should expose an abort method so the request can be cancelled
                  return {
                    abort: () => {
                      // This function is entered if the user has tapped the cancel button
                      // Call custom abort method e.g. request.abort()
                      // and let FilePond know the request has been cancelled
                      abort()
                    }
                  }
                },
                revert: null
              }}
              acceptedFileTypes={['image/png', 'image/jpeg', 'image/gif']}
            />
          </div>
          <HideForRole roles={['PROCESSOR']}>
            <BannerForm
              onChange={values => {
                log.debug(values)
                this.setState({
                  slideshow: values.slideshow
                })
              }}
            />
          </HideForRole>
        </UploaderHolder>
        <PhotosList
          photos={this.state.photos}
          onUpdate={this.handleOrderPhotosUpdate}
          onDelete={this.handleOrderPhotosDelete}
          onSort={this.handleSort}
          onSortEnd={this.handleDragSort}
          axis='xy'
          helperClass='sortableHelper'
          useWindowAsScrollContainer
          useDragHandle
          showBannerSettings={this.state.slideshow}
          processedPhotos={this.props.processedPhotos}
          newPhotoDays={2}
        />
        <GlobalStyles />
      </ListWrapper>
    )
  }
}

export default Photos
