import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import Arrow from '../assets/svg/arrow.svg'
import { themeColors } from './colors'

const Base = styled.button `
  position: relative;
  margin: 0 4px;
  height: 30px;
  outline: none;
  border: none;
  background-color: transparent;
`

const BorderButton = styled(Base) `
  background-color: white;
  border-radius: 5px;
  border: 2px solid ${themeColors.BUTTON_BORDER};
  &:hover, &:active {
    border: 2px solid ${themeColors.BUTTON_BORDER_HOVER};
  }
`

const DropDown = styled(BorderButton) `
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const LabelContainer = styled.div `
  flex: 1;
  padding: 4px 18px;
`

const Icon = styled.div`
  fill: ${themeColors.BUTTON_ICON};
  ${DropDown}:hover & {
    fill: ${themeColors.BUTTON_ICON_HOVER};
  }
`

const IconContainer = styled.div `
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  height: 26px;
  width: 28px;
  fill: ${themeColors.BUTTON_ICON};
  &:hover, &:active {
    fill: ${themeColors.BUTTON_ICON_HOVER};
  }
`

const DropDownIconContainer = styled(IconContainer) `
  border-left: 2px solid ${themeColors.BUTTON_BORDER};
`

interface ButtonProps {
  onClick: (label: string) => void
}

interface ButtonLabelProps {
  label: string
}

interface ButtonIconProps {
  icon: any
}

interface ButtonTooltipProps {
  tip: string
}

interface ButtonTooltipState {
  showTooltip: boolean
}

export const Button: React.FunctionComponent<ButtonProps & ButtonLabelProps> = props => {

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    props.onClick(props.label)
  }

  return (
    <BorderButton onClick={handleClick}>
      <LabelContainer>
        {props.label}
      </LabelContainer>
    </BorderButton>
  )
}

export const DropDownButton: React.FunctionComponent<ButtonProps & ButtonLabelProps> = props => {

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    props.onClick(props.label)
  }

  return (
    <DropDown onClick={handleClick}>
      <LabelContainer>
        {props.label}
      </LabelContainer>
      <DropDownIconContainer>
        <Icon>
          <Arrow width={10} height={6}/>
        </Icon>
      </DropDownIconContainer>
    </DropDown>
  )
}

const AccordionArrow = styled(Arrow)`
  width: 60%;
  fill: ${themeColors.GREEN};
  margin: 0 auto;
`

const AccordionBtnContainer = styled.button`
  padding: 10px;
  background: none;
  border: 0 none;
  cursor: pointer;
`

const AccordionInner = styled.span`
  border-radius: 100%;
  width: 25px;
  height: 25px;
  border: 2px solid ${themeColors.BORDER};
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  &:hover {
    border-color: ${themeColors.GREEN};
  }
  &:focus {outline: none};
  & > * {
    ${({ open }: {open: boolean}) => open && `transform: rotate(180deg)`};
  }
`

export const AccordionButton = (props: {
  className?: string,
  togglePanel: (e: React.MouseEvent<HTMLButtonElement>) => void,
  open: boolean
}) => {

  return (
    <AccordionBtnContainer className={props.className} onClick={props.togglePanel}>
      <AccordionInner open={props.open}>
        <AccordionArrow/>
      </AccordionInner>
    </AccordionBtnContainer>
  )
}

export class IconButton extends React.PureComponent<
  ButtonProps & ButtonIconProps & ButtonLabelProps & ButtonTooltipProps,
  ButtonTooltipState
> {
  state: ButtonTooltipState = {
    showTooltip: false
  }

  handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.onClick(this.props.label)
  }

  handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ showTooltip: true })
  }

  handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ showTooltip: false })
  }

  render () {
    return (
      <Base onClick={this.handleClick} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <IconContainer>
          {this.props.icon}
        </IconContainer>
      </Base>
    )
  }
}
