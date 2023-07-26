import { DateRange } from '#veewme/lib/types'
import { format, isSameDay } from 'date-fns'
import * as React from 'react'
import DateBox from '../common/dateBox'
import { StyledDateFieldWrapper } from '../common/styled'
import DateRangeSelectOptions, { Position } from './dateRangeSelectOptions'

export interface DateRangeSelectProps {
  dateRange?: DateRange
  dateFormat: string
  placeholder?: string
  className?: string
  onChange?: (dateRange?: DateRange) => void
  calendarPosition?: Position
}

interface DateRangeSelectState {
  dateFormat: string
  dropdown: boolean
  focused: boolean
}

export default class DateRangeSelect extends React.PureComponent<DateRangeSelectProps, DateRangeSelectState> {
  static defaultProps: DateRangeSelectProps = {
    dateFormat: 'MM/DD/YYYY'
  }

  state: DateRangeSelectState = {
    dateFormat: this.props.dateFormat,
    dropdown: false,
    focused: false
  }

  formatHeaderText = () => {
    if (this.props.dateRange) {
      const { start, end } = this.props.dateRange
      if (isSameDay(start, end)) {
        return format(start, this.state.dateFormat)
      } else {
        return format(start, this.state.dateFormat) + ' - ' + format(end, this.state.dateFormat)
      }
    } else {
      return undefined
    }
  }

  toggleOptions = (callback?: () => void) => {
    this.setState(prevState => ({
      dropdown: !prevState.dropdown
    }), callback)
  }

  handleBlur = () => {
    this.setState({
      dropdown: false,
      focused: false
    })
  }

  handleFocus = () => {
    this.setState({
      focused: true
    })
  }

  handleOptionClick = (dateRange: DateRange) => {
    this.toggleOptions(() => {
      if (this.props.onChange) {
        this.props.onChange(dateRange)
      }
    })
  }

  handleClearClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      dropdown: false
    }, () => {
      if (this.props.onChange) {
        this.props.onChange()
      }
    })
  }

  render () {
    return (
      <StyledDateFieldWrapper className={this.props.className} onFocus={this.handleFocus} onBlur={this.handleBlur} tabIndex={0}>
        <DateBox
          text={this.formatHeaderText()}
          placeholder={this.props.placeholder}
          onToggleOptions={this.toggleOptions}
          onClearClick={this.handleClearClick}
          focused={this.state.focused}
        />
        {this.state.dropdown &&
          <DateRangeSelectOptions
            dateRange={this.props.dateRange}
            onClick={this.handleOptionClick}
            onCancel={this.handleBlur}
            calendarPosition={this.props.calendarPosition}
          />
        }
      </StyledDateFieldWrapper>
    )
  }
}
