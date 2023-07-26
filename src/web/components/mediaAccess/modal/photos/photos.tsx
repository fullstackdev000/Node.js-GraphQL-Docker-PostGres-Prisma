import {
  MediaAccessPhotosQuery,
  MediaAccessPhotosQueryVariables
} from '#veewme/gen/graphqlTypes'
import { MediaAccessPhotosQuery as PhotosQuery } from '#veewme/lib/graphql/queries/media'

import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'
import { NoNullableArrayItems } from '#veewme/web/common/util'
import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { MediaAccessOrder, PhotoBasic } from '../../types'
import EmailPopup from '../emailPopup'
import { Spinner, ZipLink } from '../styled'
import TabContainer from '../tabContainer'
import Toolbar from '../toolbar'
import PhotoItem from './photoItem'

import { useToasts } from 'react-toast-notifications'
import { Download as DownloadIcon } from 'styled-icons/boxicons-regular'

const PhotosWrapper = styled.div<{
  preventDownloadPhotos?: boolean
}>`
  margin: 0 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 25px;
  grid-row-gap: 25px;
  padding: 0 15px 0 0;

  ${props => props.preventDownloadPhotos && `
    position: relative;
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.6);

    }
  `}

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
    grid-template-columns: repeat(5, 1fr);
  }
`

const ModalHeaderHeight = 245

interface PhotosSelection {
  [photoId: number]: boolean
}

interface PhotosListProps {
  photos: PhotoBasic[]
  preventDownloadPhotos?: boolean
}

export const PhotosList: React.FunctionComponent<PhotosListProps> = props => {
  const [ photosSelection, updatePhotosSelection ] = React.useState<PhotosSelection>({})
  const selectedIds = React.useMemo(() => Object.keys(photosSelection).map(id => Number(id)).filter(id => photosSelection[id]), [photosSelection])
  const allSelected = React.useMemo(() => selectedIds.length === props.photos.length, [selectedIds, props.photos])
  const allDeselected = React.useMemo(() => !selectedIds.length, [selectedIds])
  const [ emailPopupVisible, setEmailPopupVisibility ] = React.useState(false)

  const { addToast } = useToasts()

  const selectPhoto = (id: PhotoBasic['id']) => {
    const photosSelectionCopy = {
      ...photosSelection,
      [id]: !photosSelection[id]
    }
    updatePhotosSelection(photosSelectionCopy)
  }

  const toggleAll = (selected: boolean) => {
    const selectionData: PhotosSelection = {}
    props.photos.forEach(p => {
      selectionData[p.id] = selected
    })
    updatePhotosSelection(selectionData)
  }

  React.useEffect(() => {
    log.debug('Selected photos', selectedIds)
  }, [selectedIds])

  const genericDownloadItems = [{
    label: 'Web Photos',
    linkTo: '#'
  }, {
    label: 'Print Photos',
    linkTo: '#'
  }, {
    disabled: allDeselected,
    label: 'Selected Web Photos',
    onClick: () => log.debug('Selected web photos', selectedIds)
  }, {
    disabled: allDeselected,
    label: 'Selected Print Photos',
    onClick: () => log.debug('Selected print photos', selectedIds)
  }]
  // TODO this options will be query from server
  const customDownloadItems = [{
    label: 'Instagram Square',
    onClick: () => log.debug('Instagram Square click')
  }, {
    label: 'Instagram Vertical',
    onClick: () => log.debug('Instagram Vertical click')
  }]

  const actionOptions = [{
    items: genericDownloadItems
  }, {
    items: customDownloadItems
  }]

  const downloadText = (
    <>
      Click on <DownloadIcon size='25' /> for individual photos or select multiple photos, then choose "Select Download Type"
    </>
  )

  return (
    <>
      {
        <EmailPopup
          setVisibility={setEmailPopupVisibility}
          visible={emailPopupVisible}
          onSubmit={vals => {
            log.debug(vals, selectedIds)
            addToast('Selected photos have been sent.', { appearance: 'success', autoDismiss: true })
          }}
        />
      }
      {
        !props.preventDownloadPhotos && (
          <Toolbar
            toggleAll={toggleAll}
            selectedPhotosIds={selectedIds}
            allSelected={allSelected}
            allDeselected={allDeselected}
            showEmailPopup={() => setEmailPopupVisibility(true)}
            dropdownOptions={actionOptions}
            downloadText={downloadText}
            emailTooltipText='Email selected (web) photos'
            emailBtnDisabled={allDeselected}
          />
        )
      }
      <Scrollbars
        autoHeight={true}
        autoHeightMax={`calc(85vh - ${ModalHeaderHeight}px)`}
        autoHide={false}
        autoHeightMin='250px'
      >
        <PhotosWrapper preventDownloadPhotos={props.preventDownloadPhotos}>
          {props.photos.map(photo => (
              <PhotoItem
                photo={photo}
                key={photo.id}
                checked={photosSelection[photo.id]}
                onSelect={selectPhoto}
              />
            )
          )}
        </PhotosWrapper>
      </Scrollbars>
    </>
  )
}

interface PhotosContainerProps {
  realEstateId: MediaAccessOrder['realEstate']['id']
  preventDownloadPhotos?: boolean
}

interface PhotosData {
  photos: NoNullableArrayItems<MediaAccessPhotosQuery['photos']>
}

const PhotosContainer: React.FunctionComponent<PhotosContainerProps> = props => {
  log.debug('estate id', props.realEstateId)
  const { data, loading } = useQuery<PhotosData, MediaAccessPhotosQueryVariables>(PhotosQuery, {
    variables: {
      realEstateId: props.realEstateId
    }
  })

  return (
    <TabContainer>
      <>
        <ZipLink>
          <a href='#'>Zip File Help</a>
        </ZipLink>
        {data && !!data.photos.length && <PhotosList photos={data.photos} preventDownloadPhotos={props.preventDownloadPhotos} />}
        <Spinner isProcessComplete={!loading} />
      </>
    </TabContainer>
  )
}
export default PhotosContainer
