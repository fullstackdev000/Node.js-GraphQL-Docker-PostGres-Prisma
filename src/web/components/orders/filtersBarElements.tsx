import styled from '../../common/styled-components'

export const StyledFiltersWrapper = styled.div `
  padding: 8px 0;
  width: 100%;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    margin-top: 10px;
  }
`
