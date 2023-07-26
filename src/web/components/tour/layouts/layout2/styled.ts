import styled, { css } from '#veewme/web/common/styled-components'

export const containerHorizontalMargin = '10vw'
// export const bannerLeftIndentation = `calc(${containerHorizontalMargin} + 100px)`
export const bannerLeftIndentation = `180px`
export const logoWidth = bannerLeftIndentation

export const Container = styled.div`
  margin: 0 ${containerHorizontalMargin};

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
    margin: 0 auto;
    width: 1480px;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    margin: 0 25px;
  }
`

export const Line = css<{
  mainColor: string
}>`
  content: '';
  flex: 1 0 auto;
  padding: 0 10px;
  height: 2px;
  background: ${props => props.mainColor};
  z-index: 0;
`

export const SectionTitle = styled.h3<{
  mainColor: string
}>`
  display: flex;
  align-items: center;
  margin: 25px 0;
  font-family: 'American Typewriter', sans-serif;
  font-size: 30px;
  font-weight: 700;

  &:after {
    margin-left: 20px;
    ${Line}
  }
`
