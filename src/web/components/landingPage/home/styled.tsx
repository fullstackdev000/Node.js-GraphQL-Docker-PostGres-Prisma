import styled, { css } from '#veewme/web/common/styled-components'
import dimensions from '../../layout/publicPage/dimensionsConstants'

export const HomeWrapper = styled.div`
  section {
    &:not(:first-child) {
      border-top: 1px solid ${props => props.theme.colors.BORDER};
    }
    &:nth-child(even) {
      background-color: ${props => props.theme.colors.EXTRA_LIGHT_GREY};
    }
    color: ${props => props.theme.colors.BLOCK_OF_TEXT};
    p {
      line-height: 25px;
      font-size: 16px;
      margin: 20px 0;
    }
    img {
      border-radius: 6px;
      box-shadow: 0 3px 9px rgba(0,0,0,0.39);
    }
  }
`

export const scrollAnimation = css<{ showImage?: boolean }>`
  ${props => {
    if (props.showImage) {
      return `
        transform: translateY(0) scale(1);
        opacity: 1;
        transition: transform 0.5s cubic-bezier(0.6, 0.2, 0.1, 1) 0s, opacity 0.5s cubic-bezier(0.6, 0.2, 0.1, 1) 0s;
      `
    } else if (props.showImage !== undefined) {
      return `
        transform: translateY(20px) scale(0.9);
        opacity: 0;
      `
    } else {
      return ''
    }
  }}
`

export const Section = styled.section<{ showImage?: boolean }>`
  padding: 120px ${dimensions.pageMargin};
  text-align: center;
  position: relative;
  p {
    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
      text-align: center;
    }
  }
  img {
    ${scrollAnimation}
  }
`

export const SubSection = styled.div`
  position: relative;
  margin: 30px auto;
  img {
    ${scrollAnimation}
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    display: grid;
    grid-template-columns: 48% 48%;
    grid-template-rows: 70px auto auto;
    grid-column-gap: 4%;
    margin: 60px auto;
    p, h1, h2, h3, h4 {
      text-align: left;
    }
  }
`

const headersMargin = css`
  margin-top: 20px;
  margin-bottom: 10px;
`

export const H1 = styled.h1`
  font-size: 42px;
  font-weight: 300;
  color: ${props => props.theme.colors.DARK_GREY};
  text-align: center;
  padding: 5px 0px;
  ${headersMargin};
`

export const H2 = styled.h2`
  font-size: 30px;
  font-family: inherit;
  font-weight: 400;
  line-height: 35px;
  text-align: center;
  ${headersMargin};
`

export const H3 = styled.h3`
  font-size: 24px;
  color: ${props => props.theme.colors.GREEN};
  text-align: center;
  max-width: 770px;
  margin: auto;
  line-height: 1.3em;
  margin-bottom: 60px;
  text-transform: none;
  font-weight: 300;
  letter-spacing: 1px;
  padding-bottom: 15px;
  ${headersMargin};
`

export const H4 = styled.h4`
  margin: 20px auto;
  font-size: 22px;
  line-height: 25px;
  font-weight: 500;
`

export const H5 = styled.h5`
  color: ${props => props.theme.colors.GREEN};
  font-size: 15px;
  font-weight: 600;
  margin: 20px 0px;
  text-align: left;
`

export const H6 = styled.h6`
  font-weight: 300;
  font-size: 13px;
  color: ${props => props.theme.colors.BLOCK_OF_TEXT};
  text-align: left;
`

export const ImagesGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  img {
    margin: 20px;
    width: 300px;
    max-width: fit-content;
  }
`
