import { itemShadow } from '#veewme/web/common/styled'
import * as React from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import Panel from '../../common/panel'
import SelectablePhoto, { InputWrapper, ToolbarStyled } from '../../common/selectablePhoto'
import styled from '../../common/styled-components'
import { OrderPhoto } from './types'

const GalleryContainer = styled.div<{ responsive?: boolean }>`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 25px;
  grid-row-gap: 35px;

  ${props => props.responsive && `
    @media (max-width: ${props.theme.breakpoints.BREAKPOINT_FHD}) {
        grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: ${props.theme.breakpoints.BREAKPOINT_XL}) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: ${props.theme.breakpoints.BREAKPOINT_LG}) {
        grid-template-columns: repeat(2, 1fr);
    }
  `}

  ${props => !props.responsive && `
      grid-template-columns: repeat(auto-fill, 205px) !important;
      align-content: space-around;
      justify-content: center;
  `}

`

const PanelStyled = styled(Panel)`
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    header {
      flex-wrap: wrap;
    }

    h2 {
      margin-bottom: 8px;
      width: 100%;
    }
  }

`

const PhotoWrapper = styled.div<{
  starActive: boolean
}>`
  ${InputWrapper} {
    padding: 0;
    position: absolute;
    right: 0;
    bottom: -30px;
    background: transparent;

    input {
      display: none;
    }
  }

  ${ToolbarStyled} {
    position: absolute;
    top: 0;
    right: 0;
    height: 40px;
    background: transparent;
    display: ${props => props.starActive ? 'flex' : 'none'};

    & > div span:not(:first-child) {
      display: none;
    }
  }

  img {
    transition: filter .5s, box-shadow .5s;
    opacity: 1;
  }

  &:hover {
    ${ToolbarStyled} {
      display: flex;
    }

    img {
      filter: none;
      ${itemShadow}
    }
  }
`

const PhotosQuantity = styled.span`
  font-weight: 600;
`

const SelectionWarning = styled.div<{ error?: boolean }>`
  margin: -10px 0 15px 0;
  min-height: 17px;
  font-size: 13px;
  ${props => props.error && `color: ${props.theme.colors.ALERT};`}
`

const Subtitle = styled.div<{ error?: boolean }>`
  margin: -10px 0 15px 0;
  min-height: 17px;
  font-size: 12px;

  svg {
    fill: ${props => props.theme.colors.ICON_UNSELECTED};
  }
`

const PhotoItem: React.FunctionComponent<{
  photo: GalleryPhoto
  checked?: boolean
  onSelectPhoto: (id: OrderPhoto['id']) => void
  star: boolean
  onUpdate: PhotosGalleryProps['onUpdate']
}> = ({
  checked,
  photo,
  onSelectPhoto,
  star,
  onUpdate
}) => (
  <PhotoWrapper key={photo.id} starActive={star}>
    <SelectablePhoto
      thumbUrl={photo.thumbUrl}
      checked={checked}
      onSelect={() => onSelectPhoto(photo.id)}
      hidden={!checked}
      extended
      onUpdate={payload => {
        if (payload.star) {
          onUpdate(photo.id)
        } else {
          onUpdate()
        }
      }}
      title={photo.title}
      star={star}
    />
  </PhotoWrapper>
)
const SortablePhoto = SortableElement(PhotoItem)

interface PhotosSelection {
  [photoId: number]: boolean
}

export type GalleryPhoto = Pick<OrderPhoto, 'id' | 'thumbUrl' | 'title'>
interface PhotosGalleryProps {
  defaultThumb?: OrderPhoto['id']
  photos: GalleryPhoto[]
  title: string
  maxCount: number,
  ofCount?: number,
  onChange: (ids: Array<OrderPhoto['id']>) => void
  selectedCountLabel?: string
  showMaxLabel?: boolean
  extended?: boolean
  onUpdate: (id?: OrderPhoto['id']) => void
  subtitle?: JSX.Element
}

const PhotosGallery: React.FunctionComponent<PhotosGalleryProps> = ({
  defaultThumb,
  maxCount,
  onChange,
  photos,
  selectedCountLabel = 'of',
  showMaxLabel = true,
  ofCount,
  onUpdate,
  subtitle,
  title
}) => {
  const [ photosSelection, updatePhotosSelection ] = React.useState<PhotosSelection>({})
  const selectedIds = React.useMemo(() => Object.keys(photosSelection).map(id => Number(id)).filter(id => photosSelection[id]), [photosSelection])
  const selectedCount = selectedIds.length
  const limitReached = selectedCount === maxCount
  const limitExceeded = selectedCount > maxCount
  const allPhotosCount = photos.length
  const ofCountValue = ofCount ? ofCount : allPhotosCount

  const handleSelectPhoto = (id: OrderPhoto['id']) => {
    const updatedValue = (limitReached || limitExceeded) ? false : !photosSelection[id]
    const photosSelectionCopy = {
      ...photosSelection,
      [id]: updatedValue
    }
    updatePhotosSelection(photosSelectionCopy)
  }

  React.useEffect(() => {
    onChange(selectedIds)
  }, [photosSelection])

  const excessPhotosCount = selectedCount - maxCount
  const limitWarning = `Maximum photos limit reached. More photos can't be selected.`
  const limitError = `
    Too many photos selected for a given flyer layout.
    Please unselect ${excessPhotosCount} ${excessPhotosCount === 1 ? 'photo' : 'photos'}.
  `

  return (
    <PanelStyled
      heading={title}
      headingPlacedComponent={(
        <div>
          <PhotosQuantity>{selectedCount} </PhotosQuantity>
          {selectedCountLabel} {ofCountValue} {showMaxLabel && `(${maxCount} maximum)`}
        </div>
      )}
    >
      <SelectionWarning error={limitExceeded}>
        {limitReached && limitWarning}
        {limitExceeded && limitError}
      </SelectionWarning>
      {subtitle && <Subtitle>
        {subtitle}
      </Subtitle>
      }
      <GalleryContainer>
        {
          photos.map((photo, index) =>
            <SortablePhoto
              key={photo.id}
              index={index}
              photo={photo}
              checked={photosSelection[photo.id]}
              star={defaultThumb === photo.id}
              onSelectPhoto={handleSelectPhoto}
              onUpdate={onUpdate}
            />
          )
        }
      </GalleryContainer>
    </PanelStyled>
  )
}

export default SortableContainer(PhotosGallery)
