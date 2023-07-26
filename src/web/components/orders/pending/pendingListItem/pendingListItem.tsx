import { StyledListItem } from '#veewme/web/common/orderListItem/styled'
// TODO restore getting color from status after Order resolver is ready
// import { getOrderLegendStatus } from '#veewme/web/common/status'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { PendingOrderQueryData } from '../../types'
import ActionColumn from './actionColumn'
import MultiRowColumn from './multiRowColumn'
import OneRowColumn from './oneRowColumn'

const StyledGrid = styled.div `
  display: grid;
  grid-template-columns: 1fr 1fr 100px;
  grid-template-rows: auto;
  grid-template-areas: "one multi action";
  background-color: '#fff';
  font-size: 13px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    font-size: 10px;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-template-columns: 1fr 100px;
    grid-template-rows: auto auto;
    grid-template-areas: "one one" "multi action";
    font-size: 10px;
  }
`

interface PendingListItemProps {
  order: PendingOrderQueryData
}

const PendingListItem: React.FunctionComponent<PendingListItemProps> = props => {
  return (
    // TODO restore getting color from status after Order resolver is ready
    <StyledListItem /*color={getOrderLegendStatus(props.order.status).color}*/>
      <StyledGrid>
        <OneRowColumn order={props.order}/>
        <MultiRowColumn services={props.order.services}/>
        <ActionColumn/>
      </StyledGrid>
    </StyledListItem>
  )
}

export default PendingListItem
