import { Role } from '#veewme/graphql/types'
import Button from '#veewme/web/common/buttons/basicButton'
// import * as log from '#veewme/web/common/log'
import { getOrderLegendStatus, LegendLabel } from '#veewme/web/common/status'
import styled from '#veewme/web/common/styled-components'
import Tooltipped from '#veewme/web/common/tooltipped'
import * as React from 'react'
import TourLinksModal, { ListItem } from './linksModal'
import MediaModal, { tabEntries, TabItems, TabsDataDisabled } from './modal'
import { MediaAccessOrder } from './types'

import { Link, MailOutline as Mail } from 'styled-icons/material'

const itemHeight = '145px'
const rowBottomHeight = '60px'

export const StyledListItem = styled.li<{ status?: LegendLabel }> `
  display: flex;
  border-radius: 7px;
  background-color: white;
  border-right: 5px solid ${props => props.status ? getOrderLegendStatus(props.status).color : props.theme.colors.BORDER};
  margin: 20px 0;
  overflow: hidden;
  height: ${itemHeight};

  &:hover, &:active {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
`

const ImgHolder = styled.div`
  width: 220px;
  height: 100%;
  flex: 0 0 auto;
  background: ${props => props.theme.colors.ACTIONBAR_BACKGROUND};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    display: none;
  }
`

const ItemBody = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`

const ItemBodyTop = styled.div`
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: space-between;
  max-height: ${`calc(${itemHeight} - ${rowBottomHeight})`};

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    flex-wrap: wrap;
  }
`

export const StyledTitle = styled.h3`
  display: flex;
  flex: 1 0 0;
  margin-right: 10px;
  height: 100%;
  font-weight: 600;
  padding: 5px 15px;
  font-size: 15px;
  color: ${props => props.theme.colors.FIELD_TEXT};
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
    font-size: 13px;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    flex: 1 0 auto;
    font-size: 13px;
    width: 100%;
    max-width: none;
    height: auto;
    padding-top: 15px;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    font-size: 12px;
  }
`

const ItemBodyTopCell = styled.div`
  display: flex;
  flex: 0 0 auto;
  padding: 5px 15px;
  border-left: 1px dotted ${props => props.theme.colors.BORDER};
  align-items: center;
  height: 100%;
  font-size: 13px;
  font-weight: 500;

  a,
  button {
    margin-right: 7px;

    svg {
      width: 20px;
      max-width: 20px;
      height: 20px;
      max-height: 20px;
      fill: ${props => props.theme.colors.GREEN};
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    height: auto;
    font-size: 12px;
    border-left: 0 none;
    padding: 7px 15px;
  }
`

const IdCell = styled(ItemBodyTopCell)`
  width: 140px;
  min-width: 0;

  div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    max-width: 300px;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    display: none;
  }
`

const AgentCell = styled(ItemBodyTopCell)`
  width: 200px;
  flex: 1 0 auto;

  > div > div:first-child {
    margin-bottom: 5px;

    @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
      margin-bottom: 0;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    font-size: 13px;
  }
`

const ButtonsCell = styled(ItemBodyTopCell)`
  width: 295px;
  flex-grow: 0;
  flex-shrink: 0;
`

const CellLabel = styled.span`
  margin-right: 4px;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

const CellValue = styled.span`
  color: ${props => props.theme.colors.FIELD_TEXT};
  flex: 1 0 auto;
`

const ItemBodyBottom = styled.div`
  display: flex;
  height: ${rowBottomHeight};
  flex: 0 0 auto;
  padding: 0 15px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${props => props.theme.colors.BORDER};
  background: ${props => props.theme.colors.ACTIONBAR_BACKGROUND};

  button {
    margin-right: 10px;
    text-transform: capitalize;
  }
`

const mockedTourLinks: ListItem[] = [{
  label: 'Branded Link',
  url: 'http://www.example.com/branded'
}, {
  label: 'Unbranded Link',
  url: 'http://www.example.com/unbranded'
}, {
  label: 'MLS Link (Hidden Address)',
  url: 'http://www.example.com/msl'
}, {
  label: 'Public Preview Link',
  url: 'http://www.example.com/public'
}]

const mockedZips: ListItem[] = [{
  label: 'All web photos',
  status: 'InProgress',
  url: 'http://www.example.com/zips1'
}, {
  label: 'Custom web photos',
  status: 'Ready',
  url: 'http://www.example.com/zip2'
}, {
  label: 'Custom print photos',
  status: 'Ready',
  url: 'http://www.example.com/zip3'
}, {
  label: 'All print photos',
  status: 'InProgress',
  url: 'http://www.example.com/zip4'
}]

