import CheckMarkSvg from '#veewme/web/assets/svg/checkmark.svg'
import * as React from 'react'
import { StyledH4 } from '../styled'
import styled from '../styled-components'

const StyledCircle = styled.div<{ active: boolean, completed: boolean }> `
  flex: 0 0 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background-color: ${props => {
    if (props.completed) {
      return props.theme.colors.BUTTON_BORDER_HOVER
    } else if (props.active) {
      return 'white'
    } else {
      return 'transparent'
    }
  }};
  border-radius: 50%;
  border: 3px solid ${props => props.active || props.completed
    ? props.theme.colors.BUTTON_BORDER_HOVER
    : props.theme.colors.BUTTON_BORDER
  };
  margin-right: 10px;
`

const StyledCheckMarkSvg = styled(CheckMarkSvg) `
  width: 50%;
  height: 50%;
  fill: white;
`

const StyledWrapper = styled.div `
  position: relative;
  display: flex;
  align-items: center;
  cursor: ${props => props.onClick ? 'pointer' : 'auto'};
`

const StyledLabel = styled.h5<{ active: boolean }> `
  display: inline-block;
  flex: 1 0;
  font-weight: 500;
  font-size: 13px;
  color: ${props => props.active ? props.theme.colors.LABEL_TEXT_HOVER : props.theme.colors.LABEL_TEXT };
`

const StyledSquare = styled.div `
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  right: -18px;
  border-top: 2px solid ${props => props.theme.colors.BORDER};
  border-right: 2px solid ${props => props.theme.colors.BORDER};
  background-color: ${props => props.theme.colors.BACKGROUND};
  transform: translateY(-50%) rotate(45deg);
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    display:none;
  }
`

export interface BreadcrumbType {
  active: boolean
  completed: boolean
  label: string
  onClick?: () => void
}

type BreadcrumbProps = {
  circleLabel: string
} & BreadcrumbType

const Breadcrumb: React.FunctionComponent<BreadcrumbProps> = props => (
  <StyledWrapper onClick={props.onClick}>
    <StyledCircle active={props.active} completed={props.completed}>
      {props.completed
        ? <StyledCheckMarkSvg/>
        : <StyledH4>{props.circleLabel}</StyledH4>
      }
    </StyledCircle>
    <StyledLabel active={props.active}>
      {props.label}
    </StyledLabel>
    {props.active && <StyledSquare/>}
  </StyledWrapper>
)

export default Breadcrumb
