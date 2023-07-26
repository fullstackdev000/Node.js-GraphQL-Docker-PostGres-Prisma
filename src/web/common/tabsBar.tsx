import HideForRole from '#veewme/web/common/hideForRole'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { NavLink } from 'react-router-dom'
import PlusIcon from '../assets/svg/plus.svg'
import Button from './buttons/basicButton'
import { MAIN_SECTION_HEADER_HEIGHT_PX, StyledH4, StyledMainSectionHeader } from './styled'

type Roles = React.ComponentProps<typeof HideForRole>['roles']

const activeClassName = 'active-tab'

const StyledPlus = styled(props => <Button {...props} />)`
  position: absolute;
  right: 0;
  bottom: 20px;
`

const StyledTab = styled(NavLink) `
  height: ${MAIN_SECTION_HEADER_HEIGHT_PX}px;
  min-width: 100%;
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
  align-items: center;
  outline: none;
  text-decoration: none;
  border-bottom: 3px solid ${props => props.theme.colors.BUTTON_BORDER};

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  &:hover > h4 {
    color: ${props => props.theme.colors.LABEL_TEXT_HOVER};
  }
  &.${activeClassName} {
    border-bottom: 3px solid ${props => props.theme.colors.BUTTON_BORDER_HOVER};
    & > h4 {
      color: ${props => props.theme.colors.LABEL_TEXT_HOVER};
    }
  }
`

const TabWrapper = styled.div<{renderButton: boolean}>`
  display: inline-block;
  min-width: 60px;
  position: relative;
  margin: 0 18px;
  &:first-child {
    margin-left: 0;
  }
  & > ${StyledTab} {
    ${props => props.renderButton && 'padding-right: 35px'};
  }
`

export interface PureTabProps {
  label: string
  to: string
  hideForRoles?: Roles
}

interface PlusButtonProps extends PureTabProps {
  onPlusClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  plusTo?: never
}

interface PlusLinkProps extends PureTabProps {
  onPlusClick?: never
  plusTo?: string
}

type TabProps = PlusButtonProps | PlusLinkProps

const Tab: React.FunctionComponent<TabProps> = props => {
  const renderButton = !!(props.onPlusClick || props.plusTo)

  return (
    <TabWrapper renderButton={renderButton} >
      <StyledTab exact activeClassName={activeClassName} to={props.to}>
        <StyledH4>{props.label}</StyledH4>
      </StyledTab>
      {renderButton && <StyledPlus
        buttonTheme='action'
        full
        icon={PlusIcon}
        inverseTextColor={false}
        onClick={props.onPlusClick}
        to={props.plusTo}
        size='small'
      />}
    </TabWrapper>
  )
}

interface TabsBarProps {
  tabs: TabProps[]
  className?: string
}

const TabsBar: React.FunctionComponent<TabsBarProps> = props => {
  const StyledWrapper = styled(StyledMainSectionHeader) `
    justify-content: flex-start;
  `

  return (
    <StyledWrapper className={props.className}>
      {props.tabs.map((tab, index) => (
        <HideForRole key={index} roles={tab.hideForRoles || []}>
          <Tab {...tab} />
        </HideForRole>
      ))}
    </StyledWrapper>
  )
}

export default TabsBar
