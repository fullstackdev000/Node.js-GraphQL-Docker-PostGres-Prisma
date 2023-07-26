import { TourBanner } from '#veewme/lib/types'
import { privateUrls } from '#veewme/lib/urls'
import DropDownButton from '#veewme/web/common/buttons/dropDownButton'
import { rgbaToString } from '#veewme/web/common/formikFields/colorField'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { SortableElement, SortableHandle } from 'react-sortable-hoc'
import { Move } from 'styled-icons/boxicons-regular'
import { StyledGrid } from './styled'

const StyledItem = styled.div `
  border-radius: 7px;
  background-color: white;
  margin: 10px 0;
  font-weight: 600;
  font-size: 12px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    font-size: 10px;
  }
  &:hover, &:active {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
`

const StyledGridCell = styled.div<{area: string}> `
  grid-area: ${props => props.area};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 12px 8px;
  color: ${props => props.theme.colors.FIELD_TEXT};
  & + div {
    border-left: 1px dashed ${props => props.theme.colors.INFO_BORDER};
  }
`

const StyledBannerCell = styled(StyledGridCell) `
  align-items: stretch;
`

const StyledBanner = styled.div<{banner: TourBanner}> `
  flex-grow: 1;
  display: flex;
  align-items: center;
  border-radius: 5px;
  background-color: ${props => rgbaToString(props.banner.color)};
  padding: 8px 16px;
`

const StyledDropDownButton = styled(DropDownButton)`
  width: 100%;

  button {
    width: 100%;
    background-color: transparent;
    border: none;
  }
`

const StyledEllipsisText = styled.p<{banner: TourBanner}> `
  max-width: 100%;
  color: ${props => props.banner.blackText ? 'black' : 'white'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
`

const StyledMoveIcon = styled(Move)`
  padding: 8px;
  fill: ${props => props.theme.colors.BORDER};
  & :hover, :active {
    fill: ${props => props.theme.colors.GREEN};
  }
  cursor: pointer;
`

const SortHandler = SortableHandle(StyledMoveIcon)

interface TourBannerItemProps {
  banner: TourBanner
  onDelete: (id: TourBanner['id']) => void
}

const TourBannerItem: React.FunctionComponent<TourBannerItemProps> = props => (
  <StyledItem>
    <StyledGrid>
      <StyledGridCell area='drag'>
        <SortHandler size='28' title='Drag row into desired position' />
      </StyledGridCell>
      <StyledBannerCell area='banner'>
        <StyledBanner
          banner={props.banner}
        >
          <StyledEllipsisText banner={props.banner}>
            {props.banner.label}
          </StyledEllipsisText>
        </StyledBanner>
      </StyledBannerCell>
      <StyledGridCell area='action'>
        <StyledDropDownButton
          list={[{
            items: [{
              label: 'Edit',
              linkTo: `${privateUrls.tourBanners}/${props.banner.id}`
            }, {
              label: 'Delete',
              onClick: () => props.onDelete(props.banner.id)
            }]
          }]}
        />
      </StyledGridCell>
    </StyledGrid>
  </StyledItem>
)

const SortableTourBannerItem = SortableElement<TourBannerItemProps>(TourBannerItem)

export default SortableTourBannerItem
