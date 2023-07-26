import ArrowSvg from '#veewme/web/assets/svg/arrow.svg'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { StyledIcon } from 'styled-icons/types/types'

const ToggleButtonWrapper = styled.div<{ open?: boolean }>`
  display: inline-flex;
  justify-content: center;
  align-content: center;
  & > * {
    ${props => props.open && `transform: rotate(180deg)`};
  }
`

const StyledToggleSvg = styled(ArrowSvg) `
  width: 20px;
  height: 25px;
`

const StyledHeaderIcon = styled(props => <props.icon className={props.className}/>) `
  width: 24px;
  height: 22px;
`

const StyledPanelHeader = styled.header<{ toggleable?: boolean }> `
  width: 100%;
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
  cursor: ${props => props.toggleable ? 'pointer' : 'default'};
`

const StyledLabel = styled.p `
  margin: 0 16px;
`

const StyledHorizontalLine = styled.div `
  flex: 1;
  border-top: 3px solid ${props => props.theme.colors.BUTTON_ICON};
  margin-right:16px;
`

const StyledItemsTotal = styled.p `
  color: ${props => props.theme.colors.BUTTON_ICON};
  margin-right:16px;
`

const StyledVerticalLine = styled.div `
  align-self: stretch;
  border-left: 1px solid ${props => props.theme.colors.BUTTON_ICON};
  margin-right:16px;
`

export interface InnerPanelHeaderProps {
  label?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  toggleable?: boolean
  open: boolean
  icon?: StyledIcon | React.SVGFactory
  itemsTotal?: number
}

export const InnerPanelHeader: React.FunctionComponent<InnerPanelHeaderProps> = props => (
  <StyledPanelHeader toggleable={props.toggleable} onClick={props.onClick}>
    {props.icon &&
      <StyledHeaderIcon icon={props.icon}/>
    }
    {props.label &&
      <StyledLabel>{props.label}</StyledLabel>
    }
    <StyledHorizontalLine/>
    {props.itemsTotal && props.itemsTotal > 0 && !props.open &&
      <StyledItemsTotal>({props.itemsTotal})</StyledItemsTotal>
    }
    {props.toggleable &&
      <>
        <StyledVerticalLine/>
        <ToggleButtonWrapper open={props.open}>
          <StyledToggleSvg/>
        </ToggleButtonWrapper>
      </>
    }
  </StyledPanelHeader>
)
