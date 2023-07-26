import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { PanoramaBasic } from '../../types'
import EmailPopup from '../emailPopup'
import { ModalHeaderHeight, ZipLink } from '../styled'
import TabContainer from '../tabContainer'
import Toolbar from '../toolbar'
import PanoramaItem from './panoramaItem'

import { useToasts } from 'react-toast-notifications'
import { Download as DownloadIcon } from 'styled-icons/boxicons-regular'

const PanoramasWrapper = styled.div`
  margin: 0 20px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 25px;
  padding: 0 15px 0 0;

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-template-columns: repeat(3, 1fr);
  }
`

interface PanoramasSelection {
  [panoramaId: number]: boolean
}

interface PanoramasListProps {
  panoramas: PanoramaBasic[]
}

const PanoramasList: React.FunctionComponent<PanoramasListProps> = props => {
  const [ panoramasSelection, updatePanoramasSelection ] = React.useState<PanoramasSelection>({})
  const selectedIds = React.useMemo(() => Object.keys(panoramasSelection).map(id => Number(id)).filter(id => panoramasSelection[id]), [panoramasSelection])
  const allSelected = React.useMemo(() => selectedIds.length === props.panoramas.length, [selectedIds, props.panoramas])
  const allDeselected = React.useMemo(() => !selectedIds.length, [selectedIds])
  const [ emailPopupVisible, setEmailPopupVisibility ] = React.useState(false)

  const { addToast } = useToasts()

  const selectPanorama = (id: PanoramaBasic['id']) => {
    const panoramasSelectionCopy = {
      ...panoramasSelection,
      [id]: !panoramasSelection[id]
    }
    updatePanoramasSelection(panoramasSelectionCopy)
  }

  const toggleAll = (selected: boolean) => {
    const selectionData: PanoramasSelection = {}
    props.panoramas.forEach(p => {
      selectionData[p.id] = selected
    })
    updatePanoramasSelection(selectionData)
  }

  React.useEffect(() => {
    log.debug(selectedIds)
  }, [selectedIds])

  const genericDownloadItems = [{
    label: 'Web Panoramas',
    linkTo: '#'
  }, {
    disabled: allDeselected,
    label: 'Selected Web Panoramas',
    onClick: () => log.debug('Selected web panoramas', selectedIds)
  }]

  const actionOptions = [{
    items: genericDownloadItems
  }]

  React.useEffect(() => {
    log.debug(selectedIds)
  }, [panoramasSelection])

  const downloadText = (
    <>
      Click on <DownloadIcon size='25' /> for individual panoramas or select multiple panoramas, then choose "Select Download Type"
    </>
  )

  return (
    <>
      {
        <EmailPopup
          setVisibility={setEmailPopupVisibility}
          visible={emailPopupVisible}
          contentType='panorama'
          onSubmit={vals => {
            log.debug(vals, selectedIds)
            addToast('Panoramas has been sent.', { appearance: 'success', autoDismiss: true })
          }}
        />
      }
      <Toolbar
        toggleAll={toggleAll}
        selectedPhotosIds={selectedIds}
        allSelected={allSelected}
        allDeselected={allDeselected}
        showEmailPopup={() => setEmailPopupVisibility(true)}
        dropdownOptions={actionOptions}
        downloadText={downloadText}
        emailTooltipText='Email selected (web) panoramas'
        emailBtnDisabled={allDeselected}
      />
      <Scrollbars
        autoHeight={true}
        autoHeightMax={`calc(85vh - ${ModalHeaderHeight}px)`}
        autoHide={false}
        autoHeightMin='250px'
      >
        <PanoramasWrapper>
          {props.panoramas.map(panorama => (
              <PanoramaItem
                panorama={panorama}
                key={panorama.id}
                checked={panoramasSelection[panorama.id]}
                onSelect={selectPanorama}
              />
            )
          )}
        </PanoramasWrapper>
      </Scrollbars>
    </>
  )
}

interface PanoramasContainerProps {
  panoramas: PanoramaBasic[]
}

const PanoramasContainer: React.FunctionComponent<PanoramasContainerProps> = props => {
  return (
    <TabContainer>
      <>
        <ZipLink>
          <a href='#'>Zip File Help</a>
        </ZipLink>
        <PanoramasList panoramas={props.panoramas} />
      </>
    </TabContainer>
  )
}
export default PanoramasContainer
