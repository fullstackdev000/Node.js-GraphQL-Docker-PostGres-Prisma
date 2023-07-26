import { DateRange } from '#veewme/lib/types'
import styled from '#veewme/web/common/styled-components'
import { endOfMonth, endOfToday, startOfMonth, startOfToday, subDays, subMonths } from 'date-fns'
import * as React from 'react'
import { StyledDateSelectOptionsWrapper } from '../common/styled'
import DoubleMonthCalendar from './doubleMonthCalendar'

const StyledListWrapper = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  min-height: 100%;
`

const StyledLI = styled.li `
  min-width: 130px;
  padding: 6px 8px;
  margin: 9px 8px;
  font-size: 11px;
  border: 2px solid ${props => props.theme.colors.BUTTON_BORDER};
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    border: 2px solid ${props => props.theme.colors.BUTTON_BORDER_HOVER};
  }
`
export type Position = 'left' | 'right'

interface DateSelectOptionsProps {
  dateRange?: DateRange
  onClick: (dateRange: DateRange) => void
  onCancel?: () => void
  calendarPosition?: Position
}

interface DateSelectOptionsState {
  calendarOpen: boolean
}

class DateSelectOptions extends React.PureComponent<DateSelectOptionsProps, DateSelectOptionsState> {
  state: DateSelectOptionsState = {
    calendarOpen: false
  }

  handleCustomDateClick = () => {
    this.setState({
      calendarOpen: true
    })
  }

  handleCalendarOk = (dateRange: DateRange) => {
    this.props.onClick(dateRange)
  }

  handleCalendarCancel = () => {
    this.setState({
      calendarOpen: false
    }, () => {
      if (this.props.onCancel) {
        this.props.onCancel()
      }
    })
  }

  render () {
    return (
      <StyledDateSelectOptionsWrapper calendarPosition={this.props.calendarPosition}>
        {this.state.calendarOpen &&
          <DoubleMonthCalendar
            onCancelClick={this.handleCalendarCancel}
            onOkClick={this.handleCalendarOk}
            dateRange={this.props.dateRange}
          />
        }
        <StyledListWrapper>
          <ul>
            <StyledLI onClick={() => this.props.onClick({ start: startOfToday(), end: endOfToday() })}>Today</StyledLI>
            <StyledLI onClick={() => this.props.onClick({ start: subDays(startOfToday(), 7), end: endOfToday() })}>Last 7 days</StyledLI>
            <StyledLI onClick={() => this.props.onClick({ start: subDays(startOfToday(), 30), end: endOfToday() })}>Last 30 days</StyledLI>
            <StyledLI onClick={() => this.props.onClick({ start: startOfMonth(startOfToday()), end: endOfMonth(endOfToday()) })}>This month</StyledLI>
            <StyledLI onClick={() => this.props.onClick({ start: startOfMonth(subMonths(startOfToday(), 1)), end: endOfMonth(subMonths(endOfToday(), 1)) })}>Last month</StyledLI>
            <StyledLI onClick={() => this.props.onClick({ start: subDays(startOfToday(), 90), end: endOfToday() })}>Last 90 days</StyledLI>
            <StyledLI onClick={() => this.handleCustomDateClick()}>Custom range</StyledLI>
          </ul>
        </StyledListWrapper>
      </StyledDateSelectOptionsWrapper>
    )
  }
}

export default DateSelectOptions
