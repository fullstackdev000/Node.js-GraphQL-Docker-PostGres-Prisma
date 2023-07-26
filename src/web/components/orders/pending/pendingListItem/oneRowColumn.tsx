import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { PendingOrderQueryData } from '../../types'

const StyledGrid = styled.div `
  grid-area: one;
  flex: 1;
  display: grid;
  grid-template-columns: 100px 80px 5fr 3fr;
  grid-template-rows: auto;
  grid-template-areas: "date id address agent";
  padding: 8px 0px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    padding: 8px 0px;
  }
`

const StyledLine = styled.div<{ gridArea: string }> `
  grid-area: ${props => props.gridArea};
  padding: 0 8px;
  color: ${props => props.theme.colors.FIELD_TEXT};
  & + div {
    border-left: 1px dashed ${props => props.theme.colors.INFO_BORDER};
  }
`

interface OneRowColumnProps {
  order: PendingOrderQueryData
}

const OneRowColumn: React.FunctionComponent<OneRowColumnProps> = props => {
  const { date, realEstate: { address, agentPrimary: { user } } } = props.order
  return (
    <StyledGrid>
      <StyledLine gridArea='date'>
        <p>{date}</p>
      </StyledLine>
      <StyledLine gridArea='id'>
        <p>{props.order.id}</p>
      </StyledLine>
      <StyledLine gridArea='address'>
        <p>{address}</p>
      </StyledLine>
      <StyledLine gridArea='agent'>
        <p>{user.firstName} {user.lastName}</p>
      </StyledLine>
    </StyledGrid>
  )
}

export default OneRowColumn
