import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import * as ReactModal from 'react-modal'
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom'
import { Tour } from '../../types'
import { TourContext } from './'
import { Container } from './styled'

import FloorPlan from '#veewme/web/assets/svg/floor-plan.svg'
import { ChevronDown, Images, Menu as MenuIcn } from 'styled-icons/boxicons-regular'
import { Videos } from 'styled-icons/boxicons-solid'
import { PanoramaHorizontal } from 'styled-icons/material'
import { Home } from 'styled-icons/typicons'

const MenuWrapper = styled.nav<{ mainColor: string }>`
  background: ${props => props.mainColor};
  z-index: 3;
  display: none;

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    display: block;
  }
`

const StyledMenu = styled(Container).attrs({
  as: 'ul'
})`
  display: flex;
  height: 40px;

  li {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    flex: 1 1 auto;
    font-size: 20px;

    svg {
      margin-right: 7px;
      fill: #fff;
    }
  }

  a {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #fff;

    &:hover {
      background: rgba(0, 0, 0, 0.08);
    }

    &.active {
      background: rgba(0, 0, 0, 0.15);
    }
  }
`

const HamburgerBtn = styled.span<{ mainColor: string }>`
  display: block;
  cursor: pointer;

  span {
    display: block;
    position: relative;
    top: -5px;
    color: ${props => props.mainColor};
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    text-align: center;
    line-height: 10px;
  }

  svg {
    fill: ${props => props.mainColor};
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    display: none;
  }
`

const DropdownStyled = styled.ul<{
  visible?: boolean
}>`
  flex: 1 1 auto;
  height: 100%;

  ul {
    position: absolute;
    top: 40px;
    width: 100%;
    display: ${props => props.visible ? 'block' : 'none'};
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

    li {
      display: block;
      position: relative;
      text-align: center;
      border: 1px solid ${props => props.theme.colors.INFO_BORDER};
      border-width: 0 1px 1px 1px;
      background: #fff;

      a {
        display: block;
        padding: 10px 15px;
        font-size: 16px;
        font-weight: 500;
        color: ${props => props.theme.colors.FIELD_TEXT};
        text-align: left;
        transition: padding .5s;

        &:hover {
          padding-left: 20px;
        }

        &.active {
          color: ${props => props.theme.colors.GREEN};
          background: #fff;
        }
      }
    }
  }
`

const StyledMobileMenu = styled.ul<{ mainColor: string }>`
  background: #fff;
  width: 600px;
  max-width: 100%;
  padding: 20px;
  border-radius: 5px;
  overflow: hidden;

  li {
    display: block;
    position: relative;
    text-align: center;
    border: 1px solid ${props => props.theme.colors.INFO_BORDER};
    border-width: 1px 1px 0 1px;

    &:first-child {
      border-radius: 5px 5px 0 0;
    }

    &:last-child {
      border-radius: 0 0 5px 5px;
      border-bottom-width: 1px;
      overflow: hidden;
    }

    a {
      display: flex;
      padding: 10px;
      font-size: 18px;
      font-weight: 500;
      align-items: center;
      justify-content: center;
      color: ${props => props.theme.colors.FIELD_TEXT};

      &:hover {
        background: ${props => props.theme.colors.BACKGROUND};
      }

      &.active {
        color: ${props => props.theme.colors.GREEN};
      }
    }

    ${DropdownStyled} {
      svg ~ svg {
        left: unset;
        right: 10px;
        fill: ${props => props.theme.colors.GREEN};
      }

      ul {
        position: static;
        border-top: 1px solid ${props => props.theme.colors.INFO_BORDER};
        box-shadow: none;

        li {
          border-width: 1px 0 0 0;
          &:first-child {
            border-radius: 0;
          }

          &:first-child {
            border-top: 0 none;
          }

          a {
            font-size: 14px;

            &:before {
              content: '\\25CF';
              margin-right: 5px;
            }
          }
        }
      }
    }

    svg {
      fill: ${props => props.mainColor};
      position: absolute;
      left: 10px;
    }
  }
`

// TODO more items will be added
const menuItems: TabItem[] = [
  {
    icon: <Home size={26}/>,
    label: 'Overview',
    to: ''
  },
  {
    icon: <Images size={26} />,
    label: 'Photos',
    to: '/photos'
  },
  {
    icon: <PanoramaHorizontal size={26} />,
    label: 'Panoramas',
    to: '/panorama'
  },
  {
    dropdown: true,
    icon: <Videos size={26} />,
    label: 'Video',
    to: '/video'
  },
  {
    dropdown: true,
    icon: <FloorPlan width={23} height={23} />,
    label: 'Interactives',
    to: '/interactive'
  }
]

interface TabItem {
  dropdown?: boolean
  icon?: JSX.Element
  to: string
  label: string
  childItems?: TabItem[]
}

type DropdownItemProps = TabItem & {
  tourUrl: string
}

