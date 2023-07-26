import { publicUrls } from '#veewme/lib/urls'
import XSvg from '#veewme/web/assets/svg/x.svg'
import { NavHashLink } from '#veewme/web/common/hashLink'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'styled-icons/boxicons-regular/Menu'
import Logo from '../../../assets/svg/logo.svg'
import Button from '../../../common/buttons/basicButton'
import dimensions from './dimensionsConstants'

const PageHeader = styled.header`
  width: 100%;
  height: ${dimensions.headerHeight};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  background-color: white
  border-bottom: 1px solid ${props => props.theme.colors.GREY};
  padding: 0 ${dimensions.pageMargin};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const LogoLink = styled(Link)`
  display: block;
  width: 180px;
  height: auto;
  & > svg {
    width: 100%;
  }
`

const NavigationWrapper = styled.div`
  position: relative;
  height: auto;
`

const MenuIcon = styled(Menu)``

const MenuButton = styled(props => <Button {...props} />)`
  z-index: 5;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    display: none;
  }
  & > svg {
    max-width: 80%;
    max-height: 80%;
  }
  & > ${MenuIcon} {
    height: 80%;
  }
`

const Navigation = styled.nav<{ menuOpen: boolean }>`
  position: absolute;
  top: calc((${dimensions.headerHeight} - 40%) / 2 - 100%);
  right: calc((${dimensions.headerHeight} - 100%) / 2 - 100%);
  text-align: left;
  width: 300px;
  background-color: white;
  border: 1px solid ${props => props.theme.colors.GREY};
  padding: 20px 80px 10px 20px;
  z-index: 4;
  visibility: ${props => props.menuOpen ? 'visible' : 'hidden' };
  transform: ${props => props.menuOpen ? 'scale(1, 1)' : 'scale(1, 0)' };
  transform-origin: 100% 0%;
  transition: transform .3s, visibility 0s 0s;
  li {
    border-bottom: 1px solid ${props => props.theme.colors.GREY};
    padding-left: 5px;
  }
  ul:last-child li:last-child {
    border-bottom: none;
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    position: relative;
    display: flex;
    justify-content: flex-end;
    width: auto;
    border: none;
    background-color: transparent;
    padding: 0;
    top: 0;
    right: 0;
    visibility: visible;
    transform:scale(1, 1);
    ul:first-child {
      border-right: 1px solid ${props => props.theme.colors.PUBLIC_NAVIGATION_LINK};
      margin-right: 5px;
      padding-right:5px;
    }
    li {
      display: inline-block;
      border-bottom: none;
      padding-left: none;
    }
  }
`

const AuthButton = styled(props => <Button {...props} />)`
  display: none;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    text-transform: uppercase;
    margin-left: 10px;
    display: inline-flex;
  }
`

const HeaderLink = styled(NavHashLink)`
  display: block;
  padding: 10px 0;
  box-sizing: border-box;
  text-transform: uppercase;
  font-size: 13px;
  font-weight: 500;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    margin: 0 10px;
  }
  &, &:visited {
    color: ${props => props.theme.colors.PUBLIC_NAVIGATION_LINK};
  }
  &:hover {
    color: ${props => props.theme.colors.PUBLIC_NAVIGATION_LINK_HOVER};
    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
      border-bottom: 1px solid ${props => props.theme.colors.PUBLIC_NAVIGATION_LINK_HOVER};
      padding-bottom: 9px;
    }
  }
`

const LogInLink = styled(HeaderLink)`
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    &, &:hover {
      font-weight: 700;
    }
  }
`

const SignUpLink = styled(HeaderLink)`
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    display: none;
  }
`

interface HeaderState {
  menuOpen: boolean
}

class Header extends React.PureComponent<{}, HeaderState> {
  state = {
    menuOpen: false
  }

  toggleMenu = () => { this.setState({ menuOpen: !this.state.menuOpen }) }

  render () {
    return (
      <PageHeader>
        <LogoLink to={publicUrls.landingPage}><Logo /></LogoLink>
        <NavigationWrapper>
          <MenuButton
            icon={this.state.menuOpen ? XSvg : MenuIcon}
            size='big'
            buttonTheme='action'
            full
            onClick={this.toggleMenu}
          />
          <Navigation menuOpen={this.state.menuOpen} >
            <ul>
              <li><HeaderLink to={publicUrls.tours}>Tours</HeaderLink></li>
              <li><HeaderLink to={publicUrls.pricing}>Pricing</HeaderLink></li>
              <li><HeaderLink to={publicUrls.contact}>Contact</HeaderLink></li>
            </ul>
            <ul>
              <li><LogInLink to={publicUrls.login}>Log in</LogInLink></li>
              <li>
                <SignUpLink to={publicUrls.signup}>Sign Up</SignUpLink>
                <AuthButton to={publicUrls.signup} label='Sign Up' full buttonTheme='action' />
              </li>
            </ul>
          </Navigation>
        </NavigationWrapper>
      </PageHeader>
    )
  }
}

export default Header
