import { format } from 'date-fns'
import * as React from 'react'
import DateBox from '../common/dateBox'
import { StyledDateFieldWrapper } from '../common/styled'
import DateSelectOptions from './dateSelectOptions'

export interface DateSelectProps {
  date?: Date
  dateFormat: string
  placeholder?: string
  className?: string
  onChange?: (date?: Date) => void
}

interface DateSelectState {
  dateFormat: string
  dropdown: boolean
  focused: boolean
}

export default class DateSelect extends React.PureComponent<DateSelectProps, DateSelectState> {
  static defaultProps: DateSelectProps = {
    dateFormat: 'MM/DD/YYYY'
  }

  state: DateSelectState = {
    dateFormat: this.props.dateFormat,
    dropdown: false,
    focused: false
  }

  formatHeaderText = () => {
    if (this.props.date) {
      return format(this.props.date, this.state.dateFormat)
    } else {
      return undefined
    }
  }

  toggleOptions = () => {
    this.setState(prevState => ({
      dropdown: !prevState.dropdown
    }))
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

  handleOptionClick = (date: Date) => {
    this.toggleOptions()
    if (this.props.onChange) {
      this.props.onChange(date)
    }
  }

  handleClearClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      dropdown: false
    })
    if (this.props.onChange) {
      this.props.onChange()
    }
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
        {
          this.state.dropdown &&
          <DateSelectOptions
            date={this.props.date}
            onClick={this.handleOptionClick}
            onCancel={this.handleBlur}
          />
        }
      </StyledDateFieldWrapper>
    )
  }
}
