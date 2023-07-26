import Modal from '#veewme/web/common/modal'
import styled from '#veewme/web/common/styled-components'
import TabsBar from '#veewme/web/common/tabsBar'
import * as React from 'react'
import { MemoryRouter, Route } from 'react-router'
import { MediaAccessOrder } from '../types'
import Documents from './documents'
import Flyers from './flyer'
import Interactives from './interactive'
import Panoramas from './panoramas'
import Photos from './photos'
import Videos from './videos'

const ModalContent = styled.div`
  position: relative;
  min-height: 485px;

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    width: 760px;
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    width: 980px;
  }
`

const Tabs = styled(TabsBar)`
  margin: -20px 0 20px 0;

  div {
    min-width: unset;

    @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
      margin: 0 8px;
    }
  }

  a {
    text-transform: capitalize;

    h4 {
      @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
        font-size: 17px;
      }
    }
  }
`

export type TabsDataDisabled = { [tab in TabItems]?: boolean }

export enum TabItems {
  Photos = 'photos',
  Videos = 'videos',
  Interactive = 'interactive',
  Panoramas = 'panoramas',
  Documents = 'documents',
  Flyer = 'flyer'
}

// casting because Object.values doesn't preserve type for string enums
// https://github.com/Microsoft/TypeScript/pull/12253
export const tabEntries = Object.values(TabItems) as TabItems[]
const tabs = tabEntries.map(entry => ({
  label: entry,
  to: entry
}))

interface MediaModalProps {
  isOpen: boolean
  close: () => void
  title: string
  currentTab: TabItems
  realEstateId: MediaAccessOrder['realEstate']['id']
  visibleTabs: TabsDataDisabled
  preventDownloadPhotos?: boolean

}

const MediaModal: React.FunctionComponent<MediaModalProps> = props => {
  const currentTabIndex = tabEntries.findIndex(entry => entry === props.currentTab)

  const filteredTabs = tabs.filter(tab => !props.visibleTabs[tab.label])
  return (
    <Modal isOpen={props.isOpen} onRequestClose={props.close} title={props.title}>
      <MemoryRouter
        initialEntries={tabEntries}
        initialIndex={currentTabIndex}
      >
        <ModalContent>
          <Tabs
            tabs={filteredTabs}
          />
          {/* Local memory routing is used here so no need to move these  urls to 'lib/urls' */}
          <Route exact path={TabItems.Photos} render={() => <Photos realEstateId={props.realEstateId} preventDownloadPhotos={props.preventDownloadPhotos}/>} />
          <Route path={TabItems.Videos} render={() => <Videos realEstateId={props.realEstateId} />} />
          <Route path={TabItems.Interactive} render={() => <Interactives realEstateId={props.realEstateId} />} />
          <Route path={TabItems.Panoramas} render={() => <Panoramas realEstateId={props.realEstateId} />} />
          <Route path={TabItems.Documents} render={() => <Documents realEstateId={props.realEstateId} />} />
          <Route path={TabItems.Flyer} component={Flyers} />
        </ModalContent>
      </MemoryRouter>
    </Modal>
  )
}

export default MediaModal
