import { FlyerLayoutName } from '#veewme/gen/graphqlTypes'
import arrayMove from 'array-move'
import * as React from 'react'
import Button from '../../../common/buttons/basicButton'
import { flyerLayoutPhotosCount } from '../../../common/flyerIcons'
import { ToolbarStyled } from '../../../common/selectablePhoto'
import styled from '../../../common/styled-components'
import Gallery from '../photosGallery'
import { OrderPhoto } from '../types'
import SelectedFlyerPanel from './selectedFlyerPanel'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(200px, 250px) auto;
  grid-column-gap: 30px;

  ${ToolbarStyled}${ToolbarStyled} {
    display: none;
  }
}
`

const SubmitBtn = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`

const PhotosCountWarning = styled.div`
  display: flex;
  align-items: center;
  padding: 0 15px;
  font-size: 13px;
`

const TEMP_COUNT = 4 // TODO remove when selecting layout integrated

type FlyerPhoto = Pick<OrderPhoto, 'id' | 'title' | 'thumbUrl' | 'fullUrl' | 'fileName'>

interface FlyerProps {
  photos: FlyerPhoto[]
  onCreateFlyer: (ids: number[]) => void
  flyerUrl?: string
}

type FlyerPhotoExtended = FlyerPhoto & {
  inFlyer?: boolean
}

interface FlyerState {
  photos: FlyerPhotoExtended[]
  flyerLayoutName: FlyerLayoutName
}

class Flyer extends React.PureComponent<FlyerProps, FlyerState> {
  // When integrated with Apollo data can be stored in apollo cache instead of component state
  state: FlyerState = {
    flyerLayoutName: 'FEATURED2MINOR6',
    photos: this.props.photos
  }

  handleSort = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
    this.setState(({ photos }) => ({
      photos: arrayMove(photos, oldIndex, newIndex)
    }))
  }

  handlePhotoSelection = (ids: Array<OrderPhoto['id']>) => {
    const updatedPhotos = this.state.photos.map(photo => {
      const photoSelected = ids.indexOf(photo.id) >= 0

      return {
        ...photo,
        inFlyer: photoSelected
      }
    })
    this.setState({
      photos: updatedPhotos
    })
  }

  handleLayoutSelect = (value: FlyerLayoutName) => {
    this.setState({
      flyerLayoutName: value
    })
  }

  render () {
    const { flyerLayoutName, photos } = this.state
    const availablePhotosToSelectCount = flyerLayoutPhotosCount[flyerLayoutName]
    const selectedCount = this.state.photos.filter(p => p.inFlyer).length
    const showIncorrectPhotosCountError = selectedCount !== TEMP_COUNT

    return (
      <Wrapper>
        <SelectedFlyerPanel
          currentLayoutName={flyerLayoutName}
          availablePhotosToSelectCount={availablePhotosToSelectCount}
          onLayoutSelect={this.handleLayoutSelect}
          flyerUrl={this.props.flyerUrl}
        />
        <div>
          <Gallery
            photos={photos}
            title='Select photos to appear on Flyer. Drag/drop to arrange order of appearance.'
            maxCount={availablePhotosToSelectCount}
            selectedCountLabel='selected out of'
            showMaxLabel={false}
            onSortEnd={this.handleSort}
            axis='xy'
            useDragHandle
            ofCount={availablePhotosToSelectCount}
            onChange={value => this.handlePhotoSelection(value)}
            onUpdate={() => null}
          />
          <SubmitBtn>
            {
              showIncorrectPhotosCountError && (
                <PhotosCountWarning>Please select required number of photos ({TEMP_COUNT}).</PhotosCountWarning>
              )
            }
            <Button
              label='Generate Flyer'
              buttonTheme='action'
              disabled={showIncorrectPhotosCountError}
              full
              onClick={() => {
                const flyerPhotosIds = this.state.photos.filter(p => p.inFlyer).map(p => p.id)
                this.props.onCreateFlyer(flyerPhotosIds)
              }}
            />
          </SubmitBtn>
        </div>
      </Wrapper>
    )
  }
}

export default Flyer
