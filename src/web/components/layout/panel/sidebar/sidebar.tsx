import { Role } from '#veewme/graphql/types'
import { privateUrls } from '#veewme/lib/urls'
import { rolesAccess } from '#veewme/web/common/consts'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { Settings } from 'styled-icons/feather'
import DashboardSvg from '../../../../assets/svg/dashboard.svg'
import HammerAndPickSvg from '../../../../assets/svg/hammer-and-pick.svg'
import MediaSvg from '../../../../assets/svg/media-access.svg'
import OrdersSvg from '../../../../assets/svg/orders.svg'
import PhotographerSvg from '../../../../assets/svg/photographer.svg'
import ServicesSvg from '../../../../assets/svg/services.svg'
import SupportSvg from '../../../../assets/svg/support.svg'
import UsersSvg from '../../../../assets/svg/users.svg'
import { HEADER_HEIGHT_PX, SIDEBAR_WIDTH_PX } from '../constants'
import { PLUS_WIDTH_PX } from './constants'
import Hamburger from './hamburger'
import SidebarItem from './sidebarItem'
import { SidebarItemProps } from './types'

import { Globe } from 'styled-icons/boxicons-regular'
import { BalanceScale } from 'styled-icons/fa-solid'

const WIDTH_PX: number = (SIDEBAR_WIDTH_PX + PLUS_WIDTH_PX / 2)

const StyledSidebar = styled.section<{ open: boolean }> `
  position: fixed;
  width: ${SIDEBAR_WIDTH_PX}px;
  top: ${HEADER_HEIGHT_PX}px;
  left: 0;
  bottom: 0;
  background-color: ${props => props.theme.colors.SIDEBAR_BACKGROUND};
  z-index: 400;
  display: flex;
  flex-direction: column;
  @media (max-width: 1024px) {
    left: ${-WIDTH_PX}px;
    ${({ open }: { open: boolean }) => open && `
      transform: translateX(${WIDTH_PX}px);
    `}
    transition: 0.4s;
  }
`

const MenuContainer = styled.nav `
  flex: 1;
  padding: 10px 0;
  & .ul {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
`

const SupportContainer = styled.nav `
  min-height: ${SIDEBAR_WIDTH_PX}px;
  border-top: 2px solid ${props => props.theme.colors.SIDEBAR_ICON};
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const menuItems: SidebarItemProps[] = [
  {
    icon: <DashboardSvg width={24} height={24} />,
    label: 'Dashboard',
    to: privateUrls.dashboard
  },
  {
    icon: <UsersSvg width={22} height={21}/>,
    label: 'Clients',
    to: privateUrls.clients,
    toPlus: privateUrls.addAgent
  },

  {
    icon: <OrdersSvg width={29} height={21}/>,
    label: 'Orders',
    to: privateUrls.orders,
    toPlus: privateUrls.addOrder
  },
  {
    icon: <MediaSvg width={22} height={22}/>,
    label: 'Media Assets',
    to: privateUrls.mediaAccess
  },
  {
    icon: <PhotographerSvg width={24} height={23}/>,
    label: 'Fulfillment',
    to: privateUrls.photographers
  },
  {
    icon: <BalanceScale width={24} height={23}/>,
    label: 'Compensation',
    to: privateUrls.compensation
  },
  {
    icon: <ServicesSvg width={24} height={24}/>,
    label: 'Services',
    to: privateUrls.services
  },
  {
    icon: <OrdersSvg width={28} height={28}/>,
    label: 'Jobs',
    to: privateUrls.jobs
  },
  {
    icon: <Settings width={28} height={28}/>,
    label: 'Settings',
    to: privateUrls.settings
  },
  {
    icon: <Globe size='30'/>,
    label: 'Domains',
    to: privateUrls.domains
  },
  {
    icon: <HammerAndPickSvg width={28} height={28}/>,
    label: 'Developers',
    to: privateUrls.dev
  },
  {
    icon: <UsersSvg width={22} height={21}/>,
    label: 'Affiliates',
    to: privateUrls.affiliates
  }
]

const supportItems: SidebarItemProps[] = [
  {
    icon: <SupportSvg width={24} height={26}/>,
    label: 'Support',
    to: privateUrls.support
  }
]

interface SidebarProps {
  role?: Role
}

interface SidebarState {
  open: boolean
}

class Sidebar extends React.Component<SidebarProps, SidebarState> {
  state: SidebarState = {
    open: false
  }

  closeSidebar = () => {
    this.setState(() => ({ open: false }))
  }

  handleHamburgerClick = () => {
    this.setState(prevState => ({ open: !prevState.open }))
  }

  render () {
    return (
      <>
        <Hamburger onClick={this.handleHamburgerClick} isOpen={this.state.open} />
        <StyledSidebar open={this.state.open} onClick={this.closeSidebar}>
          <MenuContainer>
            <ul>
              {
                menuItems.map((item, index) => {
                  let displayItem = false
                  // DEVELOPER can see everything
                  if (this.props.role === 'DEVELOPER') {
                    displayItem = true
                  } else {
                    const allowedItems = this.props.role ? rolesAccess[this.props.role] : []
                    displayItem = allowedItems.indexOf(item.label) > -1
                  }

                  return (
                    displayItem && (
                      <SidebarItem
                        key={index}
                        label={item.label}
                        icon={item.icon}
                        to={item.to}
                        toPlus={item.toPlus}
                        // Just temp solution. Prevents Dashboard item ('/') to be always highlighted as active.
                        // TODO: remove when admin panel app URLs are prefixed with `/panel`.
                        exact={index === 0}
                      />)
                  )
                }
              )
              }
            </ul>
          </MenuContainer>
          <SupportContainer>
            <ul>
              {
                supportItems.map((item, index) => (
                  <SidebarItem
                    key={index}
                    label={item.label}
                    icon={item.icon}
                    to={item.to}
                    toPlus={item.toPlus}
                  />
                ))
              }
            </ul>
          </SupportContainer>
        </StyledSidebar>
      </>
    )
  }
}

export default Sidebar
