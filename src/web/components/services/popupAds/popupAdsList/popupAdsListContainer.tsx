import { PopupAd } from '#veewme/lib/types'
import ListFooter from '#veewme/web/common/footer/listFooter'
import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import PopupAdsListItem, { PopupAdAction } from './popupAdsListItem'

// TODO remove after fetching data from server
const mockPopupAdsData: PopupAd[] = [
  {
    actionButtonNote: '* Click OK to return to Services and Add to order.',
    description: `Don't forget to order Drone Photography! \nSet yourself apart from the competition with stunning Aerial Photography.`,
    footNote: 'Thank you for your order!',
    headline: 'Would you like French Fries with this order?',
    id: 'pa1',
    imageUrl: '/public/static/img/house1.png',
    region: 'Midwest'
  },
  {
    actionButtonNote: '* Click OK to return to Services and Add to order.',
    description: `Don't forget to order Panorama! \nSet yourself apart from the competition with stunning panoramic Photography.`,
    footNote: 'Thank you for your order!',
    headline: 'Would you like Salad with this order?',
    id: 'pa2',
    imageUrl: '/public/static/img/house2.png'
  }
]

const StyledListWrapper = styled.div `
  flex: 1;
`

const StyledList = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  list-style: none;
  padding: 8px 0;
  & > div {
    margin: 8px;
  }
`

interface PopupAdsListContainerState {
  selectedPopupAdId?: PopupAd['id']
}
class PopupAdsListContainer extends React.PureComponent<{}, PopupAdsListContainerState> {
  state: PopupAdsListContainerState = {
  }

  handlePageChange = (page: number) => {
    log.debug('page changed', page)
  }

  handlePopupAdClick = (id: PopupAd['id']) => {
    if (this.state.selectedPopupAdId !== id) {
      this.setState({
        selectedPopupAdId: id
      })
    }
  }

  handlePopupActionClick = (action: PopupAdAction, id: PopupAd['id']) => {
    log.debug('Click on', PopupAdAction[action], 'in popup ad', id)
  }

  render () {
    return (
      <>
        <StyledListWrapper>
          <StyledList>
            {mockPopupAdsData.map(ad => (
              <PopupAdsListItem
                key={ad.id}
                popupAd={ad}
                selected={this.state.selectedPopupAdId === ad.id}
                onSelect={this.handlePopupAdClick}
                onActionClick={this.handlePopupActionClick}
              />
            ))}
          </StyledList>
        </StyledListWrapper>
        <ListFooter
          totalRecords={100} // {data.length}
          pageLimit={30}
          maxButtons={7}
          onPageChange={this.handlePageChange}
        />
      </>
    )
  }
}

export default PopupAdsListContainer
