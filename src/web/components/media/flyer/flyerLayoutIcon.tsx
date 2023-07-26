import { FlyerLayoutName } from '#veewme/gen/graphqlTypes'
import * as React from 'react'
import flyerLayoutIcons from '../../../common/flyerIcons'
import styled from '../../../common/styled-components'

import { Check } from 'styled-icons/fa-solid'

const LayoutIconWrapper = styled.div<{ isActive?: boolean}>`
  width: 100%;
  position: relative;
  border: 2px solid ${props => props.isActive ? props.theme.colors.GREEN : props.theme.colors.BORDER};
  border-width: ${props => props.isActive ? 2 : 1}px;
  background:${props => props.theme.colors.ACTIONBAR_BACKGROUND};
  padding: 16px;
  margin: 10px 0;
  transition: border-color .5s;

  svg {
    max-width: 100%;
    height: 100%;
    object-fit: cover;
    background: #fff;
  }
`

const CheckmarkWrapper = styled.div<{ isActive?: boolean }>`
  position: absolute;
  left: 7px;
  top: 7px;
  width: 32px;
  height: 32px;
  padding: 4px 7px;
  border-radius: 100%;
  background: ${props => props.isActive ? props.theme.colors.GREEN : '#fff'};
  border: 1px solid ${props => props.isActive ? props.theme.colors.GREEN : props.theme.colors.BORDER};
  ${props => props.isActive === undefined && `display: none;`}

  svg {
    color: ${props => props.isActive ? '#fff' : props.theme.colors.BORDER};
    background: transparent
  }
`

export interface FlyerLayoutIconProps {
  layoutName: FlyerLayoutName
  className?: string // allows extending styled-compontns
  onClick?: () => void
  isActive?: boolean
}

const FlyerLayoutIcon: React.FunctionComponent<FlyerLayoutIconProps> = props => {
  const LayoutIcon = flyerLayoutIcons[props.layoutName]
  return (
    <LayoutIconWrapper className={props.className} isActive={props.isActive} onClick={props.onClick}>
      <CheckmarkWrapper isActive={props.isActive}>
        <Check />
      </CheckmarkWrapper>
      <LayoutIcon />
    </LayoutIconWrapper>
  )
}

export default React.memo(FlyerLayoutIcon)
