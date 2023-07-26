import { itemShadow } from '#veewme/web/common/styled'
import styled from '#veewme/web/common/styled-components'
import { Position } from '../dateRangeSelect/dateRangeSelectOptions'

export const StyledDateFieldWrapper = styled.div `
  position: relative;
  outline: none;
  font-size: 13px;
`

export const LeftChevronWrapper = styled.div`
  position: absolute;
  left: 4px;
  top: 5px;
`

export const RightChevronWrapper = styled.div`
  position: absolute;
  right: 4px;
  top: 5px;
`

export const StyledDateSelectOptionsWrapper = styled.div<{
  calendarPosition?: Position
}>`
  position: absolute;
  display: flex;
  right: 0px;
  z-index: 10;
  max-height: 300px;
  border: 1px solid ${props => props.theme.colors.BUTTON_BORDER};
  background-color: ${props => props.theme.colors.HEADER_BACKGROUND};
  border-radius: 0 0 5px 5px;
  ${itemShadow}

  ${props => props.calendarPosition === 'right' && `
    right: unset;
    left: 0;
    flex-direction: row-reverse;
  `}
`
