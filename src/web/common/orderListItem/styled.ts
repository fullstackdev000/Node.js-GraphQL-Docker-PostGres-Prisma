import { getOrderLegendStatus, LegendLabel } from '#veewme/web/common/status'
import { itemShadowHover } from '#veewme/web/common/styled'
import styled from '#veewme/web/common/styled-components'
import { UserCog, UserLock } from 'styled-icons/fa-solid'
import { ITEM_CELL_HEIGHT } from './common'

export const StyledUserLock = styled(UserLock) `
  color: ${props => props.theme.colors.BORDER};
  &:hover {
    color: ${props => props.theme.colors.GREEN};
  }
`

export const StyledUserCog = styled(UserCog) `
  color: ${props => props.theme.colors.BORDER};
  &:hover {
    color: ${props => props.theme.colors.GREEN};
  }
`

export const StyledListItem = styled.li<{ status?: LegendLabel }> `
  border-radius: 7px;
  background-color: white;
  border-right: 5px solid ${props => props.status ? getOrderLegendStatus(props.status).color : props.theme.colors.BORDER};
  margin: 10px 0;

  ${itemShadowHover}
`

export const StyledOrderItemText = styled.div `
  font-weight: 500;
  max-width: 100%;
  font-size: 13px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    font-size: 11px;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    font-size: 10px;
  }
`

export const StyledAddressCell = styled.div `
  grid-area: addr;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 8px;
  pading-bottom: 8px;
  justify-content: space-between;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    padding-left: 4px;
  }
`

export const StyledAddressMarker = styled.a`
  flex: 0 0 30px;
`

export const StyledAddressTitle = styled.h3 `
  display: inline-block;
  font-weight: 600;
  flex: 0 1 auto;
  overflow: hidden;
  white-space: nowrap;
  margin-right: 10px;
  color: ${props => props.theme.colors.FIELD_TEXT};
  text-overflow: ellipsis;
  font-size: 15px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    font-size: 13px;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    font-size: 12px;
  }
`

export const StyledCell = styled.div `
  max-height: 100%;
  overflow: hidden;
`

export const StyledCellEditIconContainer = styled.div `
  position: absolute;
  bottom: 6px;
  right: 10px;
`

export const StyledDataCell = styled(StyledCell) `
  position: relative;
  grid-area: data;
  padding: 0 8px;
`

export const StyledChartCell = styled(StyledCell) `
  position: relative;
  grid-area: chart;
  & div {
    height: 100% !important;
  }
`

export const StyledContactCell = styled(StyledCell) `
  position: relative;
  grid-area: contact;
  border-left: 1px dashed ${props => props.theme.colors.INFO_BORDER};
  padding-left: 8px;
  padding-right: 18px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    padding-bottom: 0;
  }
`

export const StyledAgentWrapper = styled.div `
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  max-width: 100%;
  max-height: 24px;
`

export const StyledIconWrapper = styled.div `
  flex: 0 0 26px;
  margin-left: 3px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:first-child {
    margin-left: 0;
  }
`

export const StyledServicesCell = styled(StyledCell) `
  grid-area: logistics;
  display: flex;
  margin-right: 8px;
  padding-left: 8px;
  border-left: 1px dashed ${props => props.theme.colors.INFO_BORDER};
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_SM}) {
    border: none;
  }
`

export const StyledServicesList = styled.ul `
  flex: 1;
  max-height: ${ITEM_CELL_HEIGHT};
  padding-right: 20px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    padding-left: 8px;
    max-height: 80px;
  }
`

export const StyledActionBar = styled.div `
  grid-area: action;
  border-top: 1px solid ${props => props.theme.colors.BORDER};
  background-color: ${props => props.theme.colors.ACTIONBAR_BACKGROUND};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding: 0 8px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    padding: 4px 8px;
  }
`

export const StyledActionBarButtonsContainer = styled.div `
  display: flex;
  flex-wrap: wrap;
  /* justify-content: space-between; */
  align-items: center;
  & > * {
    margin-left: 0;
    margin-right: 10px;
  }
  & > :last-child {
    margin-right: 0;
  }
`

export const StyledLineDoubleCell = styled.div`
  display: flex;
  justify-content: space-between;

  ${StyledOrderItemText}:first-child {
    margin-right: 5px;
  }

`

export const StyledTooltipContent = styled.div`
  text-align: center;
`
