import HideForRole from '#veewme/web/common/hideForRole'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { themeColors } from '../../../common/colors'
import ListHeaderItem from '../../../common/listHeaderItem'
import { BREAKPOINT_LG, BREAKPOINT_XL } from '../../../common/mediaBreakpoints'

const StyledHeader = styled.div `
  display: grid;
  grid-template-columns: 260px minmax(195px, 1fr) 2fr 2fr;
  grid-template-rows: auto;
  grid-template-areas: "image property agent logistics";
  width: 100%;
  margin-top: 16px;
  color: ${themeColors.LABEL_TEXT};
  @media (max-width: ${BREAKPOINT_XL}) {
    grid-template-columns: 0px  minmax(355px, 1fr) 2fr 3fr;
  }
  @media (max-width: ${BREAKPOINT_LG}) {
    grid-template-columns: 0px 180px 1fr 2fr;
    margin-top: 8px;
  }
`

const StyledGroup = styled.div<{ gridArea: string }> `
  grid-area: ${props => props.gridArea};
  padding: 0 4px;
`

const ListHeader: React.FunctionComponent<{}> = () => {
  return (
    <StyledHeader>
      <StyledGroup gridArea='property'>
        <ListHeaderItem label='Property'/>
      </StyledGroup>
      <HideForRole roles={['AGENT']}>
        <StyledGroup gridArea='agent'>
          <ListHeaderItem label='Agent'/>
        </StyledGroup>
      </HideForRole>
      <StyledGroup gridArea='logistics'>
        <ListHeaderItem label='Logistics'/>
      </StyledGroup>
    </StyledHeader>
  )
}

export default ListHeader
