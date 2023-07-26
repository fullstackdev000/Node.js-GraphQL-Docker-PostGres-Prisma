import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { NavLink } from 'react-router-dom'
import PlusIcon from '../../../../assets/svg/plus.svg'
import Button from '../../../../common/buttons/basicButton'
import { SidebarItemProps } from './types'

const StyledLI = styled.li`
  position: relative;
`

const StyledP = styled.p `
  font-size: 10px;
  ${StyledLI}:hover & {
    color: white;
  }
`

const StyledIcon = styled.div`
  fill: ${props => props.theme.colors.SIDEBAR_ICON};
  ${StyledLI}:hover & {
    fill: ${props => props.theme.colors.SIDEBAR_ICON_HOVER};
  }
`

const StyledNavLink = styled(NavLink) `
  border: none;
  outline: none;
  text-decoration: none;
`

const StyledLink = styled(StyledNavLink)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 61px;
  margin: 5px 0;
  padding-right: 10px;
  color: ${props => props.theme.colors.SIDEBAR_ICON};
  background-color: ${props => props.theme.colors.SIDEBAR_BACKGROUND};
  border-left: 7px solid transparent;
  ${StyledLI}:hover &,
  &:hover,
  &:active {
    background-color: ${props => props.theme.colors.SIDEBAR_ITEM_BACKGROUND_HOVER};
    border-left: 7px solid ${props => props.theme.colors.BUTTON_BORDER_HOVER};
  }

  &.active {
    border-left: 7px solid ${props => props.theme.colors.BUTTON_BORDER_HOVER};
    background-color: ${props => props.theme.colors.SIDEBAR_ITEM_BACKGROUND_HOVER};
    ${StyledIcon} {
      fill: ${props => props.theme.colors.SIDEBAR_ICON_HOVER};
    }
    ${StyledP} {
      color: white;
    }
  }
`

const Plus = styled(props => <Button {...props} />)`
  position: absolute;
  top: calc(50% - 13px);
  right: -13px;
`

interface SidebarItemUIProps {
  exact?: boolean
}

class SidebarItem extends React.Component<SidebarItemProps & SidebarItemUIProps, {}> {
  render () {
    return (
      <StyledLI>
        <StyledLink to={this.props.to} exact={this.props.exact} strict>
          <StyledIcon>
            {this.props.icon}
          </StyledIcon>
          <StyledP>{this.props.label}</StyledP>
        </StyledLink>
        {this.props.toPlus && (
            <Plus
              to={this.props.toPlus}
              icon={PlusIcon}
              buttonTheme='action'
              full
              size='small'
            />
          )
        }
      </StyledLI>
    )
  }
}

export default SidebarItem
