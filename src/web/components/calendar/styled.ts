import { StyledMainWrapper } from '#veewme/web/common/styled'
import styled, { createGlobalStyle } from '#veewme/web/common/styled-components'

export const ToolbarTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 1px solid ${props => props.theme.colors.BORDER};

  > :last-child {
    align-self: flex-start;
  }
`

export const Wrapper = styled(StyledMainWrapper)`
  padding-top: 20px;
`

export const ToolbarBottom = styled.div`
  display: inline-flex;
  flex: 0 0 500px;
  align-items: flex-end;
  position: relative;
  z-index: 100;

  > div:first-child {
    margin-right: 15px;
  }

  button {
    margin: 0 0 15px 15px;
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    margin-bottom: -50px;
  }
`

export const GlobalFullScreenStyle = createGlobalStyle`
  #app {
    overflow-y: auto;

    header {
      display: none;
    }

    > section:first-of-type {
      display: none;
    }

    > section:last-child {
      margin :0;

      > div > div:first-child {
        display: none;
      }
    }

    ${Wrapper} {
      margin: 0 -15px;
    }
  }
`

export const FullScreenBtn = styled.div`
  cursor: pointer;
  align-self: flex-start;
`

export const SettingsBtn = styled.span`
  margin-right: 10px;
  cursor: pointer;
`

export const CalendarHeader = styled.header`
  width: 100%;
  margin: 0 10px 20px 10px;
  color: ${props => props.theme.colors.HEADER};
  font-weight: 500;
  font-size: 18px;

`

export const PrefrredShootTime = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 16px;
  color: ${props => props.theme.colors.ORANGE};

  span {
    margin-left: 7px;
    text-transform: capitalize;
  }

  strong {
    margin-left: 5px;
    font-weight: 500;
  }

  svg {
    width: 10px;
    height: 20px;
    fill: ${props => props.theme.colors.ORANGE};
  }
`
