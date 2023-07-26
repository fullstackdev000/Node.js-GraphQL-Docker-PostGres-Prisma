import CalendarSvg from '#veewme/web/assets/svg/calendar.svg'
import XSvg from '#veewme/web/assets/svg/x.svg'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

export const StyledField = styled.div<{ focused: boolean }> `
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  min-height: 32px;
  width: 100%;
  margin-bottom: 5px;
  border: 2px solid ${props => props.focused ? props.theme.colors.BUTTON_BORDER_HOVER : props.theme.colors.BUTTON_BORDER};
`

export const StyledHeader = styled.div `
  flex: 1;
  outline: none;
  border: none;
  padding: 0 8px 0 6px;
`

export const StyledPlaceholder = styled.p `
  color: grey;
`

export const StyledText = styled.p `
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

export const StyledButtonsContainer = styled.div `
  flex: 0 0;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-self: stretch;
`

export const StyledIconWrapper = styled.div `
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  min-width: 12px;
  margin-right: 8px;
  border: none;
  background-color: transparent;
  cursor: pointer;
`

export const StyledCalendarIcon = styled(CalendarSvg) `
  width: 12px;
  height: 20px;
  fill: ${props => props.theme.colors.ICON_HOVER};
`

export const StyledClearIcon = styled(XSvg) `
  width: 12px;
  height: 12px;
  fill: ${props => props.theme.colors.ALERT};
`

interface DateBoxProps {
  text?: string
  focused: boolean
  onToggleOptions: () => void
  placeholder?: string
  onClearClick: (e: React.MouseEvent<HTMLDivElement>) => void
}

const DateBox: React.FunctionComponent<DateBoxProps> = props => (
  <StyledField focused={props.focused} onClick={() => props.onToggleOptions()}>
    <StyledHeader>
      {props.text &&
        <StyledText>
          {props.text}
        </StyledText>
      }
      {!props.text &&
        <StyledPlaceholder>{props.placeholder}</StyledPlaceholder>
      }
    </StyledHeader>
    <StyledButtonsContainer>
      {props.text &&
        <StyledIconWrapper onClick={props.onClearClick}>
          <StyledClearIcon/>
        </StyledIconWrapper>
      }
      <StyledIconWrapper>
        <StyledCalendarIcon/>
      </StyledIconWrapper>
    </StyledButtonsContainer>
  </StyledField>
)

export default DateBox
