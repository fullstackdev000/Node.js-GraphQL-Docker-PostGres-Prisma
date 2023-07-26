import styled from '#veewme/web/common/styled-components'

export const StyledGrid = styled.div `
  display: grid;
  grid-template-columns: 80px minmax(200px, 1fr) 100px minmax(300px, 2fr) 90px 100px 100px 60px;
  grid-template-rows: auto;
  grid-template-areas: "code service validity description discount expiration used action";
  // TODO responsive when cells layout defined
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-template-columns: 80px minmax(200px, 1fr) 50px 50px 50px 40px 60px
    grid-template-rows: auto auto;
    grid-template-areas: "code service validity validity discount discount action" "description description expiration expiration used used action";
    font-size: 10px;
  }
`
