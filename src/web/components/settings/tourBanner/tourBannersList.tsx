import { TourBanner } from '#veewme/lib/types'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import SortableTourBannerItem from './tourBannerItem'

const StyledList = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  list-style: none;
`

interface TourBannersListProps {
  banners: TourBanner[]
  onDelete: (id: TourBanner['id']) => void
}

// TODO connect to services and display service label
const TourBannersList: React.FunctionComponent<TourBannersListProps> = props => (
  <StyledList>
    {props.banners.map((banner, index) => (
      <SortableTourBannerItem
        key={banner.id}
        index={index}
        banner={banner}
        onDelete={props.onDelete}
      />
    ))}
  </StyledList>
)

const SortableTourBannersList = SortableContainer(TourBannersList)

export default SortableTourBannersList
