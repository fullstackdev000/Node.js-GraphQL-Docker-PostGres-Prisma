import * as React from 'react'
import { useHistory } from 'react-router-dom'
import Button from './buttons/basicButton'
import styled, { css } from './styled-components'

const wrapperPaddingOnTheSide = 60
const gridColumnGap = 60
const leftSidebarWidth = 230
const gridRowsGap = 30
const XXLcolumnCalc = leftSidebarWidth + gridColumnGap + wrapperPaddingOnTheSide
const XLcolumnRepeat = 6

export const Wrapper = styled.section<{noHeader?: boolean}>`
  box-sizing: border-box;
  padding: 0 ${wrapperPaddingOnTheSide}px 60px;
  width:100%;
  position: relative;
  display: grid;
  grid-row-gap: ${gridRowsGap}px;
  grid-auto-rows: ${props => props.noHeader ? '' : '80px'} min-content auto;
  & > * {
    & > div, & > aside, & > main { margin-bottom: 20px; }
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    padding-top: 15px;
    grid-template-columns: repeat(
      ${XLcolumnRepeat},
      calc((100% - ${gridColumnGap * (XLcolumnRepeat - 1)}px) / ${XLcolumnRepeat})
    );
    grid-column-gap: ${gridColumnGap}px;
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    grid-template-columns: ${leftSidebarWidth}px
    calc((100% - ${XXLcolumnCalc}px) / 3 * 2)
    calc((100% - ${XXLcolumnCalc}px) / 3);
    grid-auto-rows: ${props => props.noHeader ? '' : '80px'} auto min-content;
  }
  ${props => !props.noHeader && `
    &:before {
      content: '';
      display: block;
      width:calc(100% - ${wrapperPaddingOnTheSide * 2}px);
      height:0;
      border-bottom: 2px solid ${props.theme.colors.BORDER};
      position: absolute;
      top: 80px;
      left: ${wrapperPaddingOnTheSide}px;
      @media (min-width: ${props.theme.breakpoints.BREAKPOINT_XL}) {
        top: 95px;
      }
    }
  `}
`

export const PageContainer = styled.section`
  padding: 0 ${wrapperPaddingOnTheSide}px 60px;
  width: 100%;
  & > ${Wrapper} {
    padding: 0;
    &:before {
      width: 100%;
      left: 0;
    }
  }
`

export const ButtonContainer = styled.div``

export const Header = styled.header`
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 80px;
  order: 0;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-column: 1/-1;
    margin-bottom: 0;
  }
  h1 {
    color: ${props => props.theme.colors.HEADER};
    font-weight: 500;
    font-size: 18px;
    span {
      color: ${props => props.theme.colors.TEXT};
      font-size: 15px;
      margin-left: 10px;
    }
  }
  ${ButtonContainer} {
    margin-bottom: 0;
    & > * {
      margin-right: 0;
      margin-left: 15px;
    }
  }
`

export const BackButton: React.FunctionComponent = () => {
  const history = useHistory()

  return (
    <Button
      type='button'
      buttonTheme='primary'
      label='Back'
      onClick={() => history.goBack()}
    />
  )
}

interface HeadingProps {
  className?: string
  hideButtons?: boolean
}

export const Heading: React.FunctionComponent<HeadingProps> = props => {
  return (
    <Header className={props.className}>
      {props.children}
      {
        !props.hideButtons && (
          <ButtonContainer>
            <BackButton />
            <Button type='submit' full buttonTheme='action' label='Submit' />
          </ButtonContainer>
        )
      }
    </Header>
  )
}

export const FooterContainer = styled.footer`
  order: 4;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-column-start: 1;
    grid-column-end: span 4;
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    grid-column: 2;
  }
  & > button, & > a, & > * {margin: 0}
`

export const Footer: React.FunctionComponent<{className?: string}> = props => {
  return (
    <FooterContainer className={props.className}>
      <Button type='submit' full buttonTheme='action' label='Submit' />
      <BackButton />
      {props.children}
    </FooterContainer>
  )
}

const LeftAsideDesktopStyle = css `
  order: 1;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    display: block;
    grid-column: 1;
  }
`

export const LeftAside = styled.aside`
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-column: 1/-1;
  }
  ${LeftAsideDesktopStyle}
  // TODO delete all nav styling after breadcrumbs are being moved to common
  & > nav {
    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) and (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
      flex-direction:row;
      justify-content: center;
      border-right: 0;
      & > div:first-child > div:first-child > div:first-child {display: none;}
      & > div {
        display: flex;
        align-items: center;
        & > div:nth-child(2) {
          height: 4px;
          width: 30px;
          margin: 0 10px;
          border-top: 4px solid #9fcc3e;
          border-right: 0;
        }
      }
    }
  }
`

export const LeftDesktopAside = styled.aside`
  display: none;
  ${LeftAsideDesktopStyle}
`

export const MainColumn = styled.main<{centerColumn?: boolean}>`
  order: 2;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    display: block;
    grid-column-start: 1;
    grid-column-end: span 4;
    @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
      ${ props => props.centerColumn
        ? `&, & ~ ${FooterContainer} {
            grid-column-start: 2;
            grid-column-end: span 4;
          }
        `
        : null
      }
    }
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    grid-column: 2;
  }
`

export const MainColumnFullWidth = styled.main`
  order: 2;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-column: 1/-1;
    & ~ ${FooterContainer} {grid-column: 1/-1;}
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    grid-column: 2/-1;
    & ~ ${FooterContainer} {grid-column: 2/-1;}
  }
`

export const RightAside = styled.div`
  order: 3;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    display: block;
    grid-column-start: 5;
    grid-column-end: span 2;
    position: relative
    &:before {
      content: '';
      display: block;
      height: 100%;
      width: 0;
      position: absolute;
      border-left: 1px solid ${props => props.theme.colors.BORDER};
      left: -30px;
    }
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    grid-column: 3;
  }
`
