import { DateRange, isDateRange } from '#veewme/lib/types'
import CalendarChevron from '#veewme/web/common/calendar/calendarChevrons'
import MonthView from '#veewme/web/common/calendar/monthView'
import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'
import { addMonths, endOfDay, isDate, max, min, startOfDay, subMonths } from 'date-fns'
import * as React from 'react'
import { LeftChevronWrapper, RightChevronWrapper } from '../common/styled'

export type DateRangeSelection =
  | undefined // no selection at all
  | Date // initial selection of first (starting or ending) date
  | DateRange // final selection of a date range

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 8px;
  border-radius: 0 0 5px 5px;
  background-color: ${props => props.theme.colors.HEADER_BACKGROUND};
`

const StyledDoubleCalendar = styled.div`
  flex: 1;
  position: relative;
  display: flex;
`

const Space = styled.div`
  width: 16px;
`

const ActionBar = styled.div`
  min-height: 20px;
  border-top: 1px solid ${props => props.theme.colors.BUTTON_BORDER};
  padding: 4px;
`

const StyledUL = styled.div`
  display: flex;
  justify-content: flex-end;
  list-style: none;
`

const StyledLI = styled.li`
  min-width: 65px;
  padding: 6px 8px;
  margin: 0 8px;
  font-size: 11px;
  border: 2px solid ${props => props.theme.colors.BUTTON_BORDER};
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    border: 2px solid ${props => props.theme.colors.BUTTON_BORDER_HOVER};
  }
`

interface DoubleMonthCalendarProps {
  dateRange?: DateRange
  onOkClick?: (selectedDateRange: DateRange) => void
  onCancelClick?: () => void
}

interface DoubleMonthCalendarState {
  currentSelection: DateRangeSelection
  leftMonth: Date
}

class DoubleMonthCalendar extends React.PureComponent<DoubleMonthCalendarProps, DoubleMonthCalendarState> {
  state: DoubleMonthCalendarState = {
    currentSelection: this.props.dateRange,
    leftMonth: this.props.dateRange ? subMonths(this.props.dateRange.end, 1) : new Date()
  }

  getDateRangeFromSelection = (selection: DateRangeSelection) => {
    if (!selection || isDateRange(selection)) {
      return selection
    } else if (isDate(selection)) {
      return {
        end: endOfDay(selection),
        start: startOfDay(selection)
      }
    } else {
      log.error(`Unknown selection ${selection}`)
      return undefined
    }
  }

  handlePrevMonthClick = () => {
    this.setState(prevState => ({
      leftMonth: subMonths(prevState.leftMonth, 1)
    }))
  }

  handleNextMonthClick = () => {
    this.setState(prevState => ({
      leftMonth: addMonths(prevState.leftMonth, 1)
    }))
  }

  handleDayClick = (clickedDate: Date) => {
    this.setState(prevState => {
      const currentSelection = (prevSelection => {
        if (!prevSelection || isDateRange(prevSelection)) {
          return clickedDate
        } else if (isDate(prevSelection)) {
          return {
            end: endOfDay(max(prevSelection, clickedDate)),
            start: startOfDay(min(prevSelection, clickedDate))
          }
        } else {
          log.error(`Unknown currentSelection ${prevState.currentSelection}`)
          return prevSelection
        }
      })(prevState.currentSelection)

      return { currentSelection }
    })
  }

  handleOkClick = () => {
    const dateRange = this.getDateRangeFromSelection(this.state.currentSelection)
    if (this.props.onOkClick && dateRange) {
      this.props.onOkClick(dateRange)
    }
  }

  render () {
    return (
      <StyledWrapper>
        <StyledDoubleCalendar>
          <LeftChevronWrapper>
            <CalendarChevron direction='left' onClick={this.handlePrevMonthClick}/>
          </LeftChevronWrapper>
          <RightChevronWrapper>
            <CalendarChevron direction='right' onClick={this.handleNextMonthClick}/>
          </RightChevronWrapper>
          <MonthView
            month={this.state.leftMonth}
            onDayClick={this.handleDayClick}
            selectedDateOrRange={this.getDateRangeFromSelection(this.state.currentSelection)}
          />
          <Space />
          <MonthView
            month={addMonths(this.state.leftMonth, 1)}
            onDayClick={this.handleDayClick}
            selectedDateOrRange={this.getDateRangeFromSelection(this.state.currentSelection)}
          />
        </StyledDoubleCalendar>
        <ActionBar>
          <StyledUL>
            <StyledLI onClick={this.handleOkClick}>Accept</StyledLI>
            <StyledLI onClick={this.props.onCancelClick}>Cancel</StyledLI>
          </StyledUL>
        </ActionBar>
      </StyledWrapper>
    )
  }
}

export default DoubleMonthCalendar
