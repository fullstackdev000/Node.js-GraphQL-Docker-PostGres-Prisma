import styled from '#veewme/web/common/styled-components'

export const Container = styled.div`
  margin: 0 10%;

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
    margin: 0 auto;
    width: 1480px;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    margin: 0 25px;
  }
`
