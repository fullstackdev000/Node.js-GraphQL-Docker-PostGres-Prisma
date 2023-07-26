import styled from '#veewme/web/common/styled-components'

export const StyledGrid = styled.div `
  display: grid;
  grid-template-columns: 50px minmax(200px, 1fr) 60px;
  grid-template-rows: auto;
  grid-template-areas: "drag banner action";

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-template-columns: 50px minmax(200px, 1fr) 60px
    grid-template-rows: auto;
    grid-template-areas: "drag banner action";
    font-size: 10px;
  }
`
