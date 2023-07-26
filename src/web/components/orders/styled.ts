import styled from '#veewme/web/common/styled-components'
import { BREAKPOINT_LG, BREAKPOINT_XL } from '../../common/mediaBreakpoints'
import { StyledH4, StyledMainSectionHeader } from '../../common/styled'

export const StyledMainWrapper = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  @media (max-width: ${BREAKPOINT_XL}) {
    padding: 0 20px;
  }
  @media (max-width: ${BREAKPOINT_LG}) {
    padding: 0 10px;
  }
`

export const StyledList = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  list-style: none;
`

export { StyledH4, StyledMainSectionHeader }
