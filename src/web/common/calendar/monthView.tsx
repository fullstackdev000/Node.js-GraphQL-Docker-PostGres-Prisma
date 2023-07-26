import { DateRange, isDateRange } from '#veewme/lib/types'
import { addDays, eachDay, endOfMonth, endOfWeek, format, getDayOfYear, isAfter, isBefore, isSameDay, isSunday, isToday, startOfMonth, startOfWeek } from 'date-fns'
import * as React from 'react'
import styled from '../styled-components'

const StyledHeaderWrapper = styled.div `
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 4px;
`

const StyledH4 = styled.h4 `
  font-size: 13px;
  color: ${props => props.theme.colors.LABEL_TEXT};
  user-select: none;
`

interface MonthViewHeaderProps {
  dateFormat?: string
  month: Date
}

const MonthViewHeader: React.FunctionComponent<MonthViewHeaderProps> = props => (
  <StyledHeaderWrapper>
    <StyledH4>
      {format(props.month, props.dateFormat)}
    </StyledH4>
  </StyledHeaderWrapper>
)

MonthViewHeader.defaultProps = {
  dateFormat: 'MMM YYYY'
}

const StyledWeekDaysWrapper = styled.div `
  display: flex;
  align-items: center;
`

const StyledWeekDay = styled.div `
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  & p {
    font-size: 10px;
    color: ${props => props.theme.colors.LABEL_TEXT};
  }
`

const WeekDaysHeader: React.FunctionComponent<{}> = () => {
  const weekDayNames: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  return (
    <StyledWeekDaysWrapper>
      {weekDayNames.map((name: string, idx: number) => (
        <StyledWeekDay key={idx}>
          <p>{name}</p>
        </StyledWeekDay>
      ))}
    </StyledWeekDaysWrapper>
  )
}

const StyledDayCell = styled.div<DayCellProps> `
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid ${props => props.inCurrentMonth && props.today ? props.theme.colors.CALENDAR_RANGE_LIMIT : 'transparent'};
  background-color: ${props => props.inCurrentMonth && props.withinRange ? props.theme.colors.CALENDAR_WITHIN_RANGE : 'transparent'};
  background-color: ${props => props.inCurrentMonth && props.isRangeEdge && props.theme.colors.CALENDAR_RANGE_LIMIT};
  cursor: ${props => props.onClick ? 'pointer' : 'auto'};
  & p {
    color: ${props => props.inCurrentMonth ? props.theme.colors.LABEL_TEXT_HOVER : props.theme.colors.LABEL_TEXT};
    color: ${props => props.inCurrentMonth && props.isRangeEdge && 'white'};
    font-size: 11px;
    user-select: none;
  }
`

interface DayCellProps {
  dateFormat: string
  day: Date
  inCurrentMonth: boolean
  isRangeEdge?: boolean
  withinRange?: boolean
  today?: boolean
  onClick?: () => void
}

const DayCell: React.FunctionComponent<DayCellProps> = props => (
  <StyledDayCell {...props}>
    <p>{format(props.day, props.dateFormat)}</p>
  </StyledDayCell>
)

const StyledRow = styled.div `
  display: flex;
  align-items: center;
`

interface MonthViewDaysTableProps {
  month: Date
  dateFormat: string
  selectedDateOrRange?: Date | DateRange
  onDayClick?: (date: Date) => void
}

const MonthViewDaysTable: React.FunctionComponent<MonthViewDaysTableProps> = props => {
  const { selectedDateOrRange } = props
  const monthStart: Date = startOfMonth(props.month)
  const monthEnd: Date = endOfMonth(monthStart)
  const startDate: Date = startOfWeek(monthStart)
  const endDate: Date = endOfWeek(monthEnd)
  const Sundays: Date[] = eachDay(startDate, endDate).filter(day => (isSunday(day) && !isAfter(day, endDate)))

  const handleDayClick = (date: Date) => {
    if (props.onDayClick) {
      props.onDayClick(date)
    }
  }

  const inCurrentMonth = (date: Date): boolean => {
    return (date >= monthStart) && (date <= monthEnd)
  }

  return (
    <>
      {Sundays.map((sunday, i) => (
        <StyledRow key={i}>
          {eachDay(sunday, addDays(sunday, 6)).map(day => {
            const isRangeLeftEdge = isDateRange(selectedDateOrRange) && isSameDay(day, selectedDateOrRange.start)
            const isRangeRightEdge = isDateRange(selectedDateOrRange) && isSameDay(day, selectedDateOrRange.end)
            const isOnOrAfterRangeStart = isRangeLeftEdge || isDateRange(selectedDateOrRange) && isAfter(day, selectedDateOrRange.start)
            const isOnOrBeforeRangeEnd = isRangeRightEdge || isDateRange(selectedDateOrRange) && isBefore(day, selectedDateOrRange.end)

            return (
              <DayCell
                key={getDayOfYear(day)}
                day={day}
                dateFormat={props.dateFormat}
                inCurrentMonth={inCurrentMonth(day)}
                onClick={inCurrentMonth(day) ? () => handleDayClick(day) : undefined}
                isRangeEdge={isRangeLeftEdge || isRangeRightEdge}
                withinRange={isOnOrAfterRangeStart && isOnOrBeforeRangeEnd}
                today={isToday(day)}
              />
            )
          })}
        </StyledRow>
      ))}
    </>
  )
}

const StyledMonthView = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
`

interface MonthViewProps {
  headerDateFormat?: string
  selectedDateOrRange?: Date | DateRange
  month: Date
  onDayClick?: (date: Date) => void
}

const MonthView: React.FunctionComponent<MonthViewProps> = props => {
  const handleDayClick = (date: Date) => {
    if (props.onDayClick) {
      props.onDayClick(date)
    }
  }

  return (
    <StyledMonthView>
      <MonthViewHeader
        dateFormat={props.headerDateFormat}
        month={props.month}
      />
      <WeekDaysHeader />
      <MonthViewDaysTable
        dateFormat='D'
        selectedDateOrRange={props.selectedDateOrRange}
        month={props.month}
        onDayClick={handleDayClick}
      />
    </StyledMonthView>
  )
}

MonthView.defaultProps = {
  month: new Date()
}

export default MonthView
