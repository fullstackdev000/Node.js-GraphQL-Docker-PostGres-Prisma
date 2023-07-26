import styled from '#veewme/web/common/styled-components'
import { NavLink } from 'react-router-dom'

export const StyledHelpWrapper = styled.div `
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 5px;
`

export const StyledRedSpanHeader = styled.header `
  width: 100%;
  & span {
    color: ${props => props.theme.colors.ALERT};
  }
`

export const StyledBold = styled.span `
    font-weight: 700;
`

export const StyledGreenBold = styled(StyledBold) `
    color: ${props => props.theme.colors.GREEN};
`

export const StyledFooter = styled.footer<{
  alignRight?: boolean
}> `
  width: 100%;
  display: flex;
  justify-content: ${props => props.alignRight ? 'flex-end' : 'space-between'};
  align-items: center;
  border-top: 3px solid ${props => props.theme.colors.BORDER};
  padding: 20px;
  font-weight: 600;
  font-size: 14px;
`

export const StyledFooterText = styled.p `
  margin-right: 15px;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

export const StyledFooterSpan = styled.span `
  color: black;
`

export const PaymentSubmitButtons = styled.div `
  button {
    margin-left: 10px;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    max-width: 70%;

    button {
      margin-top: 10px;
    }
  }
`

export const ValidationAlert = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  padding: 15px;
  border-radius: 5px;
  background: ${props => props.theme.colors.ALERT};
  color: #fff;
  font-size: 18px;
  font-style: italic;
  font-weight: 500;

  &&& {
    margin-bottom: 0;
  }

  svg {
    margin-top: -5px;
    margin-left: 40px;
    rotate: -25deg;
    fill: transparent;
    stroke: #fff;
    stroke-width: 40px;
    scale: 1.3;
  }
`
