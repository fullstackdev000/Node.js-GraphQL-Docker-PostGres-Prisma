import { MeQuery, Role } from '#veewme/graphql/types'
import { privateUrls, publicUrls } from '#veewme/lib/urls'
import Calendar from '#veewme/web/assets/svg/calendar.svg'
import AvatarSvg from '#veewme/web/assets/svg/male-user.svg'
import { DropDownListGroups } from '#veewme/web/common/dropDownList'
import HideForRole from '#veewme/web/common/hideForRole'
import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'
import Tooltipped from '#veewme/web/common/tooltipped'
import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { HEADER_HEIGHT_PX, SIDEBAR_WIDTH_PX } from '../constants'
import Credits from './credits'
import HeaderDropDown, { StyledIcon } from './headerDropDown'
import JobsReportDropdown from './jobsReport/dropdown'
import { Logo } from './logo'
import Payments from './payments'

import { ImportantDevices } from 'styled-icons/material/ImportantDevices'

const Wrapper = styled.header`
  position: fixed;
  width: 100%;
  height: ${HEADER_HEIGHT_PX}px;
  top: 0;
  left: 0;
  background-color: ${props => props.theme.colors.HEADER_BACKGROUND};
  border-bottom: 2px solid ${props => props.theme.colors.HEADER_BORDER};
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${SIDEBAR_WIDTH_PX}px;
  height: 100%;
  padding: 10px 0;

  img {
    max-height: 100%;
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
   svg {
     transform: scale(1.5);
   }
  }
`

const ButtonsContainer = styled.div `
  margin: 0;
  padding: 0 8px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-self: stretch;
`

const Label = styled.h3 `
  margin: 0 10px;
  font-weight: 500;
  font-size: 15px;
  text-align: left;
`

const SubLabel = styled.h4 `
  margin: 0 10px;
  font-weight: 400;
  font-size: 13px;
  color: ${props => props.theme.colors.LABEL_TEXT};
  text-transform: capitalize;
`

const UserInfoWrapper = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  min-width: 100px;
`

const BoxStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 100%;
  border-left: 1px solid ${props => props.theme.colors.BORDER};

  ${StyledIcon} {
    width: 44px;
    height: 44px;
  }
`

const CalendarBox: React.FC = () => {
  return (
    <Tooltipped
      tooltip='Full Acccess Calendar'
      delayShow={1500}
    >
      <BoxStyled>
        <NavLink to={privateUrls.calendar}>
          <StyledIcon icon={Calendar} />
        </NavLink>
      </BoxStyled>
    </Tooltipped>
  )
}

const AgentGalleryBox: React.FC<{
  id: number
}> = props => {
  return (
    <Tooltipped
      tooltip='Agent Gallery'
      delayShow={1500}
    >
      <BoxStyled>
        <NavLink target='_blank' to={`${publicUrls.toursGalleryRoot}/agent/${props.id}`}>
          <StyledIcon icon={ImportantDevices} />
        </NavLink>
      </BoxStyled>
    </Tooltipped>
  )
}

interface UserInfoProps {
  me: MeQuery['me']
}

const UserInfo: React.FunctionComponent<UserInfoProps> = props => (
  <>
    <Label>{props.me.firstName} {props.me.lastName}</Label>
    <SubLabel>{props.me.role.toLowerCase()}</SubLabel>
  </>
)

const getUsersList = (role: Role, id: number) => {
  const lowerCaseRole = role.toLocaleLowerCase()
  const userList: DropDownListGroups = [
    {
      items: [
        {
          label: 'Account...',
          linkTo: privateUrls.account
        },
        {
          label: 'Settings',
          linkTo: `${privateUrls.accountSettings}/${lowerCaseRole}/${id}`
        },
        {
          label: 'Change password',
          linkTo: privateUrls.changePassword
        },
        {
          label: 'Users',
          linkTo: privateUrls.employees,
          visibleByRoles: ['AFFILIATE']
        },
        {
          label: 'Subscription',
          linkTo: privateUrls.subscription,
          visibleByRoles: ['AFFILIATE']
        },
        {
          label: 'Billing',
          onClick: () => log.debug(`Option 2 clicked`)
        },
        {
          label: 'My Support Page',
          linkTo: `${privateUrls.mySupportCore}/${id}`,
          visibleByRoles: ['AFFILIATE']
        },
        {
          label: 'Data Export',
          onClick: () => log.debug(`Option 4 clicked`),
          visibleByRoles: ['AFFILIATE']
        },
        {
          label: 'Changelog',
          onClick: () => log.debug(`Option 5 clicked`),
          visibleByRoles: ['AFFILIATE']
        }
      ]
    },
    {
      items: [{
        label: 'Log out',
        linkTo: publicUrls.logout
      }]
    }
  ]

  return userList
}

interface HeaderProps {
  me?: MeQuery['me']
  logoUrl?: string
  loading?: boolean
}

const Header: React.FunctionComponent<HeaderProps> = ({
  me,
  loading,
  logoUrl
}) => {
  const userList = React.useMemo(() => {
    if (!me) {
      return []
    }
    return getUsersList(me.role, me.accountId)
  }, [me])

  return (
    <Wrapper>
      <LogoContainer>
        {!logoUrl && !loading ? <Logo/> : <img src={logoUrl} />}
      </LogoContainer>
      <ButtonsContainer>
        {me &&
          <>
            {
              me.role === 'AFFILIATE' && <CalendarBox />
            }
            {
              me.role !== 'AGENT' && <JobsReportDropdown
                role={me.role}
              />
            }
            {
              (me.role === 'AGENT') &&
              <Payments agentId={me.accountId} />
            }
            <HideForRole
              action='show'
              roles={['AFFILIATE']}
            >
              <Credits role={me.role} />
            </HideForRole>
            <HideForRole
              action='show'
              roles={['AGENT']}
            >
              <AgentGalleryBox id={me.accountId}/>
            </HideForRole>
            <HeaderDropDown
              list={userList}
              icon={AvatarSvg}
              role={me.role}
            >
              <UserInfoWrapper>
                <UserInfo me={me}/>
              </UserInfoWrapper>
            </HeaderDropDown>
          </>
        }
      </ButtonsContainer>
    </Wrapper>
  )
}

export default Header
