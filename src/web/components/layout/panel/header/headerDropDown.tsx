import { Role } from '#veewme/gen/graphqlTypes'
import ArrowSvg from '#veewme/web/assets/svg/arrow.svg'
import DropDownList, { DropDownListGroups } from '#veewme/web/common/dropDownList'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { HEADER_HEIGHT_PX } from '../constants'

export const BUTTON_HEIGHT_PX = HEADER_HEIGHT_PX - 2

export const DropDownWrapper = styled.div `
  position: relative;
  outline: none;
  border: none;
  min-height: ${BUTTON_HEIGHT_PX}px;
  height: 100%;
  background-color: ${props => props.theme.colors.HEADER_BACKGROUND};
  border-left: 1px solid ${props => props.theme.colors.BORDER};
`
export const ButtonContainer = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 17px;
  border: none;
  outline: none;
  background: none;
`

export const ButtonCaption = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 22px;
  height: ${BUTTON_HEIGHT_PX}px;
`

export const StyledIcon = styled(props => <props.icon className={props.className}/>) `
  width: 55px;
  height: 55px;
  fill: ${props => props.theme.colors.ICON_UNSELECTED};
  &:hover, &:active {
    fill: ${props => props.theme.colors.ICON_HOVER};
  }
  ${ButtonContainer}:hover & {
    fill: ${props => props.theme.colors.BUTTON_ICON_HOVER};
  }
`

export const StyledArrow = styled(ArrowSvg) `
  width: 26px;
  height: 16px;
  fill: ${props => props.theme.colors.ICON_UNSELECTED};
  &:hover, &:active {
    fill: ${props => props.theme.colors.ICON_HOVER};
  }
  ${ButtonContainer}:hover & {
    fill: ${props => props.theme.colors.BUTTON_ICON_HOVER};
  }
`

const StyledDropDown = styled(DropDownList) `
`

interface HeaderDropDownProps {
  list: DropDownListGroups
  icon?: React.SVGFactory
  role?: Role
}

interface HeaderDropDownState {
  listOpen: boolean
}

export default class HeaderDropDown extends React.PureComponent<HeaderDropDownProps, HeaderDropDownState> {
  state: HeaderDropDownState = {
    listOpen: false
  }

  toggleList = () => {
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }))
  }

  mouseLeave = () => {
    this.setState(() => ({
      listOpen: false
    }))
  }

  render () {
    return (
      <DropDownWrapper onMouseLeave={this.mouseLeave}>
        <ButtonContainer onClick={this.toggleList}>
          {this.props.icon && this.props.role !== 'AFFILIATE' &&
            <StyledIcon icon={this.props.icon}/>
          }
          <ButtonCaption>
            {this.props.children}
          </ButtonCaption>
          <StyledArrow/>
        </ButtonContainer>
        {this.state.listOpen &&
          <StyledDropDown
            autoHeight
            list={this.props.list}
            role={this.props.role}
            onListClick={this.toggleList}
          />
        }
      </DropDownWrapper>
    )
  }
}