const DropdownItem: React.FunctionComponent<DropdownItemProps> = props => {
  const [visible, setVisible] = React.useState(false)
  const videoTabUrl = `${props.tourUrl}${props.to}`
  return (
    <DropdownStyled
      onMouseLeave={() => {
        setVisible(false)
      }}
      visible={visible}
    >
      <NavLink
        to={videoTabUrl}
        onTouchEnd={e => {
          e.preventDefault()
          e.stopPropagation()
          setVisible(prev => !prev)
        }}
        onMouseEnter={() => {
          setVisible(prev => !prev)
        }}
      >
        {props.icon}
        {props.label}
        <ChevronDown size='30' />
      </NavLink>
      {
        <ul
          onClick={() => {
            setVisible(prev => !prev)
          }}
        >
          {props.childItems && props.childItems.map(child => (
            <li key={child.to}>
              <NavLink
                to={child.to}
              >
                {child.label}
              </NavLink>
            </li>
          ))}
        </ul>
      }
    </DropdownStyled>
  )
}

// TODO: refactor and improve automatic generation of dropdown items to avoid hardcoded names
// below code is just quick (and ugly) solution
type dropwnItemsLabels = 'Interactives' | 'Video'

type DropdownItems = {
  [label in dropwnItemsLabels]: string
}

const dropdownItemsNameToSourceMap: DropdownItems = {
  Interactives: 'interactives',
  Video: 'videos'
}

interface ItemData {
  label: string
  id: number
}
const prepareMenuData = (tour: Tour, tourUrl: string) => {

  return menuItems.map(item => {
    const withDropdown = item.dropdown

    if (withDropdown) {
      const dataItemsSource = dropdownItemsNameToSourceMap[item.label as dropwnItemsLabels]
      // TO DO: remove casting
      // https://stackoverflow.com/a/35209016
      const dataItems = (tour as any)[dataItemsSource] as ItemData[]
      const items = dataItems.map((v, i) => ({
        label: v.label || 'No label',
        to: `${tourUrl}${item.to}/${v.id}`
      }))

      return {
        ...item,
        childItems: items
      }
    } else {
      return item
    }
  })
}

interface MenuMainProps {
  tour: Tour
  className?: string
}

type MenuProps = MenuMainProps & RouteComponentProps
type MenuItemsProps = MenuMainProps & { tourUrl: string }

const MenuItems: FunctionComponent<MenuItemsProps> = props => {
  const { tourUrl, tour } = props
  const items = prepareMenuData(tour, tourUrl)

  return (
    <>
      {
        items.map(tab => {
          const tabVisible = tour.visibleTabs.find(item => item === tab.label.toUpperCase())
          const regularItem = (
            <NavLink exact to={`${tourUrl}${tab.to}`}>
              {tab.icon}
              {tab.label}
            </NavLink>
          )

          const showDropdown = tab.childItems && tab.childItems.length > 1

          return tabVisible && (
            <li key={tab.label}>
              {!showDropdown ? regularItem : <DropdownItem {...tab} tourUrl={tourUrl}/>}
            </li>
          )
        })
      }
    </>
  )
}

const Hamburger: FunctionComponent<MenuProps> = props => {
  const { match: { url: tourUrl }, tour } = props
  const [ isVisible, setVisibility ] = React.useState(false)
  const mainColor = React.useContext(TourContext).mainColor

  const eventListener = () => setVisibility(false)

  React.useEffect(() => {
    window.addEventListener('resize', eventListener)
    return () => {
      window.removeEventListener('resize', eventListener)
    }
  }, [])

  return (
    <>
      <HamburgerBtn
       mainColor={mainColor}
       onClick={() => setVisibility(true)}
      >
        <MenuIcn width='36' height='36' />
        <span>Menu</span>
      </HamburgerBtn>
      <ReactModal
        isOpen={isVisible}
        ariaHideApp={false}
        portalClassName={props.className}
        onRequestClose={(e: MouseEvent) => {
          e.stopPropagation()
          setVisibility(false)
        }}
      >
        <StyledMobileMenu mainColor={mainColor} onClick={() => setVisibility(false)}>
          <MenuItems tour={tour} tourUrl={tourUrl} />
        </StyledMobileMenu>
      </ReactModal>
    </>
  )
}

const StyledModalMenu = styled(Hamburger)`
  .ReactModal__Overlay {
    z-index: 1000;
    background-color: rgba(255, 255, 255, 0.6) !important;
  }

  .ReactModal__Content {
    background: transparent !important;
    bottom: unset !important;
    top: 5px !important;
    left: 5px !important;
    right: 5px !important;
    border: 0 none !important;
    display: flex;
    justify-content: center;
  }
`

export const HamburgerMenu = withRouter(StyledModalMenu)

const Menu: FunctionComponent<MenuProps> = props => {
  const { match: { url: tourUrl }, tour } = props
  const mainColor = React.useContext(TourContext).mainColor

  return (
    <MenuWrapper mainColor={mainColor}>
      <StyledMenu>
        <MenuItems tour={tour} tourUrl={tourUrl} />
      </StyledMenu>
    </MenuWrapper>
  )
}
export default withRouter(Menu)
