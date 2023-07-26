import CalendarChevron from '#veewme/web/common/calendar/calendarChevrons'
import MonthView from '#veewme/web/common/calendar/monthView'
import { addMonths, subMonths } from 'date-fns'
import * as React from 'react'
import { LeftChevronWrapper, RightChevronWrapper, StyledDateSelectOptionsWrapper } from '../common/styled'

interface DateSelectOptionsProps {
  date: Date
  onClick?: (date: Date) => void
  onCancel?: () => void
}

interface DateSelectOptionsState {
  month: Date
}

class DateSelectOptions extends React.PureComponent<DateSelectOptionsProps, DateSelectOptionsState> {
  static defaultProps: DateSelectOptionsProps = {
    date: new Date()
  }

  state: DateSelectOptionsState = {
    month: this.props.date
  }

  handleDayClick = (date: Date) => {
    if (this.props.onClick) {
      this.props.onClick(date)
    }
  }

  handlePrevMonthClick = () => {
    this.setState(prevState => ({
      month: subMonths(prevState.month, 1)
    }))
  }

  handleNextMonthClick = () => {
    this.setState(prevState => ({
      month: addMonths(prevState.month, 1)
    }))
  }

  render () {
    return (
      <StyledDateSelectOptionsWrapper>
        <LeftChevronWrapper>
          <CalendarChevron direction='left' onClick={this.handlePrevMonthClick}/>
        </LeftChevronWrapper>
        <RightChevronWrapper>
          <CalendarChevron direction='right' onClick={this.handleNextMonthClick}/>
        </RightChevronWrapper>
        <MonthView
          month={this.state.month}
          selectedDateOrRange={this.props.date}
          onDayClick={this.handleDayClick}
        />
      </StyledDateSelectOptionsWrapper>
    )
  }
}

export default DateSelectOptions