const tooltipDelay = 1500

interface MediaItemProps {
  order: MediaAccessOrder
  role?: Role
}

const MediaItem: React.FunctionComponent<MediaItemProps> = props => {
  const {
    order: {
      realEstate: {
        address,
        agentPrimary: agent,
        id: realEstateId,
        ...realEstateRest
      },
      ...order }
  } = props
  const [modalOpen, toggleModal] = React.useState(false)
  const [currentTab, setTab] = React.useState(TabItems.Photos)
  const showModal = (tabId: TabItems) => {
    setTab(tabId)
    toggleModal(true)
  }

  const [tourLinksModalOpen, toggleTourLinksModal] = React.useState(false)
  const [zipsModalOpen, toggleZipsModal] = React.useState(false)
  const thumbUrl = realEstateRest.photos.length ? realEstateRest.photos[0].thumbUrl : ''

  const body = encodeURIComponent('http://www.example.com')
  const subject = encodeURIComponent(`Media Link for Order ID ${order.id}`)
  const href = `mailto:?subject=${subject}&body=${body}`

  const tabsVisibility: TabsDataDisabled = {
    documents:  !realEstateRest.mediaDocuments.length,
    interactive: !realEstateRest.mediaInteractives.length,
    panoramas:  !realEstateRest.panoramas.length,
    photos: !realEstateRest.photos.length,
    videos: !realEstateRest.videos.length
  }

  const status = props.order.statusToDisplay || 'Unpublished'
  const tourPaid = props.order.statuses.some(s => s === 'Paid')
  const preventDownloadPhotos = props.role === 'AGENT' && !tourPaid

  return (
    <StyledListItem status={status}>
      <ImgHolder>
        {thumbUrl && <img src={thumbUrl} />}
      </ImgHolder>
      <ItemBody>
        <ItemBodyTop>
          <StyledTitle>{address}</StyledTitle>
          <IdCell>
            <div>
              <CellLabel>Order ID: </CellLabel>
              <CellValue>{order.id}</CellValue>
            </div>
          </IdCell>
          <AgentCell>
            <div>
              <div>
                <CellLabel>Agent: </CellLabel>
                <CellValue>{agent.user.firstName} {agent.user.lastName}</CellValue>
              </div>
              <div>
                <CellLabel>Broker: </CellLabel>
                <CellValue>{agent.brokerage ? agent.brokerage.companyName : '-'}</CellValue>
              </div>
            </div>
          </AgentCell>
          <ButtonsCell>
            <Tooltipped
              delayShow={tooltipDelay}
              tooltip='Email link to Media'
            >
              <div>
                <Button
                  size='medium'
                  label='Media Link'
                  icon={Mail}
                  href={href}
                />
              </div>
            </Tooltipped>
            <Tooltipped
              delayShow={tooltipDelay}
              tooltip='Access Tour links'
            >
              <div>
                <Button
                  size='medium'
                  label='Tours Links'
                  icon={Link}
                  onClick={() => toggleTourLinksModal(true)}
                />
              </div>
            </Tooltipped>
          </ButtonsCell>
        </ItemBodyTop>
        <ItemBodyBottom>
          <div>
            {
              tabEntries.map(entry => {
                const disabled = tabsVisibility[entry]
                return (
                  <Button
                    key={entry}
                    size='medium'
                    label={entry}
                    onClick={() => showModal(entry)}
                    disabled={disabled}
                  />
                )
              })
            }
          </div>
          <div>
            <Tooltipped
              delayShow={tooltipDelay}
              tooltip='Zips'
            >
              <div>
                <Button
                  size='medium'
                  label='Zips'
                  onClick={() => toggleZipsModal(true)}
                />
              </div>
            </Tooltipped>
          </div>
        </ItemBodyBottom>
      </ItemBody>
      <MediaModal
        isOpen={modalOpen}
        close={() => toggleModal(false)}
        title={address}
        currentTab={currentTab}
        realEstateId={realEstateId}
        visibleTabs={tabsVisibility}
        preventDownloadPhotos={preventDownloadPhotos}
      />
      <TourLinksModal
        title='Tours Links'
        isOpen={tourLinksModalOpen}
        close={() => toggleTourLinksModal(false)}
        items={mockedTourLinks}
      />
      <TourLinksModal
        title='Zips'
        items={mockedZips}
        isOpen={zipsModalOpen}
        close={() => toggleZipsModal(false)}
      />
    </StyledListItem>
  )
}

export default MediaItem
