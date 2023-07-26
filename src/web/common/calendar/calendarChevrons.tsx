import ArrowSvg from '#veewme/web/assets/svg/arrow.svg'
import * as React from 'react'
import styled from '../styled-components'

type DirectionType = 'left' | 'right'

const StyledWrapper = styled.div`
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const StyledChevron = styled(ArrowSvg) <{ direction: DirectionType }> `
  width: 12px;
  height: 8px;
  fill: ${props => props.theme.colors.ICON_UNSELECTED};
  transform: rotate(${props => props.direction === 'left' ? '90deg' : '-90deg'});
  &:hover, &:active {
    fill: ${props => props.theme.colors.ICON_HOVER};
  }
`

interface CalendarChevronProps {
  onClick: () => void
  direction: DirectionType
}

const CalendarChevron: React.FunctionComponent<CalendarChevronProps> = props => (
  <StyledWrapper onClick={props.onClick}>
    <StyledChevron direction={props.direction} />
  </StyledWrapper>
)

export default CalendarChevron
