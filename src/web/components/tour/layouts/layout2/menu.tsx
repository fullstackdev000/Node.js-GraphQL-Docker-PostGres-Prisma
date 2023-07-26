import { NavHashLink as NavLink } from '#veewme/web/common/hashLink'
import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { Tour } from '../../types'
import { TourContext } from './'
import { height } from './header'
import { bannerLeftIndentation } from './styled'

import { Menu as MenuIcn } from 'styled-icons/boxicons-regular'

const MenuWrapper = styled.div<{
  mainColor: string
  collapsed: boolean
}>`
  position: fixed;
  margin-left: ${bannerLeftIndentation};
  margin-right: 20px;
  top: ${height};
  right: 0;
  left: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  z-index: 3;
  background: rgba(143, 134, 134, 0.9);
  transition: background .5s;

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    padding-left: 20px;
    align-items: center;
    background: rgba(143, 134, 134, 0.8);
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    top: 0;
    margin: 0;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    margin: 0;
  }

  ${props => props.collapsed && `
    background: none !important;
    pointer-events: none;

    ul {
      opacity: 0;
    }
  `}

  `

const StyledMenu = styled.div.attrs({
  as: 'ul'
})<{
  mainColor: string
}>`
  display: flex;
  transition: opacity .5s;
  flex-direction: column;

  li {
    display: flex;
    position: relative;
    padding: 20px 35px;
    align-items: center;
    justify-content: center;
    flex: 1 1 auto;
    font-size: 20px;

    svg {
      margin-right: 7px;
    }
  }

  a {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    height: 100%;
    color: #fff;

    &:hover {
      color:  ${props => props.mainColor};
    }
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    flex-direction: row;

     li {
      padding: 0 15px;
     }

     a {
      justify-content: center;
     }
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) and (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    li {
      font-size: 17px;
    }
  }

`

const HamburgerBtn = styled.span<{ mainColor: string }>`
  display: block;
  padding: 10px;
  height: 65px;
  position: relative;
  right: 10vw;
  cursor: pointer;
  background-color: ${props => props.mainColor};
  pointer-events: auto;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    right: 25px;
  }

  span {
    display: block;
    position: relative;
    color: #fff;
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    text-align: center;
    line-height: 10px;
  }

  svg {
    fill: #fff;
  }
`

// TODO more items will be added
const menuItems: TabItem[] = [
  {
    label: 'Overview',
    to: '#overview'
  },
  {
    label: 'Photos',
    to: '#photos'
  },
  {
    label: 'Panoramas',
    to: '#panoramas'
  },
  {
    label: 'Video',
    to: '#videos'
  },
  {
    label: 'Interactives',
    to: '#interactives'
  },
  {
    alwaysVisble: true,
    label: 'Contact',
    to: '#contact'
  }
]

interface TabItem {
  icon?: JSX.Element
  to: string
  label: string
  childItems?: TabItem[]
  alwaysVisble?: boolean
}

interface MenuMainProps {
  tour: Tour
  className?: string
}

type MenuProps = MenuMainProps
type MenuItemsProps = MenuMainProps

const MenuItems: FunctionComponent<MenuItemsProps> = props => {
  const { tour } = props

  return (
    <>
      {
        menuItems.map(tab => {
          const tabVisible = tour.visibleTabs.find(item => item === tab.label.toUpperCase()) || tab.alwaysVisble
          return tabVisible && (
            <li key={tab.label}>
              <NavLink exact to={`${tab.to}`}>
                {tab.label}
              </NavLink>
            </li>
          )
        })
      }
    </>
  )
}

const Menu: FunctionComponent<MenuProps> = props => {
  const { tour } = props
  const mainColor = React.useContext(TourContext).mainColor
  const [ isVisible, setVisibility ] = React.useState(false)

  const eventListener = () => setVisibility(false)

  React.useEffect(() => {
    window.addEventListener('scroll', eventListener)
    return () => {
      window.removeEventListener('scroll', eventListener)
    }
  }, [])

  return (
    <>
      <MenuWrapper mainColor={mainColor} collapsed={!isVisible}>
        <StyledMenu mainColor={mainColor}>
          <MenuItems tour={tour} />
        </StyledMenu>
        <HamburgerBtn
          mainColor={mainColor}
          onClick={() => setVisibility(prev => !prev)}
        >
          <span>Menu</span>
          <MenuIcn width='36' height='36' />
        </HamburgerBtn>
      </MenuWrapper>
    </>
  )
}
export default Menu
